import { Router } from 'express'
import { listOrders, getOrderById, updateOrderStatus } from '../../services/orderService.js'
import { syncOrderToIthink, buildIthinkShipment } from '../checkout.js'
import { syncOrders, isIthinkConfigured } from '../../lib/ithink.js'

const router = Router()

/**
 * GET /api/admin/orders
 * Paginated list, filterable by status / customer / date range.
 *
 * Query params: page, limit, status, customer_id, range (7d|30d|90d), from (ISO), to (ISO)
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await listOrders({
      page: parseInt(req.query.page ?? '1', 10),
      limit: parseInt(req.query.limit ?? '25', 10),
      status: req.query.status ?? undefined,
      customerId: req.query.customer_id ?? undefined,
      range: req.query.range ?? undefined,
      from: req.query.from ?? undefined,
      to: req.query.to ?? undefined,
    })
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/admin/orders/:id
 * Full order detail with line items, customer, and address.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id)
    return res.json(order)
  } catch (err) {
    next(err)
  }
})

/**
 * PATCH /api/admin/orders/:id/status
 * Transition an order to a new status with guard-rail validation.
 *
 * Body: { status: 'shipped' | 'delivered' | 'cancelled' }
 * Allowed transitions:
 *   pending  → shipped | cancelled
 *   paid     → shipped | cancelled
 *   shipped  → delivered | cancelled
 */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body ?? {}
    if (!status) return res.status(400).json({ error: 'MISSING_STATUS', message: 'Body must contain { status }' })
    const updated = await updateOrderStatus({ orderId: req.params.id, status })
    return res.json(updated)
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/admin/orders/:id/sync-ithink
 * (Re)send one order to iThink's Store Order list. Safe to repeat: iThink keys
 * orders by order number.
 */
router.post('/:id/sync-ithink', async (req, res, next) => {
  try {
    const result = await syncOrderToIthink(req.params.id, { force: true })
    if (result?.skipped) {
      return res.status(503).json({ error: 'ITHINK_NOT_CONFIGURED', message: 'iThink keys are not set on the server' })
    }
    return res.json({ ok: true })
  } catch (err) {
    return res.status(502).json({ error: 'ITHINK_SYNC_FAILED', message: err.message })
  }
})

/**
 * POST /api/admin/orders/ithink-test
 * Sends one clearly-labelled dummy order ("TEST-PRIMAL-…") to iThink so the
 * integration can be checked in the panel without touching real orders.
 * Delete/cancel it in the iThink panel afterwards.
 */
router.post('/ithink-test', async (req, res) => {
  if (!isIthinkConfigured()) {
    return res.status(503).json({ error: 'ITHINK_NOT_CONFIGURED', message: 'iThink keys are not set on the server' })
  }
  const orderNumber = `TEST-PRIMAL-${Date.now().toString().slice(-6)}`
  const shipment = buildIthinkShipment({
    order_number: orderNumber,
    placed_at: new Date().toISOString(),
    payment_method: 'cod',
    total: 1,
    shipping_fee: 0,
    discount: 0,
    customer: { name: 'TEST ORDER - DO NOT SHIP', phone: '9999999999', email: 'test@primalnutrition.in' },
    shipping_address: { line1: 'TEST ORDER - DO NOT SHIP', line2: '', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', country: 'India' },
    order_items: [{ product_name_snapshot: 'TEST ITEM', variant_label_snapshot: '', qty: 1, unit_price: 1, variant: { id: 'TEST-SKU' } }],
  })
  try {
    const response = await syncOrders([shipment])
    return res.json({ ok: true, orderNumber, response })
  } catch (err) {
    return res.status(502).json({ ok: false, orderNumber, error: err.message })
  }
})

export default router
