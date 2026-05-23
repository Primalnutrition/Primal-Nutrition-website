import { Router } from 'express'
import { listOrders, getOrderById } from '../../services/orderService.js'

const router = Router()

/**
 * GET /api/admin/orders
 * Paginated list, filterable by status / customer / date range.
 *
 * Query params: page, limit, status, customer_id, from (ISO date), to (ISO date)
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await listOrders({
      page: parseInt(req.query.page ?? '1', 10),
      limit: parseInt(req.query.limit ?? '25', 10),
      status: req.query.status ?? undefined,
      customerId: req.query.customer_id ?? undefined,
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

export default router
