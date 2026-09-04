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

/**
 * Daily spend series — the burn view.
 *
 * "Burn" here is actual spend per day, not spend against a plan. Meta budgets
 * are not stored anywhere (no budget column exists on ads_ads or ads_daily),
 * so pacing, over/under-spend and runway cannot be computed honestly yet. If
 * budgets are ingested later, this is where the comparison belongs.
 *
 * Days with no delivery are emitted as zero-spend rows rather than omitted, so
 * a chart shows the gap instead of silently joining across it.
 */
export async function getDailyBurn({ days = 30 } = {}) {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const since = windowStart(days)
  const daily = await fetchDaily(supabase, since)

  const byDate = new Map()
  for (const r of daily) {
    const d = byDate.get(r.date) ?? { spend: 0, revenue: 0, purchases: 0, impressions: 0, clicks: 0 }
    d.spend += Number(r.spend || 0)
    d.revenue += Number(r.revenue || 0)
    d.purchases += Number(r.purchases || 0)
    d.impressions += Number(r.impressions || 0)
    d.clicks += Number(r.clicks || 0)
    byDate.set(r.date, d)
  }

  // Walk the calendar rather than the data so blank days stay visible.
  const series = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = daysAgo(i)
    const d = byDate.get(date)
    series.push({
      date,
      spend: Number((d?.spend ?? 0).toFixed(2)),
      revenue: Number((d?.revenue ?? 0).toFixed(2)),
      purchases: d?.purchases ?? 0,
      roas: ratio(d?.revenue ?? 0, d?.spend ?? 0),
      hasData: Boolean(d),
    })
  }

  const spends = series.map((s) => s.spend)
  const withData = series.filter((s) => s.hasData)
  const mean = (arr) => (arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : null)

  // Averages count only days that actually delivered. Including untracked days
  // as zeros would understate the real daily burn rate.
  const last7 = withData.slice(-7).map((s) => s.spend)
  const last30 = withData.slice(-30).map((s) => s.spend)

  const today = series[series.length - 1] ?? null
  const yesterday = series[series.length - 2] ?? null
  const peak = withData.reduce((a, s) => (a && a.spend >= s.spend ? a : s), null)

  return {
    window: { days, since },
    series,
    totals: {
      spend: Number(spends.reduce((a, b) => a + b, 0).toFixed(2)),
      purchases: series.reduce((a, s) => a + s.purchases, 0),
      revenue: Number(series.reduce((a, s) => a + s.revenue, 0).toFixed(2)),
      daysWithDelivery: withData.length,
    },
    burn: {
      today: today?.spend ?? 0,
      todayHasData: Boolean(today?.hasData),
      yesterday: yesterday?.spend ?? 0,
      avg7: mean(last7),
      avg30: mean(last30),
      peak: peak ? { date: peak.date, spend: peak.spend } : null,
      // Projection is the 7-day mean carried forward — deliberately simple,
      // and only meaningful while budgets and delivery hold steady.
      projected30: mean(last7) === null ? null : Number((mean(last7) * 30).toFixed(2)),
    },
    budget: null,
    budgetReason: 'No budgets stored — ads_ads has no budget column, so pacing cannot be computed.',
  }
}

/**
 * Freshness of the ads pipeline.
 *
 * The tracker pushes to Supabase from a scheduled local run, so the dashboard
 * can silently show stale numbers if that run fails. This surfaces the age of
 * the data instead, and the UI is expected to warn rather than hide it.
 */
