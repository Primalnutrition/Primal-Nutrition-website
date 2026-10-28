import { useState, useEffect, useRef, useCallback } from 'react'
import { usePage } from '../context/RouterContext.jsx'

/* Product-led hero: one banner per product, real HTML text in the image's open
   area (images carry no text). Each slide has a desktop + mobile crop; `tone`
   says whether the open area is light (dark text) or dark (light text).
   PLACEHOLDERS until the commissioned nature/studio banners land in /home/:
     hero-trex-{dsk,mob}.jpg · hero-tongkat-* · hero-cordyceps-* · hero-range-* */
const SLIDES = [
  {
    img: { desktop: '/brand/volcano-forge-poster.webp', mobile: '/brand/volcano-forge-poster.webp' },
    tone: 'dark',
    eyebrow: 'T-REX Liquid',
    title: ['Strength from the', 'roof of the world.'],
    sub: 'Himalayan Shilajit and six Ayurvedic herbs, in one daily shot.',
    cta: 'Shop T-REX',
    to: { page: 'product', id: 'trex-liquid' },
  },
  {
    img: { desktop: '/products/forge/trex-tongkat.jpg', mobile: '/products/forge/trex-tongkat.jpg' },
    tone: 'dark',
    eyebrow: 'Tongkat Ali',
    title: ['Born in the', 'rainforest.'],
    sub: 'Wild-harvested Malaysian root, concentrated 100:1, for strength and drive.',
    cta: 'Shop Tongkat Ali',
    to: { page: 'product', id: 'trex-tongkat' },
  },
  {
    img: { desktop: '/products/forge/trex-cordyceps.jpg', mobile: '/products/forge/trex-cordyceps.jpg' },
    tone: 'dark',
    eyebrow: 'Cordyceps',
    title: ['Thrives where', 'the air runs thin.'],
    sub: 'The high-altitude mushroom for stamina and endurance.',
    cta: 'Shop Cordyceps',
    to: { page: 'product', id: 'trex-cordyceps' },
  },
  {
    img: { desktop: '/products/forge/trex-royal-jelly.jpg', mobile: '/products/forge/trex-royal-jelly.jpg' },
    tone: 'dark',
    eyebrow: 'The Rare Herb Series',
    title: ['Sourced from the wild.', 'Built for performance.'],
    sub: 'Tongkat Ali, Royal Jelly, Black Maca, Cordyceps and more.',
    cta: 'Explore the range',
    to: { page: 'shop' },
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

  const onCta = (to) => navigate(to.page, to.id ? { id: to.id } : undefined)

  return (
    <section
      className="relative w-full overflow-hidden mt-16 lg:mt-20 h-[78svh] min-h-[500px] max-h-[760px] select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Primal Nutrition"
    >
      {SLIDES.map((s, i) => (
        <div
          key={s.eyebrow}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={i !== active}
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={s.img.mobile} />
            <img
              src={s.img.desktop}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-right"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchpriority={i === 0 ? 'high' : 'auto'}
              decoding="async"
            />
          </picture>
          {s.tone === 'dark' ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent md:from-white/60" />
          )}
          <div className="container-x relative h-full flex flex-col justify-center pb-10">
            <div className="max-w-xl">
              <div className="eyebrow mb-5 text-amber">{s.eyebrow}</div>
              <h1 className={`font-display font-black text-[2.6rem] sm:text-6xl lg:text-7xl tracking-tightest leading-[0.98] mb-5 ${s.tone === 'light' ? 'text-ink' : ''}`}>
                {s.title[0]}<br /><span className="text-shimmer">{s.title[1]}</span>
              </h1>
              <p className={`text-lg leading-relaxed max-w-md mb-8 ${s.tone === 'light' ? 'text-ink/75' : 'text-bone/75'}`}>{s.sub}</p>
              <button onClick={() => onCta(s.to)} className="btn-primary">{s.cta}</button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-0 right-0 z-10 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.eyebrow}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 h-1.5 ${i === active ? 'w-7 bg-amber' : 'w-1.5 bg-bone/35'}`}
          />
        ))}
      </div>
    </section>
  )
}
