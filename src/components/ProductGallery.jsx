import { useState, useEffect, useRef, useCallback } from 'react'
import Picture from './Picture.jsx'

/* PDP gallery — swipeable carousel + thumbnail strip.
   No background, no filters, no overlays — images render exactly as uploaded.

   Swipe is handled by CSS scroll-snap rather than touch-event maths: it gives
   native momentum, rubber-banding and trackpad support for free, and keeps
   the whole thing working if JS is slow to hydrate. The active index is read
   back from scroll position; thumbnails and arrows scroll the same track. */
export default function ProductGallery({ product }) {
  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image].filter(Boolean)

  const [active, setActive] = useState(0)
  const trackRef = useRef(null)
  const thumbsRef = useRef(null)
  const slideRefs = useRef([])

  // Move to a slide by scrolling its own element into view. More reliable
  // than computing scrollLeft, and it stays correct if slide widths change.
  const scrollTo = useCallback((i) => {
    const clamped = Math.max(0, Math.min(i, images.length - 1))
    const el = slideRefs.current[clamped]
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start',
    })
    setActive(clamped)
  }, [images.length])

  // Active slide is derived by observing which one actually occupies the
  // viewport, rather than listening for scroll events — those do not fire in
  // every environment, and this stays correct through momentum and snapping.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const obs = new IntersectionObserver(
      (entries) => {
        let best = null
        for (const e of entries) {
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e
        }
        if (best && best.intersectionRatio > 0.5) {
          const i = slideRefs.current.indexOf(best.target)
          if (i >= 0) setActive(i)
        }
      },
      { root: track, threshold: [0.25, 0.5, 0.75, 1] },
    )
    slideRefs.current.filter(Boolean).forEach((el) => obs.observe(el))

    // Fallback: derive the index from scroll position too. Both paths compute
    // the same value and React bails out on an identical state, so they cannot
    // fight. Two cheap mechanisms is worth it here because a gallery that
    // silently stops tracking its own position is a bad failure.
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const w = track.clientWidth || 1
        setActive(Math.max(0, Math.min(Math.round(track.scrollLeft / w), images.length - 1)))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      obs.disconnect()
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [images.length])

  // New product — jump back to the first image without animating.
  useEffect(() => {
    setActive(0)
    trackRef.current?.scrollTo({ left: 0, behavior: 'auto' })
  }, [product.id])

  // Keep the active thumbnail in view as the strip scrolls.
  useEffect(() => {
    thumbsRef.current?.children?.[active]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [active])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollTo(active + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollTo(active - 1) }
  }

  const many = images.length > 1

  return (
    <div>
      <div className="relative w-full rounded-2xl overflow-hidden group">
        {/* Swipeable track. Each slide snaps to centre; overscroll is contained
            so a horizontal swipe never drags the page behind it. */}
        <div
          ref={trackRef}
          role={many ? 'group' : undefined}
          aria-roledescription={many ? 'carousel' : undefined}
          aria-label={many ? `${product.name} images` : undefined}
          tabIndex={many ? 0 : -1}
          onKeyDown={many ? onKeyDown : undefined}
          /* No `scroll-smooth` class here on purpose: CSS scroll-behavior wins
             over the `behavior` passed to scrollTo, which would force an
             animation on people who set prefers-reduced-motion. Smoothness is
             decided in scrollTo() instead. Native swipe is unaffected. */
          className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain
                     outline-none [scrollbar-width:none] [-ms-overflow-style:none]
                     [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <div
              key={src}
              ref={(el) => { slideRefs.current[i] = el }}
              className="w-full shrink-0 snap-start"
            >
              <Picture
                src={src}
                alt={`${product.name} · view ${i + 1} of ${images.length}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-auto block select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Arrows — pointer devices only, so they never sit under a thumb. */}
        {many && (
          <>
            <button
              type="button"
              onClick={() => scrollTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous image"
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9
                         items-center justify-center rounded-full bg-ink/70 backdrop-blur-md
                         border border-bone/15 text-bone opacity-0 group-hover:opacity-100
                         focus-visible:opacity-100 transition disabled:opacity-0"
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(active + 1)}
              disabled={active === images.length - 1}
              aria-label="Next image"
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9
                         items-center justify-center rounded-full bg-ink/70 backdrop-blur-md
                         border border-bone/15 text-bone opacity-0 group-hover:opacity-100
                         focus-visible:opacity-100 transition disabled:opacity-0"
            >
              <span aria-hidden>›</span>
            </button>

            {/* Position counter — tells you there is more to swipe to. */}
            <div className="absolute bottom-3 right-3 z-10 rounded-full bg-ink/75 backdrop-blur-md
                            border border-bone/10 px-2.5 py-1 text-[10px] font-brand text-bone/85
                            tabular-nums">
              {active + 1} / {images.length}
            </div>
          </>
        )}

        {/* Category chip */}
        <div className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.2em] text-bone bg-ink/80 backdrop-blur-md rounded-full px-2.5 py-1 font-brand font-semibold border border-bone/10 z-10">
          {product.categoryLabel}
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] text-ink bg-amber rounded-full px-2.5 py-1 font-brand font-bold z-10">
            {product.badge}
          </div>
        )}
      </div>

      {/* Dots — the swipe affordance on small screens, where seven thumbnails
          in a row are too small to be a usable target. */}
      {many && (
        <div className="mt-3 flex sm:hidden justify-center gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? 'w-5 bg-amber' : 'w-1.5 bg-bone/25'
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails — scrollable strip rather than a cramped fixed grid. */}
      {many && (
        <div
          ref={thumbsRef}
          className="mt-3 hidden sm:flex gap-2 overflow-x-auto pb-1 overscroll-x-contain
                     [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`relative w-14 shrink-0 aspect-square rounded-lg overflow-hidden border-2 transition ${
                i === active
                  ? 'border-amber'
                  : 'border-bone/10 hover:border-bone/30 opacity-60 hover:opacity-100'
              }`}
            >
              <Picture
                src={src}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