export async function getSyncStatus() {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const { data, error } = await supabase
    .from('ads_daily')
    .select('date, fetched_at')
    .order('date', { ascending: false })
    .limit(1)
  if (error) throw error

  const row = data?.[0] ?? null
  const lastDate = row?.date ?? null
  const fetchedAt = row?.fetched_at ?? null

  const today = new Date().toISOString().slice(0, 10)
  const dayGap =
    lastDate === null
      ? null
      : Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${lastDate}T00:00:00Z`)) / 86400000)
  const hoursSinceFetch =
    fetchedAt === null ? null : Math.round((Date.now() - Date.parse(fetchedAt)) / 3600000)

  // Meta finalises a day's spend a few hours after midnight, so one day behind
  // is normal and should not read as a failure. Two or more means a missed run.
  const stale = dayGap !== null && dayGap >= 2

  return {
    lastDate,
    fetchedAt,
    dayGap,
    hoursSinceFetch,
    stale,
    message: lastDate === null
      ? 'No ad data has been synced yet.'
      : stale
        ? `Last synced ${lastDate} — ${dayGap} days behind. The morning tracker run may have failed.`
        : `Synced through ${lastDate}.`,
  }
}

/**
 * Daily updates feed.
 *
 * Derived from ads_daily rather than from a stored digest table. The tracker
 * only records verdicts on the days it runs (two run dates so far), so a feed
 * keyed on verdicts would have two entries. Keying on delivery instead gives
 * an entry for every day money actually moved, with verdicts attached to the
 * days they were produced.
 *
 * The headline mirrors the ads-tracker mail report: urgent verdicts first by
 * spend, then scale candidates by ROAS, otherwise a plain movement summary.
 */
export async function getDailyUpdates({ days = 14 } = {}) {
  const supabase = getAdminClient()
  if (!supabase) throw notConfigured()

  const since = windowStart(days)

  const [daily, verdictsRes, adsRes] = await Promise.all([
    fetchDaily(supabase, since),
    supabase
      .from('ads_verdicts')
      .select('run_date, creative_id, verdict, reason, spend, roas, window_days')
      .gte('run_date', since),
    supabase.from('ads_ads').select('ad_id, ad_name, creative_id'),
  ])
  if (verdictsRes.error) throw verdictsRes.error
  if (adsRes.error) throw adsRes.error

  const nameByCreative = new Map()
  for (const a of adsRes.data ?? []) {
    if (a.creative_id && !nameByCreative.has(a.creative_id)) nameByCreative.set(a.creative_id, a.ad_name)
  }

  // Roll the per-ad rows up to one entry per day, tracking which creative took
  // the most spend so the feed can name what the money actually went on.
  const byDate = new Map()
  for (const r of daily) {
    const d = byDate.get(r.date) ?? { spend: 0, revenue: 0, purchases: 0, byCreative: new Map() }
    d.spend += Number(r.spend || 0)
    d.revenue += Number(r.revenue || 0)
    d.purchases += Number(r.purchases || 0)
    if (r.creative_id) {
      d.byCreative.set(r.creative_id, (d.byCreative.get(r.creative_id) ?? 0) + Number(r.spend || 0))
    }
    byDate.set(r.date, d)
  }

  const verdictsByDate = new Map()
  for (const v of verdictsRes.data ?? []) {
    // The 7-day window is the one the daily routine acts on; the 30-day run is
    // context. Showing both would double every entry.
    if (v.window_days !== 7) continue
    const list = verdictsByDate.get(v.run_date) ?? []
    list.push({
      creativeId: v.creative_id,
      name: nameByCreative.get(v.creative_id) ?? null,
      verdict: v.verdict,
      reason: v.reason,
      spend: v.spend === null ? null : Number(v.spend),
      roas: v.roas === null ? null : Number(v.roas),
    })
    verdictsByDate.set(v.run_date, list)
  }

  const dates = [...byDate.keys()].sort().reverse()

  const entries = dates.map((date, i) => {
    const d = byDate.get(date)
    const prev = byDate.get(dates[i + 1])
    const verdicts = verdictsByDate.get(date) ?? []

    const topCreative = [...d.byCreative.entries()].sort((a, b) => b[1] - a[1])[0] ?? null
    const urgent = verdicts.filter((v) => v.verdict === 'PAUSE' || v.verdict === 'REFRESH CREATIVE')
    const scale = verdicts.filter((v) => v.verdict === 'SCALE')

    let headline
    if (urgent.length) {
      const top = urgent.reduce((a, v) => ((a?.spend ?? 0) >= (v.spend ?? 0) ? a : v), null)
      headline = `${top.verdict === 'PAUSE' ? 'Pause' : 'Refresh'}: ${top.name ?? top.creativeId} — ${top.reason}`
    } else if (scale.length) {
      const top = scale.reduce((a, v) => ((a?.roas ?? 0) >= (v.roas ?? 0) ? a : v), null)
      headline = `Scale candidate: ${top.name ?? top.creativeId} — ${top.reason}`
    } else {
      headline = d.purchases
        ? `${d.purchases} purchase${d.purchases === 1 ? '' : 's'} on ₹${Math.round(d.spend).toLocaleString('en-IN')} spend.`
        : `₹${Math.round(d.spend).toLocaleString('en-IN')} spent, no purchases attributed.`
    }

    return {
      date,
      spend: Number(d.spend.toFixed(2)),
      revenue: Number(d.revenue.toFixed(2)),
      purchases: d.purchases,
      roas: ratio(d.revenue, d.spend),
      spendDelta:
        prev && prev.spend
          ? Number((((d.spend - prev.spend) / prev.spend) * 100).toFixed(1))
          : null,
      topCreative: topCreative
        ? {
            creativeId: topCreative[0],
            name: nameByCreative.get(topCreative[0]) ?? null,
            spend: Number(topCreative[1].toFixed(2)),
          }
        : null,
      verdicts,
      headline,
    }
  })

  return { window: { days, since }, entries }
}
