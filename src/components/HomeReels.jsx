import { useEffect, useRef, useState } from 'react'
import { usePage } from '../context/RouterContext.jsx'
import { productById } from '../data/products.js'

/* Short vertical videos right after the range. Only the card in view plays
   (muted); tap a card to switch its sound on. Files are 720p, loaded lazily. */
const REELS = [
  { id: 'brand-film', to: { page: 'product', id: 'trex-liquid' } },
  { id: 'hand', to: { page: 'product', id: 'trex-liquid' } },
  { id: 'stack-creator', to: { page: 'product', id: 'trex-liquid' } },
  { id: 'interview', to: { page: 'product', id: 'trex-liquid' } },
  { id: 'dad-secret', to: { page: 'product', id: 'trex-liquid' } },
  { id: 'ginseng', to: { page: 'product', id: 'trex-ginseng' } },
  { id: 'stack-36', to: { page: 'stacks' } },
  // Retailer videos for the dealer page only (no product chip)
  { id: 'dealer-1', dealer: true },
  { id: 'dealer-2', dealer: true },
  { id: 'dealer-3', dealer: true },
  { id: 'dealer-4', dealer: true },
  { id: 'dealer-5', dealer: true },
  { id: 'dealer-6', dealer: true },
]

function Reel({ reel, active, onVisible, hideChip }) {
  const { navigate } = usePage()
  const box = useRef(null)
  const video = useRef(null)
  const [sound, setSound] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) onVisible(reel.id) }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [reel.id, onVisible])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (active) { v.play().catch(() => {}) } else { v.pause(); v.muted = true; setSound(false) }
  }, [active])

  const toggleSound = () => {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    setSound(!v.muted)
    if (active) v.play().catch(() => {})
  }

  const product = reel.to?.id ? productById(reel.to.id) : null
  const label = product ? product.name : 'The stacks'
  const price = product ? `₹${product.variants[0].price.toLocaleString('en-IN')}` : 'Save more'

  return (
    <div className="snap-start shrink-0 w-[62%] sm:w-[40%] lg:w-[19%]">
      <div ref={box} onClick={toggleSound} className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-ink-800 cursor-pointer">
        <video
          ref={video}
          src={`/home/reels/${reel.id}.mp4`}
          poster={`/home/reels/${reel.id}.jpg`}
          muted loop playsInline preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ink/60 backdrop-blur flex items-center justify-center text-sm" aria-hidden="true">
          {sound ? '🔊' : '🔇'}
        </span>
      </div>
      {!hideChip && <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-bone/10 bg-ink-800/40 px-3 py-2.5">
        <div className="leading-tight min-w-0">
          <div className="font-display font-bold text-sm truncate">{label}</div>
          <div className="text-[11px] text-bone/50">{price}</div>
        </div>
        <button
          onClick={() => navigate(reel.to.page, reel.to.id ? { id: reel.to.id } : undefined)}
          className="shrink-0 px-3.5 py-1.5 rounded-full bg-amber text-ink text-[11px] font-brand font-bold uppercase tracking-widest"
        >Shop</button>
      </div>}
    </div>
  )
}

/* Defaults are the homepage row; the T-REX page passes its own ids and copy,
   and hides the Shop chip for the page it is already on. */
export default function HomeReels({ ids, eyebrow = 'Watch', title = ['Real routines.', 'Real results.'], currentId, hideChips }) {
  const reels = ids ? ids.map((id) => REELS.find((r) => r.id === id)).filter(Boolean) : REELS.filter((r) => !r.dealer)
  const [activeId, setActiveId] = useState(null)
  const row = useRef(null)
  const scroll = (dir) => {
    const el = row.current
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 360), behavior: 'smooth' })
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">{eyebrow}</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              {title[0]}<br /><span className="text-shimmer">{title[1]}</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="Previous videos" className="w-11 h-11 rounded-full border border-bone/20 hover:border-amber hover:text-amber transition">←</button>
            <button onClick={() => scroll(1)} aria-label="Next videos" className="w-11 h-11 rounded-full border border-bone/20 hover:border-amber hover:text-amber transition">→</button>
          </div>
        </div>
      </div>
      <div ref={row} className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 lg:px-10 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reels.map((r) => <Reel key={r.id} reel={r} active={activeId === r.id} onVisible={setActiveId} hideChip={hideChips || r.to?.id === currentId} />)}
      </div>
    </section>
  )
}
