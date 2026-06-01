import { Router } from 'express'
import { getAdminClient } from '../lib/supabase.js'
import { config } from '../config.js'

const router = Router()

/**
 * GET /api/products
 * Returns all products with their variants.
 */
router.get('/', async (req, res, next) => {
  try {
    if (!config.supabase.configured) {
      return res.status(503).json({
        error: 'SUPABASE_NOT_CONFIGURED',
        message: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env',
      })
    }

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, slug, name, subtitle, tagline, image, gallery,
        category, category_label, tier, accent, bottle_type, badge, description,
        mckinsey, pdp, created_at,
        variants (
          id, label, sub, price, compare_at, save_label, stock_qty
        )
      `)
      .order('created_at', { ascending: true })

    if (error) throw error

    return res.json(data)
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/products/:slug
 * Returns a single product with variants.
 */
router.get('/:slug', async (req, res, next) => {
  try {
    if (!config.supabase.configured) {
      return res.status(503).json({
        error: 'SUPABASE_NOT_CONFIGURED',
        message: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env',
      })
    }

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, slug, name, subtitle, tagline, image, gallery,
        category, category_label, tier, accent, bottle_type, badge, description,
        mckinsey, pdp, created_at,
        variants (
          id, label, sub, price, compare_at, save_label, stock_qty
        )
      `)
      .eq('slug', req.params.slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' })
      }
      throw error
    }

    return res.json(data)
  } catch (err) {
    next(err)
  }
})

export default router
