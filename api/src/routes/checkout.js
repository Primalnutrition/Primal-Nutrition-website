/**
 * checkout.js — Phase C live routes for storefront checkout flow.
 *
 * Pipeline:
 *   1. POST /serviceability       → ask Shiprocket if pincode is deliverable
 *   2. POST /create-order         → DB draft order + Razorpay order → frontend opens Razorpay Checkout
 *   3. POST /verify-payment       → verify signature → mark paid → create Shiprocket shipment
 */
import { Router } from 'express'
import { z } from 'zod'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'
import {
  createRazorpayOrder,
  verifyPaymentSignature,
} from '../lib/razorpay.js'
import {
  checkServiceability,
  createShipment,
} from '../lib/shiprocket.js'
import {
  createDraftOrder,
  attachRazorpayOrder,
  markOrderPaid,
  applyShipmentDetails,
  getOrderForShipment,
} from '../services/orderService.js'

const router = Router()

// ─── Validation schemas ────────────────────────────────────────────────────

const CartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  qty: z.number().int().positive().max(99),
})

const AddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  line1: z.string().min(5).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a 6-digit pincode'),
  country: z.string().default('India'),
})

const ServiceabilitySchema = z.object({
  pincode: z.string().regex(/^\d{6}$/, 'Must be a 6-digit pincode'),
  items: z.array(CartItemSchema).min(1),
})

const CreateOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  }),
  address: AddressSchema,
  items: z.array(CartItemSchema).min(1).max(50),
  couponCode: z.string().max(30).optional(),
})

const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  internalOrderId: z.string().uuid(),
})

// ─── Routes ───────────────────────────────────────────────────────────────

/**
 * POST /api/checkout/serviceability
 */
router.post('/serviceability', async (req, res, next) => {
  const result = ServiceabilitySchema.safeParse(req.body)
  if (!result.success) {
    return res.status(422).json({ error: 'VALIDATION_ERROR', issues: result.error.issues })
  }

  if (!config.shiprocket.pickupPincode) {
    return res.status(503).json({
      error: 'SHIPROCKET_NOT_CONFIGURED',
      message: 'SHIPROCKET_PICKUP_PINCODE is not set. Configure your registered pickup location.',
    })
  }

  // 500g per unit assumption — refine later by joining real product weight
  const totalWeightKg = result.data.items.reduce((sum, i) => sum + i.qty * 0.5, 0)

  try {
    const raw = await checkServiceability({
      pickupPincode: config.shiprocket.pickupPincode,
      deliveryPincode: result.data.pincode,
      weight: totalWeightKg,
    })

    const couriers = raw?.data?.available_courier_companies ?? []
    if (couriers.length === 0) {
      return res.status(200).json({
        serviceable: false,
        message: 'No couriers available for this pincode',
      })
    }

    // Pick the cheapest
    const cheapest = couriers.reduce((min, c) => (c.rate < min.rate ? c : min), couriers[0])
    return res.json({
      serviceable: true,
      estimatedDeliveryDays: cheapest.estimated_delivery_days,
      shippingRate: cheapest.rate,
      courier: cheapest.courier_name,
      codAvailable: cheapest.cod === 1,
    })
  } catch (err) {
    logger.error({ err: err.message }, 'Shiprocket serviceability failed')
    return next(err)
  }
})

/**
 * POST /api/checkout/create-order
 *
 * Returns the data the frontend needs to open Razorpay Checkout:
 *   { internalOrderId, razorpayOrderId, amount, currency, keyId, customer }
 */
router.post('/create-order', async (req, res, next) => {
  const result = CreateOrderSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(422).json({ error: 'VALIDATION_ERROR', issues: result.error.issues })
  }

  try {
    // 1. Build the draft order in our DB
    const draft = await createDraftOrder(result.data)

    // 2. Ask Razorpay for an order id
    const rzpOrder = await createRazorpayOrder({
      amount: draft.totalPaise,
      currency: 'INR',
      receipt: draft.orderNumber,
    })

    // 3. Save the Razorpay order id on our row
    await attachRazorpayOrder(draft.internalOrderId, rzpOrder.id)

    logger.info(
      { internalOrderId: draft.internalOrderId, razorpayOrderId: rzpOrder.id, total: draft.totalRupees },
      'Draft order + Razorpay order created'
    )

    return res.status(201).json({
      internalOrderId: draft.internalOrderId,
      orderNumber: draft.orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: config.razorpay.keyId,
      customer: {
        name: draft.customer.name,
        email: draft.customer.email,
        phone: draft.customer.phone,
      },
    })
  } catch (err) {
    logger.error({ err: err.message }, 'create-order failed')
    return next(err)
  }
})

