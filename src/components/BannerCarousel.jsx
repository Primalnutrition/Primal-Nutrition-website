import { useState, useEffect, useRef, useCallback } from 'react'

// Each banner ships as mob/dsk crops in avif + webp + png. The <picture>
// below picks one file per slide: the browser matches `media` first, then
// takes the first `type` it can decode. Previously this component rendered
// two <img> tags per slide (one hidden per breakpoint) pointing at the PNGs
// only, so a phone downloaded both crops at full PNG weight — 2.77 MB before
// first paint, against 0.04 MB for the AVIF it actually needed.
//
// `pos` carries both breakpoints' object-position as one literal string so
// Tailwind's scanner still sees the class names.
//   banner-01/02/04/05: text sits at the left edge → object-left
//   banner-03: 3 centred bottles → object-center on mobile
const BANNERS = [
  { base: 'banner-01', pos: 'object-left md:object-left',   alt: 'Primal Nutrition — Banner 1' },
  { base: 'banner-02', pos: 'object-left md:object-left',   alt: 'Primal Nutrition — Banner 2' },
  { base: 'banner-03', pos: 'object-center md:object-left', alt: 'Primal Nutrition — Banner 3' },
  { base: 'banner-04', pos: 'object-left md:object-left',   alt: 'Primal Nutrition — Banner 4' },
  { base: 'banner-05', pos: 'object-left md:object-left',   alt: 'Primal Nutrition — Banner 5' },
]

// Matches Tailwind's md breakpoint (768px) used by the spacers below.
const MOB = '(max-width: 767px)'

const AUTO_MS = 4500

function BannerImage({ banner, eager }) {
  const { base, pos, alt } = banner
  return (
    <picture>
      <source media={MOB} type="image/avif" srcSet={`/banners/${base}-mob.avif`} />
      <source media={MOB} type="image/webp" srcSet={`/banners/${base}-mob.webp`} />
      <source media={MOB} srcSet={`/banners/${base}-mob.png`} />
      <source type="image/avif" srcSet={`/banners/${base}-dsk.avif`} />
      <source type="image/webp" srcSet={`/banners/${base}-dsk.webp`} />
      <img
        src={`/banners/${base}-dsk.png`}
        alt={alt}
        className={`w-full h-full object-cover ${pos}`}
        loading={eager ? 'eager' : 'lazy'}
        // lowercase: React 18 passes unknown attributes through only in this form
        fetchpriority={eager ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  )
}

export default function BannerCarousel() {
  const [active, setActive] = useState(0)
  const timerRef = useRef(null)
  const touchStartX = useRef(null)

  const go = useCallback((idx) => {
    setActive((idx + BANNERS.length) % BANNERS.length)
  }, [])

  const restart = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive((p) => (p + 1) % BANNERS.length), AUTO_MS)
  }, [])

  useEffect(() => {
    restart()
    return () => clearInterval(timerRef.current)
  }, [restart])

  const prev = () => { go(active - 1); restart() }
  const next = () => { go(active + 1); restart() }

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev() }
    touchStartX.current = null
  }

  return (
    <div
      className="relative w-full overflow-hidden select-none mt-16 lg:mt-20"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Primal Nutrition banners"
    >
      <div className="relative w-full">
        {/*
          Spacers — invisible, define container height for each breakpoint.
          Mobile: 9:16. Desktop: banner-01-dsk's natural 1914×822 ratio.
          Both are pure CSS; the desktop spacer used to render a real <img>
          of banner-01-dsk purely to reserve height.
        */}
        <div aria-hidden="true" className="aspect-[9/16] block md:hidden" />
        <div aria-hidden="true" className="aspect-[1914/822] hidden md:block" />

        {/* All slides absolutely positioned, crossfade via opacity */}
        {BANNERS.map((b, i) => (
          <div
            key={b.base}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={i !== active}
          >
            <BannerImage banner={b} eager={i === 0} />
          </div>
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous banner"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button
        onClick={next}
        aria-label="Next banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {BANNERS.map((b, i) => (
          <button
            key={b.base}
            onClick={() => { go(i); restart() }}
            aria-label={`Go to banner ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === active ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
