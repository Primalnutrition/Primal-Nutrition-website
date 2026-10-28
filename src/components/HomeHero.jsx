import { useState, useEffect, useRef, useCallback } from 'react'
import { usePage } from '../context/RouterContext.jsx'
import Picture from './Picture.jsx'

/* Brand-level hero: 3 slides, real HTML text over text-free photography.
   Swipe + dots, auto-advances, pauses on touch. */
const SLIDES = [
  {
    img: '/brand/volcano-forge-poster.webp',
    eyebrow: 'Primal Nutrition',
    title: ['Built for the men', 'India forgot to make.'],
    sub: 'Rare herbs, sourced at origin. Lab-tested. Made for Indian men.',
    cta: 'Shop the range',
    action: 'range',
  },
  {
    img: '/products/forge/trex-royal-jelly.jpg',
    eyebrow: 'The Rare Herb Series',
    title: ['Sourced from the wild.', 'Built for performance.'],
    sub: 'Tongkat Ali, Royal Jelly, Black Maca, Cordyceps and more.',
    cta: 'Explore the series',
    action: 'shop',
  },
  {
    img: '/products/forge/trex-tongkat.jpg',
    eyebrow: 'Free delivery · Free COD',
    title: ['No extra charge.', 'No excuses.'],
    sub: 'Cash on Delivery at no extra cost, or pay online and save ₹200.',
    cta: 'Shop now',
    action: 'range',
  },
]

const AUTO_MS = 6000

export default function HomeHero() {
  const { navigate } = usePage()
  const [active, setActive] = useState(0)
  const timer = useRef(null)
  const touchX = useRef(null)

  const restart = useCallback(() => {
    clearInterval(timer.current)
    timer.current = setInterval(() => setActive((p) => (p + 1) % SLIDES.length), AUTO_MS)
  }, [])
  useEffect(() => { restart(); return () => clearInterval(timer.current) }, [restart])

  const go = (i) => { setActive((i + SLIDES.length) % SLIDES.length); restart() }
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1))
    touchX.current = null
  }

  const onCta = (action) => {
    if (action === 'shop') navigate('shop')
    else document.getElementById('range')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      className="relative w-full overflow-hidden mt-16 lg:mt-20 h-[78svh] min-h-[500px] max-h-[760px] select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Primal Nutrition"
    >
      {SLIDES.map((s, i) => (
        <div
          key={s.title[0]}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={i !== active}
        >
          <Picture
            src={s.img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchpriority={i === 0 ? 'high' : 'auto'}
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
          <div className="container-x relative h-full flex flex-col justify-center pb-10">
            <div className="max-w-xl">
              <div className="eyebrow mb-5 text-amber">{s.eyebrow}</div>
              <h1 className="font-display font-black text-[2.6rem] sm:text-6xl lg:text-7xl tracking-tightest leading-[0.98] mb-5">
                {s.title[0]}<br /><span className="text-shimmer">{s.title[1]}</span>
              </h1>
              <p className="text-lg text-bone/75 leading-relaxed max-w-md mb-8">{s.sub}</p>
              <button onClick={() => onCta(s.action)} className="btn-primary">{s.cta}</button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-0 right-0 z-10 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.title[0]}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 h-1.5 ${i === active ? 'w-7 bg-amber' : 'w-1.5 bg-bone/35'}`}
          />
        ))}
      </div>
    </section>
  )
}