/**
 * POST /api/checkout/verify-payment
 *
 * Browser calls this after Razorpay Checkout success.
 * 1. Verify the HMAC signature
 * 2. Mark the order paid
 * 3. Create the Shiprocket shipment (fire-and-forget — failures don't block the response)
 */
router.post('/verify-payment', async (req, res, next) => {
  const result = VerifyPaymentSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(422).json({ error: 'VALIDATION_ERROR', issues: result.error.issues })
  }
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, internalOrderId } = result.data

  if (!verifyPaymentSignature({ orderId: razorpayOrderId, paymentId: razorpayPaymentId, signature: razorpaySignature })) {
    logger.warn({ razorpayOrderId, razorpayPaymentId }, 'Razorpay signature mismatch')
    return res.status(400).json({ error: 'INVALID_SIGNATURE', message: 'Payment signature verification failed' })
  }

  try {
    const { alreadyPaid, order } = await markOrderPaid({ internalOrderId, razorpayPaymentId })

    // Kick off shipment in the background — don't block the payment response
    if (!alreadyPaid) {
      void createShipmentForOrder(internalOrderId).catch((err) =>
        logger.error({ err: err.message, internalOrderId }, 'Shiprocket shipment creation failed (will retry via cron)')
      )
    }

    return res.json({
      success: true,
      alreadyPaid,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paidAt: order.paid_at,
      },
    })
  } catch (err) {
    logger.error({ err: err.message }, 'verify-payment failed')
    return next(err)
  }
})

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Build the Shiprocket payload from a paid order and create the shipment.
 * Stores the returned Shiprocket order id back on the row.
 */
async function createShipmentForOrder(internalOrderId) {
  if (!config.shiprocket.email || !config.shiprocket.password) {
    logger.warn('Shiprocket not configured — skipping shipment creation')
    return
  }

  const order = await getOrderForShipment(internalOrderId)
  if (!order?.shipping_address) {
    throw new Error(`Order ${internalOrderId} has no shipping address`)
  }

  const addr = order.shipping_address
  const customer = order.customer
  const [firstName, ...rest] = (customer.name ?? 'Customer').split(' ')

  const payload = {
    order_id: order.order_number,
    order_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    pickup_location: config.shiprocket.pickupLocation,
    billing_customer_name: firstName,
    billing_last_name: rest.join(' ') || '.',
    billing_address: addr.line1,
    billing_address_2: addr.line2 ?? '',
    billing_city: addr.city,
    billing_pincode: addr.pincode,
    billing_state: addr.state,
    billing_country: addr.country,
    billing_email: customer.email,
    billing_phone: customer.phone,
    shipping_is_billing: true,
    order_items: order.order_items.map((i) => ({
      name: i.product_name_snapshot,
      sku: i.variant?.id ?? 'PRIMAL-SKU',
      units: i.qty,
      selling_price: Number(i.unit_price),
    })),
    payment_method: 'Prepaid',
    sub_total: Number(order.subtotal),
    length: 15,
    breadth: 10,
    height: 10,
    weight: Math.max(0.5, order.order_items.reduce((sum, i) => sum + i.qty * 0.5, 0)),
  }

  const result = await createShipment(payload)
  await applyShipmentDetails(internalOrderId, {
    shiprocketOrderId: String(result.order_id ?? result.shiprocket_order_id ?? ''),
    awbCode: result.awb_code ?? null,
    courierName: result.courier_name ?? null,
  })

  logger.info({ internalOrderId, shiprocketOrderId: result.order_id }, 'Shipment created in Shiprocket')
}

export default router
