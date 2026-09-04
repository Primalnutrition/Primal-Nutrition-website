// Thin wrapper around the Meta Pixel `fbq` global installed in index.html.
// No-ops on SSR or when the snippet hasn't loaded yet (ad blockers, etc.),
// so callers don't need to guard every site.
const PIXEL_ID = '991258953663271'

// `options.eventID` lets the browser pixel and the server-side Conversions API
// share one id so Meta dedupes the two into a single event (no double-counting).
export function track(event, params, options) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  if (params && options) window.fbq('track', event, params, options)
  else if (params) window.fbq('track', event, params)
  else window.fbq('track', event)
}

// Read a cookie value (used for Meta's _fbp / _fbc click cookies, which we
// forward to the server so the Conversions API can match the same browser).
export function getCookie(name) {
  if (typeof document === 'undefined') return undefined
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : undefined
}

// Guards against a second fbq('init', …). index.html already inits the pixel at
// page load; calling init again registers the pixel a SECOND time, and from then
// on every fbq('track', …) dispatches once per registered instance. That is what
// made Purchase arrive three times per order (browser x2 + server CAPI x1):
// identify() runs in CartDrawer immediately before checkout, so only events
// after that point doubled — PageView and ViewContent, fired earlier in the
// session, stayed single. Meta's event_id dedup collapsed them for attribution
// (reported purchases matched the orders table exactly), but the duplicates
// still reach the pixel and drag down Event Quality diagnostics.
let advancedMatchingSent = false

// Advanced Matching: feed known customer info so Meta can match conversions to
// real accounts — this lifts the pixel "match quality" score (was ~6.1 on
// IP/cookie alone) and makes retargeting far more effective. The Pixel SDK
// SHA-256 hashes these fields client-side before they ever leave the browser,
// so no raw PII is transmitted. Re-calling fbq('init', …) with the data is the
// documented way to attach Advanced Matching mid-session — but only ever once.
//
// Losing the refresh on a re-submit costs little: the server-side Conversions
// API sends the same fields hashed from the order record, and that is the
// authoritative match signal for Purchase.
export function identify(user = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  if (advancedMatchingSent) return
  const am = {}
  if (user.email) am.em = String(user.email).trim().toLowerCase()
  if (user.phone) {
    let d = String(user.phone).replace(/\D/g, '')
    if (d.length === 10) d = '91' + d // default to India country code
    if (d) am.ph = d
  }
  if (user.firstName) am.fn = String(user.firstName).trim().toLowerCase()
  if (user.lastName) am.ln = String(user.lastName).trim().toLowerCase()
  if (user.city) am.ct = String(user.city).trim().toLowerCase().replace(/\s+/g, '')
  if (user.state) am.st = String(user.state).trim().toLowerCase().replace(/\s+/g, '')
  if (user.zip) am.zp = String(user.zip).trim()
  // Nothing but the hardcoded country means there is no one to match against —
  // don't spend the single allowed init on an empty payload.
  if (Object.keys(am).length === 0) return
  am.country = 'in'
  advancedMatchingSent = true
  window.fbq('init', PIXEL_ID, am)
}
