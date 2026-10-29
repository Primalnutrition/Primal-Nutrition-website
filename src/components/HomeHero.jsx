import { useState, useEffect, useRef, useCallback } from 'react'
import { usePage } from '../context/RouterContext.jsx'

/* Product-led hero: one nature banner per product, real HTML text in the
   image's open area (the images carry no text). Each slide ships a desktop
   crop (1920×820, product on the right, open sky left) and a mobile crop
   (~1030×1526, product low, open sky on top), each as avif/webp/jpg. */
const SLIDES = [
  {
    base: '/home/hero-trex',
    eyebrow: 'T-REX Liquid',
    title: ['Strength from the', 'roof of the world.'],
    sub: 'Himalayan Shilajit and six Ayurvedic herbs, in one daily shot.',
    cta: 'Shop T-REX',
    to: { page: 'product', id: 'trex-liquid' },
  },
  {
    base: '/home/hero-tongkat',
    eyebrow: 'Tongkat Ali',
    title: ['Born in the', 'rainforest.'],
    sub: 'Wild-harvested Malaysian root, concentrated 100:1.',
    cta: 'Shop Tongkat Ali',
    to: { page: 'product', id: 'trex-tongkat' },
  },
  {
    base: '/home/hero-cordyceps',
    eyebrow: 'Cordyceps',
    title: ['Thrives where', 'the air runs thin.'],
    sub: 'The high-altitude mushroom for stamina and endurance.',
    cta: 'Shop Cordyceps',
    to: { page: 'product', id: 'trex-cordyceps' },
  },
  {
    base: '/home/hero-maca',
    eyebrow: 'Black Maca',
    title: ['Grown at', '4,000 metres.'],
    sub: 'Andean black maca for strength, drive and stamina.',
    cta: 'Shop Black Maca',
    to: { page: 'product', id: 'trex-maca' },
  },
]

const MOB = '(max-width: 767px)'
const AUTO_MS = 6000

function SlideImage({ base, eager }) {
  return (
    <picture>
      <source media={MOB} type="image/avif" srcSet={`${base}-mob.avif`} />
      <source media={MOB} type="image/webp" srcSet={`${base}-mob.webp`} />
      <source media={MOB} srcSet={`${base}-mob.jpg`} />
      <source type="image/avif" srcSet={`${base}-dsk.avif`} />
      <source type="image/webp" srcSet={`${base}-dsk.webp`} />
      <img
        src={`${base}-dsk.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-bottom md:object-center"
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager ? 'high' : 'auto'}
        decoding="async"
      />
    </picture>
  )
}

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
      className="relative w-full overflow-hidden mt-16 lg:mt-20 select-none bg-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Primal Nutrition"
    >
      {/* Height follows the artwork: 2:3 on phones, 1920:820 on desktop */}
      <div aria-hidden="true" className="aspect-[1030/1526] md:hidden" />
      <div aria-hidden="true" className="hidden md:block aspect-[1920/820] max-h-[86vh]" />

      {SLIDES.map((s, i) => (
        <div
          key={s.base}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={i !== active}
        >
          <SlideImage base={s.base} eager={i === 0} />
          {/* Soft light wash on the text side only, so the photo stays bright */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-transparent md:bg-gradient-to-r md:from-white/55 md:via-white/10" />
          <div className="container-x relative h-full flex flex-col justify-start pt-10 md:justify-center md:pt-0">
            <div className="max-w-md lg:max-w-xl">
              <div className="eyebrow mb-4 text-amber">{s.eyebrow}</div>
              <h1 className="font-display font-black text-ink text-[2.4rem] sm:text-6xl lg:text-7xl tracking-tightest leading-[0.98] mb-4">
                {s.title[0]}<br /><span className="text-amber">{s.title[1]}</span>
              </h1>
              <p className="text-base lg:text-lg text-ink/75 leading-relaxed max-w-sm lg:max-w-md mb-6 lg:mb-8">{s.sub}</p>
              <button onClick={() => onCta(s.to)} className="btn-primary">{s.cta}</button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.base}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 h-1.5 ${i === active ? 'w-7 bg-amber' : 'w-1.5 bg-ink/30'}`}
          />
        ))}
      </div>
    </section>
  )
}
