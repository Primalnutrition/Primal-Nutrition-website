import { Router } from 'express'
import { z } from 'zod'
import { getAdminClient } from '../lib/supabase.js'
import { config } from '../config.js'
import { logger } from '../utils/logger.js'

const router = Router()

// Accepts "@name", "name" or an instagram.com profile URL; stores "name".
export function normaliseHandle(raw) {
  const s = String(raw ?? '').trim().toLowerCase()
  const fromUrl = s.match(/instagram\.com\/([a-z0-9._]+)/)
  return (fromUrl ? fromUrl[1] : s.replace(/^@/, '')).replace(/[^a-z0-9._]/g, '')
}

const ApplySchema = z.object({
  name: z.string().trim().min(2).max(100),
  handle: z.string().trim().min(2).max(120).transform(normaliseHandle).refine((h) => /^[a-z0-9._]{2,30}$/.test(h), 'Enter a valid Instagram handle'),
  email: z.string().trim().email().max(254).transform((s) => s.toLowerCase()),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  sport: z.string().trim().min(2).max(60),
  followers: z.coerce.number().int().min(0).max(100000000),
  addressLine1: z.string().trim().min(5).max(200),
  addressLine2: z.string().trim().max(200).optional().default(''),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Must be a 6-digit pincode'),
  whyUs: z.string().trim().max(600).optional().default(''),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please accept the terms to apply.' }) }),
  website: z.string().max(0).optional().default(''), // honeypot: real people leave it empty
})

/**
 * POST /api/creators/apply
 * Public application for the T-REX Athletes barter program.
 * Upserts by Instagram handle so creators found by the hunt who then apply
 * keep their history; status moves to 'applied'.
 */
router.post('/apply', async (req, res, next) => {
  const parsed = ApplySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(422).json({ error: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message, issues: parsed.error.issues })
  }
  const d = parsed.data
  if (!config.supabase.configured) {
    return res.status(503).json({ error: 'SUPABASE_NOT_CONFIGURED', message: 'Backend not configured' })
  }

  try {
    const supabase = getAdminClient()
    const now = new Date().toISOString()
    const { data: existing, error: selErr } = await supabase
      .from('creators')
      .select('id, status')
      .eq('handle', d.handle)
      .maybeSingle()
    if (selErr) throw selErr

    const fields = {
      name: d.name,
      email: d.email,
      phone: d.phone,
      sport: d.sport,
      followers: d.followers,
      address_line1: d.addressLine1,
      address_line2: d.addressLine2 || null,
      city: d.city,
      state: d.state,
      pincode: d.pincode,
      why_us: d.whyUs || null,
      applied_at: now,
      updated_at: now,
    }

    if (existing) {
      // Don't move someone backwards if we already approved or shipped them.
      const keep = ['approved', 'shipped', 'posted'].includes(existing.status)
      const { error } = await supabase
        .from('creators')
        .update({ ...fields, ...(keep ? {} : { status: 'applied', next_followup_at: null }) })
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('creators')
        .insert({ handle: d.handle, source: 'application', status: 'applied', ...fields })
      if (error) throw error
    }

    logger.info({ handle: d.handle, followers: d.followers }, 'creator application received')
    return res.status(201).json({ ok: true })
  } catch (err) {
    return next(err)
  }
})

export default router
