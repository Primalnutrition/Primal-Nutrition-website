/**
 * attribution.js — first-party marketing attribution capture.
 *
 * On each full page load we record a "touch": utm_* tags, referrer, landing
 * page, Google/Meta click ids (gclid/fbclid) and a classified channel. The
 * FIRST touch is stored once and never overwritten (acquisition source). The
 * LAST touch is refreshed whenever a new visit carries campaign signal
 * (last-non-direct attribution). Both ride along on the checkout payload so the
 * admin can see exactly how each order was acquired.
 *
 * Storage: first-party cookies (primary) + localStorage (backup). Note Safari
 * ITP caps JS-set cookies at ~7 days, so a cross-week first touch may survive
 * only in localStorage. No third-party cookies, no PII.
 */

const FIRST_KEY = 'pn_attr_first'
const LAST_KEY = 'pn_attr_last'
const MAX_AGE_SECONDS = 180 * 24 * 60 * 60 // 180 days

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

const SEARCH_ENGINES = /(^|\.)(google|bing|yahoo|duckduckgo|ecosia|baidu|yandex|ask|aol)\./i
const SOCIAL = /(^|\.)(facebook|fb|instagram|t\.co|twitter|x|linkedin|youtube|youtu\.be|reddit|pinterest|whatsapp|threads|tiktok|snapchat|telegram)\./i

// ── storage helpers ──────────────────────────────────────────────────────────
function readStore(key) {
  try {
    const m = document.cookie.match(new RegExp('(?:^|; )' + key + '=([^;]*)'))
    if (m) return JSON.parse(decodeURIComponent(m[1]))
  } catch { /* fall through to localStorage */ }
  try {
    const v = localStorage.getItem(key)
    if (v) return JSON.parse(v)
  } catch { /* ignore */ }
  return null
}

function writeStore(key, value) {
  const json = JSON.stringify(value)
  try {
    document.cookie = `${key}=${encodeURIComponent(json)}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`
  } catch { /* ignore */ }
  try {
    localStorage.setItem(key, json)
  } catch { /* ignore */ }
}

// ── classification ───────────────────────────────────────────────────────────
function referrerHost(referrer) {
  try {
    return new URL(referrer).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function classifyChannel({ medium, gclid, fbclid, referrer }) {
  const med = (medium || '').toLowerCase()
  if (med) {
    if (/cpc|ppc|paid|sem/.test(med)) return /social|facebook|meta|instagram/.test(med) ? 'paid_social' : 'paid_search'
    if (/social/.test(med)) return 'organic_social'
    if (/email|newsletter|crm/.test(med)) return 'email'
    if (/affiliate/.test(med)) return 'affiliate'
    if (/referral/.test(med)) return 'referral'
    return med
  }
  if (gclid) return 'paid_search'
  if (fbclid) return 'paid_social'
  if (!referrer) return 'direct'
  const host = referrerHost(referrer)
  if (!host) return 'direct'
  try {
    if (host === location.hostname.replace(/^www\./, '')) return 'direct' // internal navigation
  } catch { /* ignore */ }
  if (SEARCH_ENGINES.test(host)) return 'organic_search'
  if (SOCIAL.test(host)) return 'organic_social'
  return 'referral'
}

const CHANNEL_MEDIUM = {
  organic_search: 'organic',
  paid_search: 'cpc',
  organic_social: 'social',
  paid_social: 'paid-social',
  referral: 'referral',
  email: 'email',
  affiliate: 'affiliate',
  direct: '(none)',
}

function deviceType() {
  try {
    const ua = navigator.userAgent || ''
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet'
    if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua)) return 'mobile'
  } catch { /* ignore */ }
  return 'desktop'
}

// ── touch builder ────────────────────────────────────────────────────────────
function currentTouch(nowIso) {
  const params = new URLSearchParams(location.search)
  const utm = {}
  for (const k of UTM_KEYS) {
    const v = params.get(k)
    if (v) utm[k] = v.slice(0, 200)
  }
  const gclid = params.get('gclid') || null
  const fbclid = params.get('fbclid') || null
  const referrer = document.referrer || null
  const channel = classifyChannel({ medium: utm.utm_medium, gclid, fbclid, referrer })

  return {
    source: utm.utm_source || referrerHost(referrer) || (channel === 'direct' ? 'direct' : channel),
    medium: utm.utm_medium || CHANNEL_MEDIUM[channel] || channel,
    campaign: utm.utm_campaign || null,
    content: utm.utm_content || null,
    term: utm.utm_term || null,
    channel,
    referrer,
    landingPage: location.pathname + location.search,
    gclid,
    fbclid,
    at: nowIso,
  }
}

function hasCampaignSignal(touch) {
  return touch.channel !== 'direct' || !!touch.gclid || !!touch.fbclid
}

// ── public API ───────────────────────────────────────────────────────────────

/**
 * Record the current page load as a touch. Call once at app bootstrap.
 * - First touch is written only if absent (never overwritten).
 * - Last touch is refreshed when this visit has campaign signal, or when no
 *   last touch exists yet (so a later direct return keeps the prior campaign).
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return
  try {
    const touch = currentTouch(new Date().toISOString())
    if (!readStore(FIRST_KEY)) writeStore(FIRST_KEY, touch)
    if (!readStore(LAST_KEY) || hasCampaignSignal(touch)) writeStore(LAST_KEY, touch)
  } catch { /* never let analytics break the app */ }
}

/**
 * Build the attribution object to attach to a new order.
 * Returns null if nothing was captured.
 */
export function getAttributionForOrder() {
  if (typeof window === 'undefined') return null
  try {
    const firstTouch = readStore(FIRST_KEY)
    const lastTouch = readStore(LAST_KEY) || firstTouch
    if (!firstTouch && !lastTouch) return null

    let daysToPurchase = null
    if (firstTouch?.at) {
      const ms = Date.now() - new Date(firstTouch.at).getTime()
      if (Number.isFinite(ms)) daysToPurchase = Math.max(0, Math.round(ms / 86400000))
    }

    return { firstTouch: firstTouch || null, lastTouch: lastTouch || null, device: deviceType(), daysToPurchase }
  } catch {
    return null
  }
}
