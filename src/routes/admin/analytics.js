import { Router } from 'express'
import { getOverview, getTimeseries, getTopProducts } from '../../services/analyticsService.js'

const router = Router()

/**
 * GET /api/admin/analytics/overview
 * KPI cards: revenue (today/7d/30d/all), orders count, AOV,
 * active customers, dormant customers.
 */
router.get('/overview', async (req, res, next) => {
  try {
    const data = await getOverview()
    return res.json(data)
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/admin/analytics/timeseries
 * Daily data series for charts.
 *
 * Query params: range (7d|30d|90d|all), metric (revenue|orders)
 */
router.get('/timeseries', async (req, res, next) => {
  try {
    const data = await getTimeseries({
      range: req.query.range ?? '30d',
      metric: req.query.metric ?? 'revenue',
    })
    return res.json(data)
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/admin/analytics/top-products
 * Ranked product performance.
 *
 * Query params: limit (default 10, max 50)
 */
router.get('/top-products', async (req, res, next) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit ?? '10', 10)))
    const data = await getTopProducts({ limit })
    return res.json(data)
  } catch (err) {
    next(err)
  }
})

export default router
