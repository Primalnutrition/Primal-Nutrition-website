import { getAdminClient } from '../lib/supabase.js'

function requireSupabase() {
  const client = getAdminClient()
  if (!client) throw Object.assign(new Error('Supabase not configured'), { statusCode: 503, code: 'SUPABASE_NOT_CONFIGURED' })
  return client
}

function httpError(message, statusCode, code) {
  const err = new Error(message)
  err.statusCode = statusCode
  err.code = code
  return err
}

function generateOrderNumber() {
  return `PRMNL-${Date.now().toString().slice(-9)}`
}

/**
 * Create a draft order (status = pending) before payment.
 *
 * - Upserts customer by email
 * - Inserts a shipping address row
 * - Validates every cart item against DB prices (defends against client price tampering)
 * - Inserts orders + order_items
 *
 * Returns the new internal order id, order_number, total in paise (for Razorpay),
 * plus the customer + items snapshot for Razorpay notes / receipts.
 *
 * @param {{
 *   customer: { name: string, email: string, phone: string },
 *   address: { fullName: string, phone: string, line1: string, line2?: string, city: string, state: string, pincode: string, country?: string },
 *   items: Array<{ productId: string, variantId: string, qty: number }>,
 *   couponCode?: string
 * }} input
 */
export async function createDraftOrder({ customer, address, items }) {
  const supabase = requireSupabase()

  // 1. Resolve every variant from DB to get authoritative pricing
  const variantIds = items.map((i) => i.variantId)
  const { data: variants, error: vErr } = await supabase
    .from('variants')
    .select('id, product_id, label, price, stock_qty, products:product_id (id, name)')
    .in('id', variantIds)
  if (vErr) throw vErr

  const variantMap = new Map(variants.map((v) => [v.id, v]))
  const lineItems = items.map((i) => {
    const v = variantMap.get(i.variantId)
    if (!v) throw httpError(`Variant ${i.variantId} not found`, 422, 'INVALID_VARIANT')
    if (v.product_id !== i.productId) throw httpError(`Variant ${i.variantId} does not belong to product ${i.productId}`, 422, 'VARIANT_PRODUCT_MISMATCH')
    if (v.stock_qty < i.qty) throw httpError(`Variant ${i.variantId} is out of stock`, 409, 'OUT_OF_STOCK')
    return {
      product_id: v.product_id,
      variant_id: v.id,
      product_name_snapshot: v.products?.name ?? v.product_id,
      variant_label_snapshot: v.label,
      qty: i.qty,
      unit_price: v.price,
      line_total: v.price * i.qty,
    }
  })

  const subtotal = lineItems.reduce((sum, li) => sum + li.line_total, 0)
  const shippingFee = subtotal >= 1000 ? 0 : 50
  const discount = 0
  const tax = 0
  const total = subtotal + shippingFee + tax - discount

  // 2. Upsert customer by email
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', customer.email)
    .maybeSingle()

  let customerId = existingCustomer?.id
  if (!customerId) {
    const { data: newCustomer, error: cErr } = await supabase
      .from('customers')
      .insert({ email: customer.email, name: customer.name, phone: customer.phone })
      .select('id')
      .single()
    if (cErr) throw cErr
    customerId = newCustomer.id
  } else {
    await supabase.from('customers').update({ name: customer.name, phone: customer.phone }).eq('id', customerId)
  }

  // 3. Insert address
  const { data: addr, error: aErr } = await supabase
    .from('addresses')
    .insert({
      customer_id: customerId,
      line1: address.line1,
      line2: address.line2 ?? null,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country ?? 'India',
    })
    .select('id')
    .single()
  if (aErr) throw aErr

  // 4. Insert order
  const orderNumber = generateOrderNumber()
  const { data: order, error: oErr } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: customerId,
      shipping_address_id: addr.id,
      subtotal,
      discount,
      shipping_fee: shippingFee,
      tax,
      total,
      status: 'pending',
    })
    .select('id, order_number, total')
    .single()
  if (oErr) throw oErr

  // 5. Insert order_items
  const itemsToInsert = lineItems.map((li) => ({ ...li, order_id: order.id }))
  const { error: iErr } = await supabase.from('order_items').insert(itemsToInsert)
  if (iErr) throw iErr

  return {
    internalOrderId: order.id,
    orderNumber: order.order_number,
    totalRupees: Number(order.total),
    totalPaise: Math.round(Number(order.total) * 100),
    customer: { id: customerId, name: customer.name, email: customer.email, phone: customer.phone },
    address: { ...address, id: addr.id },
    items: lineItems,
  }
}

/**
 * Attach Razorpay's order id to an existing internal order.
 */
export async function attachRazorpayOrder(internalOrderId, razorpayOrderId) {
  const supabase = requireSupabase()
  const { error } = await supabase
    .from('orders')
    .update({ razorpay_order_id: razorpayOrderId, payment_method: 'razorpay' })
    .eq('id', internalOrderId)
  if (error) throw error
}

/**
 * Mark order paid. Idempotent — if already paid, returns existing order without re-writing.
 *
 * @param {{ internalOrderId: string, razorpayPaymentId: string }} params
 */
