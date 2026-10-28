import { useEffect, useState } from 'react'
import Picture from './Picture.jsx'
import { reviews } from './Reviews.jsx'

/* One large lifestyle image beside one quote at a time — calmer than a card grid. */
const SHOWN = reviews.slice(0, 3)
const IMG = '/products/trex-v2-01.png'   // placeholder → /home/reviews-lifestyle.jpg

export default function HomeReviews() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SHOWN.length), 7000)
    return () => clearInterval(t)
  }, [])
  const r = SHOWN[i]

  return (
    <section className="py-16 lg:py-24 bg-ink-800/30">
      <div className="container-x grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[4/3]">
          <Picture src={IMG} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-lg">
          <div className="eyebrow mb-5">Real results</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] mb-8">
            12,400+ Indian men.<br /><span className="text-shimmer">Here's what they say.</span>
          </h2>
          <div key={i}>
            <div className="text-amber text-lg mb-3">{'★'.repeat(r.rating)}<span className="text-bone/15">{'★'.repeat(5 - r.rating)}</span></div>
            <p className="font-display text-2xl leading-snug mb-4">“{r.title}”</p>
            <p className="text-bone/65 leading-relaxed mb-5">{r.body}</p>
            <div className="text-sm text-bone/50">{r.name} · {r.city}</div>
          </div>
          <div className="flex gap-2 mt-8">
            {SHOWN.map((x, k) => (
              <button
                key={x.name}
                onClick={() => setI(k)}
                aria-label={`Review ${k + 1}`}
                className={`h-1.5 rounded-full transition-all ${k === i ? 'w-7 bg-amber' : 'w-1.5 bg-bone/30'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
