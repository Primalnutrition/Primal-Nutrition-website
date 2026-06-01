// Thin wrapper around the Meta Pixel `fbq` global installed in index.html.
// No-ops on SSR or when the snippet hasn't loaded yet (ad blockers, etc.),
// so callers don't need to guard every site.
export function track(event, params) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  if (params) window.fbq('track', event, params)
  else window.fbq('track', event)
}
