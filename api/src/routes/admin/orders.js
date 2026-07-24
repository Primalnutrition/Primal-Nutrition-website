import { Router } from 'express'
import { listOrders, getOrderById, updateOrderStatus } from '../../services/orderService.js'

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

export default router
