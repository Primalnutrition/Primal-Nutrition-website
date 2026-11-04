import { Router } from 'express'
import { z } from 'zod'
import { getAdminClient } from '../../lib/supabase.js'
import { config } from '../../config.js'
import { normaliseHandle } from '../creators.js'

const router = Router()

const STATUSES = ['new', 'contacted', 'replied', 'applied', 'approved', 'shipped', 'posted', 'rejected', 'not_interested']
const SOURCES = ['application', 'hashtag', 'mention', 'comment', 'customer', 'manual']

function requireSupabase(res) {
  if (!config.supabase.configured) {
    res.status(503).json({ error: 'SUPABASE_NOT_CONFIGURED', message: 'Supabase is not configured' })
    return null
  }
  return getAdminClient()
}

// Editable fields, shared by create (hunt / manual add) and update.
const CreatorFields = z.object({
  name: z.string().trim().max(100).nullable().optional(),
  email: z.string().trim().email().max(254).nullable().optional(),
  phone: z.string().trim().max(20).nullable().optional(),
  sport: z.string().trim().max(60).nullable().optional(),
  followers: z.coerce.number().int().min(0).nullable().optional(),
  engagement_rate: z.coerce.number().min(0).max(100).nullable().optional(),
  city: z.string().trim().max(100).nullable().optional(),
  state: z.string().trim().max(100).nullable().optional(),
  status: z.enum(STATUSES).optional(),
  found_via: z.string().trim().max(200).nullable().optional(),
  pitch: z.string().trim().max(1000).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  next_followup_at: z.string().datetime({ offset: true }).nullable().optional(),
  content_url: z.string().trim().url().max(500).nullable().optional(),
})

/**
 * GET /api/admin/creators
 * Query params: page, limit, status, source, search (handle / name / city)
 * Also returns per-status counts for the pipeline header.
 */
router.get('/', async (req, res, next) => {
  try {
    const supabase = requireSupabase(res)
    if (!supabase) return

    const page = Math.max(1, parseInt(req.query.page ?? '1', 10))
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit ?? '50', 10)))
    const offset = (page - 1) * limit
    const status = req.query.status?.trim() ?? ''
    const source = req.query.source?.trim() ?? ''
    const search = (req.query.search?.trim() ?? '').replace(/[%,()]/g, '')

    let q = supabase.from('creators').select('*', { count: 'exact' })
    if (STATUSES.includes(status)) q = q.eq('status', status)
    if (SOURCES.includes(source)) q = q.eq('source', source)
    if (search) q = q.or(`handle.ilike.%${search}%,name.ilike.%${search}%,city.ilike.%${search}%`)
    const { data, count, error } = await q.order('updated_at', { ascending: false }).range(offset, offset + limit - 1)
    if (error) throw error

    const { data: all, error: cErr } = await supabase.from('creators').select('status')
    if (cErr) throw cErr
    const counts = Object.fromEntries(STATUSES.map((s) => [s, 0]))
    for (const r of all ?? []) counts[r.status] = (counts[r.status] ?? 0) + 1

    return res.json({ data, counts, meta: { page, limit, total: count ?? 0 } })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/admin/creators
 * Add one or many creators (manual add, or the daily hunt). Existing handles
 * are skipped, never overwritten, so the hunt can re-run safely.
 * Body: a creator object or { creators: [...] }
 */
router.post('/', async (req, res, next) => {
  try {
    const supabase = requireSupabase(res)
    if (!supabase) return

    const Item = CreatorFields.extend({
      handle: z.string().trim().min(2).max(120).transform(normaliseHandle).refine((h) => /^[a-z0-9._]{2,30}$/.test(h)),
      source: z.enum(SOURCES).optional().default('manual'),
    })
    const list = Array.isArray(req.body?.creators) ? req.body.creators : [req.body]
    const parsed = z.array(Item).min(1).max(200).safeParse(list)
    if (!parsed.success) {
      return res.status(422).json({ error: 'VALIDATION_ERROR', issues: parsed.error.issues })
    }

    const { data, error } = await supabase
      .from('creators')
      .upsert(parsed.data, { onConflict: 'handle', ignoreDuplicates: true })
      .select('id, handle')
    if (error) throw error

    return res.status(201).json({ added: data?.length ?? 0, skipped: parsed.data.length - (data?.length ?? 0), data })
  } catch (err) {
    next(err)
  }
})

/**
 * PATCH /api/admin/creators/:id
 * Update status / notes / follow-up. Status changes stamp the matching date.
 * Body may include { contacted: true } to log an outreach touch.
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const supabase = requireSupabase(res)
    if (!supabase) return

    const parsed = CreatorFields.extend({ contacted: z.boolean().optional() }).safeParse(req.body ?? {})
    if (!parsed.success) {
      return res.status(422).json({ error: 'VALIDATION_ERROR', issues: parsed.error.issues })
    }
    const { contacted, ...fields } = parsed.data
    const now = new Date().toISOString()
    const patch = { ...fields, updated_at: now }
    if (fields.status === 'shipped') patch.shipped_at = now
    if (fields.status === 'posted') patch.posted_at = now

    if (contacted) {
      const { data: cur, error: curErr } = await supabase.from('creators').select('contact_count, status').eq('id', req.params.id).single()
      if (curErr) throw curErr
      patch.contact_count = (cur.contact_count ?? 0) + 1
      patch.last_contacted_at = now
      if (!fields.status && cur.status === 'new') patch.status = 'contacted'
    }

    const { data, error } = await supabase.from('creators').update(patch).eq('id', req.params.id).select('*').single()
    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'NOT_FOUND', message: 'Creator not found' })
      throw error
    }
    return res.json(data)
  } catch (err) {
    next(err)
  }
})

export default router
