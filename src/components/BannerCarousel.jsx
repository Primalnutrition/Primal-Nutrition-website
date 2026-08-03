import { useState, useEffect, useRef, useCallback } from 'react'

const BANNERS = [
  { dsk: '/banners/banner-01-dsk.png', mob: '/banners/banner-01-mob.png', alt: 'Primal Nutrition — Banner 1' },
  { dsk: '/banners/banner-02-dsk.png', mob: '/banners/banner-02-mob.png', alt: 'Primal Nutrition — Banner 2' },
  { dsk: '/banners/banner-03-dsk.png', mob: '/banners/banner-03-mob.png', alt: 'Primal Nutrition — Banner 3' },
  { dsk: '/banners/banner-04-dsk.png', mob: '/banners/banner-04-mob.png', alt: 'Primal Nutrition — Banner 4' },
  { dsk: '/banners/banner-05-dsk.png', mob: '/banners/banner-05-mob.png', alt: 'Primal Nutrition — Banner 5' },
]

const AUTO_MS = 4500

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
      {/* Slide stack — all rendered, crossfade via opacity */}
      <div className="relative w-full">
        {/* Invisible spacer sized to the first banner — keeps container height stable */}
        <div aria-hidden="true" className="invisible">
          <img src={BANNERS[0].mob} alt="" className="w-full block md:hidden" />
          <img src={BANNERS[0].dsk} alt="" className="w-full hidden md:block" />
        </div>

        {/* All slides absolutely positioned, fade in/out */}
        {BANNERS.map((b, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={i !== active}
          >
            <img
              src={b.mob}
              alt={b.alt}
              className="w-full h-full object-cover object-left block md:hidden"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <img
              src={b.dsk}
              alt={b.alt}
              className="w-full h-full object-cover object-left hidden md:block"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
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
        {BANNERS.map((_, i) => (
          <button
            key={i}
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
