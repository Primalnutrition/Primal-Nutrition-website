import { getAdminClient } from '../lib/supabase.js'

/**
 * Parse a range string like '7d', '30d', '90d', 'all' into a Date.
 * Returns null for 'all'.
 */
function rangeToDate(range) {
  if (!range || range === 'all') return null
  const match = range.match(/^(\d+)d$/)
  if (!match) return null
  const days = parseInt(match[1], 10)
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

/**
 * Get KPI overview cards.
 * Returns revenue totals for today/7d/30d/all, order counts, AOV,
 * active customer count, dormant customer count.
 */
export async function getOverview() {
  const supabase = getAdminClient()
  if (!supabase) throw Object.assign(new Error('Supabase not configured'), { statusCode: 503, code: 'SUPABASE_NOT_CONFIGURED' })

  const now = new Date()
  const startOf = (days) => {
    const d = new Date(now)
    d.setDate(d.getDate() - days)
    return d.toISOString()
  }

  // Run queries in parallel
  const [allOrders, dormant] = await Promise.all([
    supabase
      .from('orders')
      .select('total, status, placed_at, customer_id')
      .neq('status', 'cancelled'),

    supabase
      .from('dormant_customers')
      .select('customer_id', { count: 'exact', head: true }),
  ])

  if (allOrders.error) throw allOrders.error

  const orders = allOrders.data ?? []

  const filter = (days) => orders.filter((o) => {
    if (!days) return true
    return new Date(o.placed_at) >= new Date(startOf(days))
  })

  const revenue = (rows) => rows.reduce((s, o) => s + Number(o.total ?? 0), 0)

  const today = filter(1)
  const week = filter(7)
  const month = filter(30)
  const all = filter(null)

  const uniqueCustomers = (rows) => new Set(rows.map((o) => o.customer_id)).size

  // Active customers: ordered in last 60 days
  const activeOrders = orders.filter((o) => new Date(o.placed_at) >= new Date(startOf(60)))
  const activeCustomers = new Set(activeOrders.map((o) => o.customer_id)).size

  const calcAov = (rows) => rows.length > 0 ? revenue(rows) / rows.length : 0

  return {
    revenue: {
      today: revenue(today),
      sevenDay: revenue(week),
      thirtyDay: revenue(month),
      allTime: revenue(all),
    },
    orders: {
      today: today.length,
      sevenDay: week.length,
      thirtyDay: month.length,
      allTime: all.length,
    },
    aov: {
      thirtyDay: calcAov(month),
      allTime: calcAov(all),
    },
    customers: {
      active: activeCustomers,
      dormant: dormant.count ?? 0,
      totalWithOrders: uniqueCustomers(all),
    },
  }
}

/**
 * Get daily revenue timeseries.
 *
 * @param {{ range?: string, metric?: string }} opts
 */
export async function getTimeseries({ range = '30d', metric = 'revenue' } = {}) {
  const supabase = getAdminClient()
  if (!supabase) throw Object.assign(new Error('Supabase not configured'), { statusCode: 503, code: 'SUPABASE_NOT_CONFIGURED' })

  const from = rangeToDate(range)

  let query = supabase
    .from('daily_revenue')
    .select('date, orders_count, revenue, new_customers, returning_customers')
    .order('date', { ascending: true })

  if (from) {
    query = query.gte('date', from.toISOString().split('T')[0])
  }

  const { data, error } = await query
  if (error) throw error

  return data ?? []
}

/**
 * Get top N products by revenue.
 *
 * @param {{ limit?: number }} opts
 */
export async function getTopProducts({ limit = 10 } = {}) {
  const supabase = getAdminClient()
  if (!supabase) throw Object.assign(new Error('Supabase not configured'), { statusCode: 503, code: 'SUPABASE_NOT_CONFIGURED' })

  const { data, error } = await supabase
    .from('product_performance')
    .select('product_id, name, total_orders, total_revenue, total_qty_sold, unique_customers, revenue_rank')
    .order('revenue_rank', { ascending: true })
    .limit(Math.min(limit, 50))

  if (error) throw error

  return data ?? []
}
