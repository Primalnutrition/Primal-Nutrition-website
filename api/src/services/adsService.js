import { getAdminClient } from '../lib/supabase.js'

/**
 * Meta ads + creative tracker.
 *
 * Reads the `ads_*` tables, which are populated by the local creative tracker
 * (see the ads-tracker skill). Every table has RLS enabled with no policies,
 * so only the service-role client used here can reach them.
 *
 * Two deliberate conventions, both of which the admin UI must preserve:
 *
 *  1. Aggregate ROAS is always sum(revenue) / sum(spend). Never the mean of
 *     daily ROAS values — that weights a ₹2 day the same as a ₹2,000 day.
 *  2. "Meta ROAS" (gross, pixel-attributed) and "Real ROAS" (net of
 *     cancellations and refunds, from the orders table) are separate numbers
 *     and are returned separately. Do not substitute one for the other.
 *
 * Contribution ROAS is intentionally absent: ads_product_cogs is empty, so
 * there is no honest profit figure to report yet.
 */

function notConfigured() {
  return Object.assign(new Error('Supabase not configured'), {
    statusCode: 503,
    code: 'SUPABASE_NOT_CONFIGURED',
  })
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

/**
 * Start date for an inclusive N-day window ending today.
 * days=1 -> today only; days=7 -> today plus the previous six.
 * Using daysAgo(days) directly would return N+1 days and make "Today" mean
 * "today and yesterday".
 */
function windowStart(days) {
  return daysAgo(Math.max(0, days - 1))
}

const ratio = (num, den) => (den ? Number((num / den).toFixed(4)) : null)

/** Fold a set of ad_daily rows into one aggregate. */
function fold(rows) {
  const t = rows.reduce(
    (a, r) => ({
      spend: a.spend + Number(r.spend || 0),
      revenue: a.revenue + Number(r.revenue || 0),
      impressions: a.impressions + Number(r.impressions || 0),
      clicks: a.clicks + Number(r.clicks || 0),
      purchases: a.purchases + Number(r.purchases || 0),
      atc: a.atc + Number(r.atc || 0),
      ic: a.ic + Number(r.ic || 0),
      frequency: Math.max(a.frequency, Number(r.frequency || 0)),
    }),
    { spend: 0, revenue: 0, impressions: 0, clicks: 0, purchases: 0, atc: 0, ic: 0, frequency: 0 },
  )

  return {
    ...t,
    spend: Number(t.spend.toFixed(2)),
    revenue: Number(t.revenue.toFixed(2)),
    roas: ratio(t.revenue, t.spend),
    ctr: t.impressions ? Number(((100 * t.clicks) / t.impressions).toFixed(3)) : null,
    cpm: t.impressions ? Number(((1000 * t.spend) / t.impressions).toFixed(2)) : null,
    cpa: t.purchases ? Number((t.spend / t.purchases).toFixed(2)) : null,
    days: new Set(rows.map((r) => r.date)).size,
  }
}

async function fetchDaily(supabase, since) {
  const { data, error } = await supabase
    .from('ads_daily')
    .select('date, ad_id, creative_id, campaign_id, spend, impressions, clicks, reach, frequency, purchases, revenue, atc, ic')
    .gte('date', since)
    .order('date', { ascending: true })
  if (error) throw error
  return data ?? []
}

/**
 * Headline KPIs. Returns Meta-attributed and order-derived figures side by
 * side so the dashboard can show the gap rather than hide it.
 */
export async function getAdsOverview({ days = 30 } = {}) {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const since = windowStart(days)
  const prevSince = windowStart(days * 2)

  const [daily, ordersRes, boundsRes] = await Promise.all([
    fetchDaily(supabase, prevSince),
    supabase
      .from('orders')
      .select('total, status, placed_at, utm_campaign, is_new_customer:customer_id')
      .gte('placed_at', prevSince)
      .not('utm_campaign', 'is', null),
    // Earliest tracked day, so a 6-month or 1-year view can say plainly that
    // the account has less history than the window asks for.
    supabase.from('ads_daily').select('date').order('date', { ascending: true }).limit(1),
  ])
  if (ordersRes.error) throw ordersRes.error
  if (boundsRes.error) throw boundsRes.error

  const current = daily.filter((r) => r.date >= since)
  const previous = daily.filter((r) => r.date < since)

  const orders = (ordersRes.data ?? []).filter((o) => (o.placed_at ?? '').slice(0, 10) >= since)
  const live = orders.filter((o) => !['cancelled', 'refunded'].includes(o.status))
  const netRevenue = live.reduce((a, o) => a + Number(o.total || 0), 0)

  const cur = fold(current)
  const prev = fold(previous)

  const firstTracked = boundsRes.data?.[0]?.date ?? null
  const lastTracked = daily.length ? daily[daily.length - 1].date : null

  return {
    window: { days, since },
    coverage: {
      firstTracked,
      lastTracked,
      daysWithData: cur.days,
      // True when the window reaches further back than the data goes, so the
      // UI can avoid implying a full year was measured.
      truncated: Boolean(firstTracked && firstTracked > since),
    },
    meta: cur,
    previous: prev,
    real: {
      orders: orders.length,
      lostOrders: orders.length - live.length,
      netRevenue: Number(netRevenue.toFixed(2)),
      roas: ratio(netRevenue, cur.spend),
    },
    // Explicit so the UI never has to guess why profit is missing.
    contributionRoas: null,
    contributionRoasReason: 'No COGS loaded — populate ads_product_cogs to enable.',
  }
}

/**
 * Per-creative leaderboard with the latest stored verdict.
 * Sorted by ROAS descending; creatives with no spend in the window are omitted.
 */
export async function getCreativeLeaderboard({ days = 30 } = {}) {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const since = windowStart(days)

  const [daily, creativesRes, tagsRes, verdictsRes, adsRes] = await Promise.all([
    fetchDaily(supabase, since),
    supabase.from('ads_creatives').select('*'),
    supabase.from('ads_creative_tags').select('*'),
    supabase
      .from('ads_verdicts')
      .select('*')
      .eq('window_days', days)
      .order('run_date', { ascending: false }),
    supabase.from('ads_ads').select('creative_id, ad_id, ad_name, effective_status'),
  ])
  for (const r of [creativesRes, tagsRes, verdictsRes, adsRes]) if (r.error) throw r.error

  // A creative can back several ads. It is live if ANY of them is delivering.
  // Without this the leaderboard shows 30 days of history with no way to tell
  // what is actually running right now.
  const adsByCreative = new Map()
  for (const a of adsRes.data ?? []) {
    if (!adsByCreative.has(a.creative_id)) adsByCreative.set(a.creative_id, [])
    adsByCreative.get(a.creative_id).push(a)
  }

  const creatives = new Map((creativesRes.data ?? []).map((c) => [c.creative_id, c]))
  const tags = new Map((tagsRes.data ?? []).map((t) => [t.creative_id, t]))

  // Latest run wins — the ordered query means first seen is newest.
  const verdicts = new Map()
  for (const v of verdictsRes.data ?? []) {
    if (!verdicts.has(v.creative_id)) verdicts.set(v.creative_id, v)
  }

  const byCreative = new Map()
  for (const row of daily) {
    if (!row.creative_id) continue
    if (!byCreative.has(row.creative_id)) byCreative.set(row.creative_id, [])
    byCreative.get(row.creative_id).push(row)
  }

  const board = []
  for (const [creativeId, rows] of byCreative) {
    const agg = fold(rows)
    if (!agg.spend) continue
    const c = creatives.get(creativeId) ?? {}
    const t = tags.get(creativeId) ?? {}
    const v = verdicts.get(creativeId) ?? {}

    board.push({
      creativeId,
      name: c.name ?? null,
      // For carousels Meta stores the page name in `title`; the real hook is
      // the first card. Falling back to card_hooks[0] stops every carousel
      // from rendering as an unhelpful "Primal Nutrition".
      hookText: (c.format === 'carousel' && Array.isArray(c.card_hooks) && c.card_hooks[0])
        ? c.card_hooks[0]
        : (c.hook_text ?? null),
      format: c.format ?? null,
      cta: c.cta ?? null,
      cardHooks: c.card_hooks ?? [],
      imageHashes: c.image_hashes ?? [],
      tags: {
        product: t.product ?? null,
        objective: t.objective ?? null,
        angle: t.angle ?? null,
        hookType: t.hook_type ?? null,
        awarenessStage: t.awareness_stage ?? null,
        visualStyle: t.visual_style ?? null,
        proofElement: t.proof_element ?? null,
        showsPrice: t.shows_price ?? false,
      },
      notes: t.notes ?? null,
      ads: (adsByCreative.get(creativeId) ?? []).map(a => ({
        adId: a.ad_id, adName: a.ad_name, status: a.effective_status,
      })),
      isLive: (adsByCreative.get(creativeId) ?? []).some(a => a.effective_status === 'ACTIVE'),
      metrics: agg,
      verdict: v.verdict ?? null,
      confidence: v.confidence ?? null,
      evidence: v.evidence ?? null,
      reason: v.reason ?? null,
    })
  }

  board.sort((a, b) => (b.metrics.roas ?? 0) - (a.metrics.roas ?? 0))
  return { window: { days, since }, creatives: board }
}

/**
 * Performance grouped by a taxonomy dimension.
 *
 * Recruitment creatives are excluded (they have no ROAS by design), and any
 * bucket resting on fewer than 2 creatives or under the maturity spend floor
 * is flagged `thin` so the UI can visually de-emphasise it.
 */
const DIMENSIONS = {
  angle: 'angle',
  hook_type: 'hook_type',
  awareness_stage: 'awareness_stage',
  visual_style: 'visual_style',
  proof_element: 'proof_element',
  product: 'product',
  format: null, // lives on ads_creatives, not ads_creative_tags
}
const THIN_SPEND = 1000

export async function getTagRankings({ days = 30, dimension = 'hook_type' } = {}) {
  if (!(dimension in DIMENSIONS)) {
    throw Object.assign(new Error(`Unsupported dimension: ${dimension}`), {
      statusCode: 400,
      code: 'BAD_DIMENSION',
    })
  }
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const since = windowStart(days)
  const [daily, creativesRes, tagsRes] = await Promise.all([
    fetchDaily(supabase, since),
    supabase.from('ads_creatives').select('creative_id, format'),
    supabase.from('ads_creative_tags').select('*'),
  ])
  for (const r of [creativesRes, tagsRes]) if (r.error) throw r.error

  const formats = new Map((creativesRes.data ?? []).map((c) => [c.creative_id, c.format]))
  const tags = new Map((tagsRes.data ?? []).map((t) => [t.creative_id, t]))

  const buckets = new Map()
  for (const row of daily) {
    const t = tags.get(row.creative_id)
    if (!t || t.objective === 'recruitment') continue

    const key =
      dimension === 'format'
        ? formats.get(row.creative_id) ?? '(unknown)'
        : t[DIMENSIONS[dimension]] ?? '(untagged)'

    if (!buckets.has(key)) buckets.set(key, { rows: [], creatives: new Set() })
    buckets.get(key).rows.push(row)
    buckets.get(key).creatives.add(row.creative_id)
  }

  const rankings = [...buckets.entries()]
    .map(([value, b]) => {
      const agg = fold(b.rows)
      return {
        value,
        creatives: b.creatives.size,
        ...agg,
        thin: b.creatives.size < 2 || agg.spend < THIN_SPEND,
      }
    })
    .filter((r) => r.spend > 0)
    .sort((a, b) => (b.roas ?? 0) - (a.roas ?? 0))

  return { window: { days, since }, dimension, rankings }
}

/** Creative families and what changed between versions. */
export async function getLineage() {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const [lineageRes, creativesRes] = await Promise.all([
    supabase.from('ads_creative_lineage').select('*'),
    supabase.from('ads_creatives').select('creative_id, hook_text, first_seen'),
  ])
  for (const r of [lineageRes, creativesRes]) if (r.error) throw r.error

  const meta = new Map((creativesRes.data ?? []).map((c) => [c.creative_id, c]))
  const families = new Map()

  for (const l of lineageRes.data ?? []) {
    if (!families.has(l.family)) families.set(l.family, [])
    families.get(l.family).push({
      creativeId: l.creative_id,
      versionLabel: l.version_label,
      parentCreativeId: l.parent_creative_id,
      changed: {
        image: l.changed_image,
        copy: l.changed_copy,
        url: l.changed_url,
      },
      changeNote: l.change_note,
      hookText: meta.get(l.creative_id)?.hook_text ?? null,
      firstSeen: meta.get(l.creative_id)?.first_seen ?? null,
    })
  }

  return {
    families: [...families.entries()]
      .map(([family, versions]) => ({
        family,
        versions: versions.sort((a, b) => (a.firstSeen ?? '').localeCompare(b.firstSeen ?? '')),
      }))
      .filter((f) => f.versions.length > 1),
  }
}

/** Proposed creative tests, highest priority first. */
export async function getTestQueue({ status = 'proposed' } = {}) {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const { data, error } = await supabase
    .from('ads_test_queue')
    .select('*')
    .eq('status', status)
    .order('priority', { ascending: true })
  if (error) throw error
  return { queue: data ?? [] }
}

/** Data-quality findings from the most recent tracker run. */
export async function getDataQuality() {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const { data, error } = await supabase
    .from('ads_data_quality')
    .select('*')
    .order('run_date', { ascending: false })
    .limit(50)
  if (error) throw error

  const latest = data?.[0]?.run_date ?? null
  return {
    runDate: latest,
    issues: (data ?? []).filter((d) => d.run_date === latest),
  }
}
