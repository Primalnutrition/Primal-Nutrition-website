import { Router } from 'express'
import {
  getAdsOverview,
  getCreativeLeaderboard,
  getTagRankings,
  getLineage,
  getTestQueue,
  getDataQuality,
  getDailyBurn,
  getSyncStatus,
} from '../../services/adsService.js'

const router = Router()

/** Clamp the window to something the tracker actually holds data for. */
function windowDays(req) {
  const raw = parseInt(req.query.days ?? '30', 10)
  if (Number.isNaN(raw)) return 30
  // Up to ~13 months so the UI can offer 6-month and 1-year views. The tracker
  // may hold less history than that; the overview reports actual coverage.
  return Math.min(400, Math.max(1, raw))
}

/**
 * GET /api/admin/ads/overview?days=30
 * Headline KPIs. Returns Meta-attributed and order-derived figures separately
 * so the dashboard can surface the gap between them.
 */
router.get('/overview', async (req, res, next) => {
  try {
    res.json(await getAdsOverview({ days: windowDays(req) }))
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/admin/ads/creatives?days=30
 * Creative leaderboard by ROAS, with tags and the latest stored verdict.
 */
router.get('/creatives', async (req, res, next) => {
  try {
    res.json(await getCreativeLeaderboard({ days: windowDays(req) }))
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/admin/ads/rankings?days=30&dimension=hook_type
 * Performance grouped by one taxonomy dimension. Buckets resting on thin
 * evidence are flagged rather than silently ranked alongside solid ones.
 */
router.get('/rankings', async (req, res, next) => {
  try {
    res.json(
      await getTagRankings({
        days: windowDays(req),
        dimension: req.query.dimension ?? 'hook_type',
      }),
    )
  } catch (err) {
    next(err)
  }
})

/** GET /api/admin/ads/lineage — creative families and version diffs. */
router.get('/lineage', async (_req, res, next) => {
  try {
    res.json(await getLineage())
  } catch (err) {
    next(err)
  }
})

/** GET /api/admin/ads/test-queue?status=proposed — what to make next. */
router.get('/test-queue', async (req, res, next) => {
  try {
    res.json(await getTestQueue({ status: req.query.status ?? 'proposed' }))
  } catch (err) {
    next(err)
  }
})

/** GET /api/admin/ads/data-quality — findings from the latest tracker run. */
router.get('/data-quality', async (_req, res, next) => {
  try {
    res.json(await getDataQuality())
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/admin/ads/burn?days=30
 * Daily spend series. Actual burn only — Meta budgets are not stored, so this
 * deliberately reports no pacing or runway figure.
 */
router.get('/burn', async (req, res, next) => {
  try {
    res.json(await getDailyBurn({ days: windowDays(req) }))
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/admin/ads/sync-status
 * How fresh the ads data is. The tracker pushes from a scheduled local run, so
 * the dashboard needs to be able to say plainly when that run last succeeded.
 */
router.get('/sync-status', async (_req, res, next) => {
  try {
    res.json(await getSyncStatus())
  } catch (err) {
    next(err)
  }
})

export default router
