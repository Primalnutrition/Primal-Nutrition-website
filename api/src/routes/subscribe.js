import { Router } from 'express'
import { z } from 'zod'
import { getAdminClient } from '../lib/supabase.js'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'
import { sendSubscribeWelcomeEmail } from '../lib/email.js'

const router = Router()

const SubscribeSchema = z.object({
  email: z.string().email().max(254).transform((s) => s.trim().toLowerCase()),
  source: z.string().max(64).optional().default('footer'),
})

function requireSupabase(res) {
  if (!config.supabase.configured) {
    res.status(503).json({ error: 'SUPABASE_NOT_CONFIGURED', message: 'Backend not configured' })
    return null
  }
  return getAdminClient()
}

/**
 * POST /api/subscribe
 * Body: { email: string, source?: string }
 * Idempotent — re-subscribes return { alreadySubscribed: true } without re-sending.
 * Re-subscribes after unsubscribe re-activate the row and re-send welcome.
 */
router.post('/', async (req, res, next) => {
  const parsed = SubscribeSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(422).json({ error: 'VALIDATION_ERROR', issues: parsed.error.issues })
  }
  const { email, source } = parsed.data

  try {
    const supabase = requireSupabase(res)
    if (!supabase) return

    const existing = await supabase
      .from('subscribers')
      .select('id, email, welcome_sent_at, unsubscribed_at')
      .eq('email', email)
      .maybeSingle()

    if (existing.error) throw existing.error

    let row = existing.data
    let isNew = false

    if (!row) {
      const ins = await supabase
        .from('subscribers')
        .insert({ email, source })
        .select('id, email, welcome_sent_at, unsubscribed_at')
        .single()
      if (ins.error) throw ins.error
      row = ins.data
      isNew = true
    } else if (row.unsubscribed_at) {
      // Re-subscribe after opt-out: clear the flag and re-send welcome
      const upd = await supabase
        .from('subscribers')
        .update({ unsubscribed_at: null, subscribed_at: new Date().toISOString(), welcome_sent_at: null, welcome_resend_id: null, source })
        .eq('id', row.id)
        .select('id, email, welcome_sent_at, unsubscribed_at')
        .single()
      if (upd.error) throw upd.error
      row = upd.data
      isNew = true
    }

    if (row.welcome_sent_at) {
      // Already welcomed and still active — do nothing, return idempotent ok
      return res.json({ ok: true, alreadySubscribed: true })
    }

    // Send welcome (fire-and-forget but await long enough to record the result)
    res.json({ ok: true, alreadySubscribed: false, isNew })

    void (async () => {
      try {
        const result = await sendSubscribeWelcomeEmail({ to: email })
        if (result.sent) {
          await supabase
            .from('subscribers')
            .update({ welcome_sent_at: new Date().toISOString(), welcome_resend_id: result.id ?? null })
            .eq('id', row.id)
        } else {
          logger.warn({ email, err: result.error }, 'subscribe welcome send failed')
        }
      } catch (err) {
        logger.warn({ err, email }, 'subscribe welcome post-response failure')
      }
    })()
  } catch (err) {
    return next(err)
  }
})

export default router
