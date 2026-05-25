import { Router } from 'express'
import { getAdminClient } from '../../lib/supabase.js'
import { config } from '../../config.js'

const router = Router()

function requireSupabase(res) {
  if (!config.supabase.configured) {
    res.status(503).json({ error: 'SUPABASE_NOT_CONFIGURED', message: 'Supabase is not configured' })
    return null
  }
  return getAdminClient()
}

/**
 * GET /api/admin/customers
 * Paginated, searchable customer list with status filter.
 *
 * Query params: page, limit, search, status (active|dormant|churned)
 */
router.get('/', async (req, res, next) => {
  try {
    const supabase = requireSupabase(res)
    if (!supabase) return

    const page = Math.max(1, parseInt(req.query.page ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit ?? '25', 10)))
    const offset = (page - 1) * limit
    const search = req.query.search?.trim() ?? ''
    const status = req.query.status?.trim() ?? ''

    // Use the customer_summary view for enriched data
    let query = supabase
      .from('customer_summary')
      .select('*', { count: 'exact' })
      .order('last_order_date', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query
    if (error) throw error

    return res.json({
      data: data ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/admin/customers/:id
 * Full customer profile + order history + addresses + lifetime stats.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const supabase = requireSupabase(res)
    if (!supabase) return

    const { id } = req.params

    // Run profile + orders + addresses in parallel
    const [profileRes, ordersRes, addressesRes] = await Promise.all([
      supabase
        .from('customer_summary')
        .select('*')
        .eq('customer_id', id)
        .single(),

      supabase
        .from('orders')
        .select(
          `id, order_number, status, total, payment_method,
           placed_at, paid_at, shipped_at, delivered_at, cancelled_at,
           awb_code, courier_name,
           order_items (product_name_snapshot, variant_label_snapshot, qty, unit_price, line_total)`
        )
        .eq('customer_id', id)
        .order('placed_at', { ascending: false }),

      supabase
        .from('addresses')
        .select('id, line1, line2, city, state, pincode, country, is_default')
        .eq('customer_id', id),
    ])

    if (profileRes.error) {
      if (profileRes.error.code === 'PGRST116') {
        return res.status(404).json({ error: 'NOT_FOUND', message: 'Customer not found' })
      }
      throw profileRes.error
    }

    if (ordersRes.error) throw ordersRes.error
    if (addressesRes.error) throw addressesRes.error

    return res.json({
      ...profileRes.data,
      orders: ordersRes.data ?? [],
      addresses: addressesRes.data ?? [],
    })
  } catch (err) {
    next(err)
  }
})

export default router
