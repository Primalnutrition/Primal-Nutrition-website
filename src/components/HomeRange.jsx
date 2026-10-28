import { useRef } from 'react'
import { products } from '../data/products.js'
import ProductCard from './ProductCard.jsx'

/* Every product in one swipeable row (scroll-snap on touch, arrows on desktop). */
export default function HomeRange() {
  const row = useRef(null)
  const scroll = (dir) => {
    const el = row.current
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 360), behavior: 'smooth' })
  }

  return (
    <section id="range" className="py-20 lg:py-28 scroll-mt-20">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">The range</div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold tracking-tightest leading-[1.02]">
              Shop the<br /><span className="text-shimmer">Primal range.</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="Previous products" className="w-11 h-11 rounded-full border border-bone/20 hover:border-amber hover:text-amber transition">←</button>
            <button onClick={() => scroll(1)} aria-label="Next products" className="w-11 h-11 rounded-full border border-bone/20 hover:border-amber hover:text-amber transition">→</button>
          </div>
        </div>
      </div>
      <div
        ref={row}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 lg:px-10 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div key={p.id} className="snap-start shrink-0 w-[78%] sm:w-[320px] flex [&>*]:w-full">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
