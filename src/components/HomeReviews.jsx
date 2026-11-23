import { useRef, useState, useEffect } from 'react'
import Picture from './Picture.jsx'
import { reviews } from './Reviews.jsx'
import { BENEFIT_ICONS } from '../lib/benefitIcons.jsx'

/* Lifestyle image beside a swipeable row of review cards (scroll-snap, no
   auto-rotate). A small person icon sits next to the stars. */
const IMG = '/home/reviews-hand.jpg'

export default function HomeReviews() {
  const row = useRef(null)
  const [i, setI] = useState(0)

  useEffect(() => {
    const el = row.current
    if (!el) return
    const onScroll = () => {
      const card = el.children[0]
      if (!card) return
      const step = card.getBoundingClientRect().width + 16
      setI(Math.min(reviews.length - 1, Math.round(el.scrollLeft / step)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (k) => {
    const el = row.current
    const card = el?.children[k]
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' })
  }

  return (
    <section className="py-16 lg:py-24 bg-ink-800/30">
      <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        <div className="lg:col-span-5 rounded-3xl overflow-hidden aspect-[4/5] max-h-[640px] w-full">
          <Picture src={IMG} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="lg:col-span-7 min-w-0">
          <div className="eyebrow mb-5">Real results</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-8">
            12,400+ Indian men.<br /><span className="text-shimmer">Here's what they say.</span>
          </h2>

          <div
            ref={row}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mr-4 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((r) => (
              <article
                key={r.name}
                className="snap-start shrink-0 w-[85%] sm:w-[400px] p-6 rounded-2xl border border-bone/10 bg-ink-800/60 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber" aria-hidden>
                      {BENEFIT_ICONS.user}
                    </svg>
                  </span>
                  <span className="text-amber text-lg tracking-wide">
                    {'★'.repeat(r.rating)}<span className="text-bone/15">{'★'.repeat(5 - r.rating)}</span>
                  </span>
                </div>
                <h3 className="font-display text-xl lg:text-2xl leading-snug mb-3">“{r.title}”</h3>
                <p className="text-bone/65 leading-relaxed text-[15px] mb-5 flex-1">{r.body}</p>
                <div className="text-sm text-bone/50">{r.name} · {r.city}</div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between mt-5">
            <div className="flex gap-2">
              {reviews.map((x, k) => (
                <button
                  key={x.name}
                  onClick={() => scrollTo(k)}
                  aria-label={`Review ${k + 1}`}
                  className={`h-1.5 rounded-full transition-all ${k === i ? 'w-7 bg-amber' : 'w-1.5 bg-bone/30'}`}
                />
              ))}
            </div>
            <div className="hidden md:flex gap-2">
              <button onClick={() => scrollTo(Math.max(0, i - 1))} aria-label="Previous review" className="w-10 h-10 rounded-full border border-bone/20 hover:border-amber hover:text-amber transition">←</button>
              <button onClick={() => scrollTo(Math.min(reviews.length - 1, i + 1))} aria-label="Next review" className="w-10 h-10 rounded-full border border-bone/20 hover:border-amber hover:text-amber transition">→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
