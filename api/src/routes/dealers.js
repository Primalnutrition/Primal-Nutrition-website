import { Router } from 'express'
import { z } from 'zod'
import { getAdminClient } from '../lib/supabase.js'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'

const router = Router()

const opt = (max) => z.string().trim().max(max).optional().default('')

const LeadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  store: z.string().trim().min(2).max(150),
  location: z.string().trim().min(2).max(150),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  email: z.string().trim().email().max(254).transform((s) => s.toLowerCase()).or(z.literal('')).optional().default(''),
  volume: opt(60),
  type: opt(60),
  utmSource: opt(100),
  utmCampaign: opt(150),
  utmContent: opt(150),
  fbclid: opt(500),
  website: z.string().max(0).optional().default(''), // honeypot
})

/**
 * POST /api/dealers/lead
 * Saves a dealer application from /#/dealer before the form opens WhatsApp.
 */
router.post('/lead', async (req, res, next) => {
  const parsed = LeadSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(422).json({ error: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message })
  }
  const d = parsed.data
  if (!config.supabase.configured) {
    return res.status(503).json({ error: 'SUPABASE_NOT_CONFIGURED', message: 'Backend not configured' })
  }
  try {
    const { error } = await getAdminClient().from('dealer_leads').insert({
      name: d.name,
      store: d.store,
      location: d.location,
      phone: d.phone,
      email: d.email || null,
      volume: d.volume || null,
      business_type: d.type || null,
      utm_source: d.utmSource || null,
      utm_campaign: d.utmCampaign || null,
      utm_content: d.utmContent || null,
      fbclid: d.fbclid || null,
    })
    if (error) throw error
    logger.info({ store: d.store, location: d.location }, 'dealer lead received')
    return res.status(201).json({ ok: true })
  } catch (err) {
    return next(err)
  }
})

export default router
