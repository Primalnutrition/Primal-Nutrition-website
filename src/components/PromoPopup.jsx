import { useCallback, useEffect, useRef, useState } from 'react'
import { usePage } from '../context/RouterContext.jsx'

/* Entry popup for the Hydra Muscle Double Pack.
   Homepage only, once per visitor, and never to someone who arrived from an
   ad — a paid visitor clicked for a specific product, and interrupting that
   to pitch a different one trades their intent away. Set SKIP_AD_TRAFFIC to
   false to show it to everyone. */

const SEEN_KEY = 'pn-promo-hydra-v1'   // bump the suffix to re-show it to everyone
const DELAY_MS = 1500                  // let the hero paint first; instant popups read as broken
const SKIP_AD_TRAFFIC = true

/** Did this visit originate from a paid click? URL params cover the landing
 *  hit; stored attribution covers later navigation within the session. */
function cameFromAd() {
  try {
    const p = new URLSearchParams(window.location.search)
    if (p.get('utm_medium') === 'paid' || p.has('fbclid')) return true
    const raw = localStorage.getItem('pn_attr_last')
    if (raw) {
      const a = JSON.parse(raw)
      if ((a?.medium ?? a?.lastTouch?.medium) === 'paid') return true
    }
  } catch {
    // Private mode or malformed value — treat as organic rather than suppress.
  }
  return false
}

export default function PromoPopup() {
  const { page, navigate } = usePage()
  const [open, setOpen] = useState(false)
  const closeRef = useRef(null)

  const dismiss = useCallback(() => {
    setOpen(false)
    try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
  }, [])

  useEffect(() => {
    if (page !== 'home') return
    let seen = false
    try { seen = localStorage.getItem(SEEN_KEY) === '1' } catch { /* private mode */ }
    if (seen) return
    if (SKIP_AD_TRAFFIC && cameFromAd()) return

    const t = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [page])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') dismiss() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, dismiss])

  if (!open) return null

  const goToProduct = () => {
    dismiss()
    navigate('product', { id: 'hydra-muscle' })
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Hydra Muscle Double Pack offer"
    >
      <div className="relative max-w-[420px] w-full motion-safe:animate-[fadeUp_.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeRef}
          onClick={dismiss}
          aria-label="Close offer"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-ink/70 backdrop-blur-sm border border-bone/25 text-bone hover:bg-ink hover:border-bone/50 flex items-center justify-center transition shadow-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        <button onClick={goToProduct} className="block w-full rounded-2xl overflow-hidden shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber">
          <picture>
            <source type="image/avif" srcSet="/promo/hydra-double-pack.avif" />
            <source type="image/webp" srcSet="/promo/hydra-double-pack.webp" />
            <img
              src="/promo/hydra-double-pack.png"
              alt="Hydra Muscle Double Pack — two 250g tubs for ₹1,200, 50 servings, online payment only"
              className="w-full h-auto max-h-[78vh] object-contain block"
              fetchpriority="high"
              decoding="async"
            />
          </picture>
        </button>

        <button
          onClick={goToProduct}
          className="mt-3 w-full py-3.5 rounded-full btn-primary font-semibold text-base"
        >
          Shop the Double Pack — ₹1,200
        </button>
      </div>
    </div>
  )
}