export async function markOrderPaid({ internalOrderId, razorpayPaymentId }) {
  const supabase = requireSupabase()

  const { data: existing, error: gErr } = await supabase
    .from('orders')
    .select('id, status, razorpay_payment_id, razorpay_order_id')
    .eq('id', internalOrderId)
    .single()
  if (gErr) throw gErr
  if (existing.status === 'paid' || existing.status === 'shipped' || existing.status === 'delivered') {
    return { alreadyPaid: true, order: existing }
  }

  const { data: updated, error: uErr } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      razorpay_payment_id: razorpayPaymentId,
      paid_at: new Date().toISOString(),
    })
    .eq('id', internalOrderId)
    .select('id, order_number, razorpay_order_id, razorpay_payment_id, total, status, paid_at')
    .single()
  if (uErr) throw uErr

  return { alreadyPaid: false, order: updated }
}

/**
 * Persist Shiprocket shipment details on an existing order.
 *
 * @param {string} internalOrderId
 * @param {{ shiprocketOrderId?: string, awbCode?: string, courierName?: string, shippedAt?: string, deliveredAt?: string, status?: string }} details
 */
export async function applyShipmentDetails(internalOrderId, details) {
  const supabase = requireSupabase()
  const patch = {}
  if (details.shiprocketOrderId) patch.shiprocket_order_id = details.shiprocketOrderId
  if (details.awbCode) patch.awb_code = details.awbCode
  if (details.courierName) patch.courier_name = details.courierName
  if (details.shippedAt) patch.shipped_at = details.shippedAt
  if (details.deliveredAt) patch.delivered_at = details.deliveredAt
  if (details.status) patch.status = details.status

  if (Object.keys(patch).length === 0) return null

  const { data, error } = await supabase
    .from('orders')
    .update(patch)
    .eq('id', internalOrderId)
    .select('id, order_number, status, awb_code, shipped_at, delivered_at')
    .single()
  if (error) throw error
  return data
}

/**
 * Find an internal order by its Razorpay order id (used by the webhook).
 */
export async function findOrderByRazorpayId(razorpayOrderId) {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, status, razorpay_order_id, razorpay_payment_id, total, customer_id')
    .eq('razorpay_order_id', razorpayOrderId)
    .maybeSingle()
  if (error) throw error
  return data
}

/**
 * Find an internal order by AWB code or Shiprocket order id (used by Shiprocket webhook).
 */
export async function findOrderByShipmentRef({ awbCode, shiprocketOrderId }) {
  const supabase = requireSupabase()
  let query = supabase.from('orders').select('id, order_number, status, awb_code, shiprocket_order_id')
  if (awbCode) query = query.eq('awb_code', awbCode)
  else if (shiprocketOrderId) query = query.eq('shiprocket_order_id', shiprocketOrderId)
  else return null
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  return data
}

/**
 * Get a draft order's full detail by ID (used internally after creation + by verify-payment).
 */
export async function getOrderForShipment(internalOrderId) {
  const supabase = requireSupabase()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, order_number, total, subtotal, shipping_fee, discount,
      customer:customers (id, name, email, phone),
      shipping_address:addresses (line1, line2, city, state, pincode, country),
      order_items (
        product_name_snapshot, variant_label_snapshot, qty, unit_price, line_total,
        variant:variants (id, label)
      )
    `)
    .eq('id', internalOrderId)
    .single()
  if (error) throw error
  return data
}

/**
 * List orders with pagination and optional filters.
 *
 * @param {{ page?: number, limit?: number, status?: string, customerId?: string, from?: string, to?: string }} opts
 */
export async function listOrders({ page = 1, limit = 25, status, customerId, from, to } = {}) {
  const supabase = requireSupabase()
  const offset = (page - 1) * Math.min(limit, 100)

  let query = supabase
    .from('orders')
    .select(
      `
      id, order_number, status, subtotal, discount, shipping_fee, tax, total,
      payment_method, placed_at, paid_at, shipped_at, delivered_at, cancelled_at,
      awb_code, courier_name,
      customer:customers (id, name, email, phone)
    `,
      { count: 'exact' }
    )
    .order('placed_at', { ascending: false })
    .range(offset, offset + Math.min(limit, 100) - 1)

  if (status) query = query.eq('status', status)
  if (customerId) query = query.eq('customer_id', customerId)
  if (from) query = query.gte('placed_at', from)
  if (to) query = query.lte('placed_at', to)

  const { data, error, count } = await query
  if (error) throw error

  return {
    data: data ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  }
}

/**
 * Get a single order by ID with full detail.
 *
 * @param {string} id — UUID
 */
export async function getOrderById(id) {
  const supabase = requireSupabase()

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id, order_number, status, subtotal, discount, shipping_fee, tax, total,
      payment_method, razorpay_order_id, razorpay_payment_id,
      shiprocket_order_id, awb_code, courier_name,
      placed_at, paid_at, shipped_at, delivered_at, cancelled_at,
      customer:customers (id, name, email, phone),
      shipping_address:addresses (line1, line2, city, state, pincode, country),
      order_items (
        id, product_name_snapshot, variant_label_snapshot, qty, unit_price, line_total,
        product:products (id, slug, name, image),
        variant:variants (id, label)
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      const err = new Error('Order not found')
      err.statusCode = 404
      err.code = 'NOT_FOUND'
      throw err
    }
    throw error
  }

  return data
}
