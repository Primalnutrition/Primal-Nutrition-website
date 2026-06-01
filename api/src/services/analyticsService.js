import { getAdminClient } from '../lib/supabase.js'

function rangeToDate(range) {
  if (!range || range === 'all') return null
  const match = range.match(/^(\d+)d$/)
  if (!match) return null
  const days = parseInt(match[1], 10)
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

function notConfigured() {
  return Object.assign(new Error('Supabase not configured'), {
    statusCode: 503,
    code: 'SUPABASE_NOT_CONFIGURED',
  })
}

/**
 * KPI overview consumed by the admin Dashboard.
 *
 * Shape mirrors the keys the dashboard reads directly:
 *   revenue: { today, week, month, all }
 *   orders:  { today, week, month, all }
 *   aov:     { month, all }
 *   customers: { active, dormant, churned, total }
 */
export async function getOverview() {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const now = new Date()
  const startOf = (days) => {
    const d = new Date(now)
    d.setDate(d.getDate() - days)
    return d.toISOString()
  }

  const [ordersRes, customersRes] = await Promise.all([
    supabase
      .from('orders')
      .select('total, status, placed_at, customer_id')
      .neq('status', 'cancelled'),
    supabase
      .from('customer_summary')
      .select('status'),
  ])

  if (ordersRes.error) throw ordersRes.error
  if (customersRes.error) throw customersRes.error

  const orders = ordersRes.data ?? []
  const customers = customersRes.data ?? []

  const inLast = (days) => orders.filter((o) =>
    days == null ? true : new Date(o.placed_at) >= new Date(startOf(days))
  )
  const sum = (rows) => rows.reduce((s, o) => s + Number(o.total ?? 0), 0)
  const avg = (rows) => (rows.length ? Math.round(sum(rows) / rows.length) : 0)

  const today = inLast(1)
  const week = inLast(7)
  const month = inLast(30)
  const all = inLast(null)

  const byStatus = (s) => customers.filter((c) => c.status === s).length

  return {
    revenue: {
      today: sum(today),
      week: sum(week),
      month: sum(month),
      all: sum(all),
    },
    orders: {
      today: today.length,
      week: week.length,
      month: month.length,
      all: all.length,
    },
    aov: {
      month: avg(month),
      all: avg(all),
    },
    customers: {
      active: byStatus('active'),
      dormant: byStatus('dormant'),
      churned: byStatus('churned'),
      total: customers.length,
    },
  }
}

/**
 * Daily revenue timeseries for the dashboard chart.
 * Returns { data: [{ date, value, orders_count }] }.
 */
export async function getTimeseries({ range = '30d', metric = 'revenue' } = {}) {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

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

  const rows = (data ?? []).map((r) => ({
    date: r.date,
    value: Number(metric === 'orders' ? r.orders_count : r.revenue) || 0,
    orders_count: r.orders_count,
    revenue: r.revenue,
    new_customers: r.new_customers,
    returning_customers: r.returning_customers,
  }))

  return { data: rows }
}

/**
 * Ranked product performance for Dashboard + Products page.
 * Returns { data: [{ product_id, name, revenue, qty, customers, image }] }.
 */
export async function getTopProducts({ limit = 10 } = {}) {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const lim = Math.min(limit, 50)
  const { data, error } = await supabase
    .from('product_performance')
    .select('product_id, name, total_orders, total_revenue, total_qty_sold, unique_customers, revenue_rank')
    .order('revenue_rank', { ascending: true })
    .limit(lim)

  if (error) throw error

  const rows = data ?? []
  const ids = rows.map((r) => r.product_id).filter(Boolean)

  let imagesById = {}
  if (ids.length) {
    const imgRes = await supabase
      .from('products')
      .select('id, image')
      .in('id', ids)
    if (!imgRes.error && imgRes.data) {
      imagesById = Object.fromEntries(imgRes.data.map((p) => [p.id, p.image]))
    }
  }

  return {
    data: rows.map((r) => ({
      product_id: r.product_id,
      name: r.name,
      revenue: Number(r.total_revenue) || 0,
      qty: Number(r.total_qty_sold) || 0,
      customers: Number(r.unique_customers) || 0,
      total_orders: r.total_orders,
      revenue_rank: r.revenue_rank,
      image: imagesById[r.product_id] || null,
    })),
  }
}
