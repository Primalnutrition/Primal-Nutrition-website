// Thin wrapper around the Meta Pixel `fbq` global installed in index.html.
// No-ops on SSR or when the snippet hasn't loaded yet (ad blockers, etc.),
// so callers don't need to guard every site.
const PIXEL_ID = '991258953663271'

export function track(event, params) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  if (params) window.fbq('track', event, params)
  else window.fbq('track', event)
}

// Advanced Matching: feed known customer info so Meta can match conversions to
// real accounts — this lifts the pixel "match quality" score (was ~6.1 on
// IP/cookie alone) and makes retargeting far more effective. The Pixel SDK
// SHA-256 hashes these fields client-side before they ever leave the browser,
// so no raw PII is transmitted. Re-calling fbq('init', …) with the data is the
// documented way to attach Advanced Matching mid-session; Meta dedupes the init.
export function identify(user = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
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
  am.country = 'in'
  window.fbq('init', PIXEL_ID, am)
}
