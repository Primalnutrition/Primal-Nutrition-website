import { Router } from 'express'
import { runDailyFollowups } from '../services/followupService.js'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'

const router = Router()

/**
 * POST /cron/send-followups
 *
 * Auth: `Authorization: Bearer ${CRON_SECRET}` header.
 *
 * Triggers the daily followup-email sweep (day-14 check-in + 30-day reorder reminder).
 * Returns the aggregated summary from runDailyFollowups.
 */
router.post('/send-followups', async (req, res, next) => {
  try {
    if (!config.cronSecret) {
      return res.status(503).json({
        error: 'CRON_NOT_CONFIGURED',
        message: 'CRON_SECRET is not set on the server.',
      })
    }

    const header = req.get('authorization') || ''
    const expected = `Bearer ${config.cronSecret}`
    if (header !== expected) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Invalid or missing bearer token.',
      })
    }

    const summary = await runDailyFollowups()
    logger.info({ summary }, 'Daily followup cron completed')
    return res.json(summary)
  } catch (err) {
    next(err)
  }
})

export default router
