import { useMemo, useState } from 'react'
import { categories, products } from '../data/products.js'
import ProductCard from './ProductCard.jsx'

export default function Shop() {
  const [active, setActive] = useState('all')

  const filtered = useMemo(
    () => (active === 'all' ? products : products.filter((p) => p.category === active)),
    [active]
  )

  return (
    <section id="shop" className="py-28 relative">
      <div className="container-x">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">The Stack · 10 Products</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] mb-5">
              Build your protocol.<br/>
              <span className="italic font-medium text-amber-light">One bottle at a time.</span>
            </h2>
            <p className="text-bone/65 text-lg leading-relaxed">
              Start with T-Rex. Layer in adaptogens for specific goals. Add Hydra Muscle for training days.
            </p>
          </div>
          <div className="text-sm text-bone/45">
            <span className="block">Free shipping</span>
            <span className="block">Cash on delivery available</span>
            <span className="block">Third-party tested · every batch</span>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => {
            const isActive = c.id === active
            const count = c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  isActive
                    ? 'border-amber bg-amber text-ink shadow-[0_8px_24px_-10px_rgba(200,146,61,0.5)]'
                    : 'border-bone/15 text-bone/70 hover:border-amber/40 hover:text-bone'
                }`}
              >
                {c.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-ink/15 text-ink' : 'bg-bone/10 text-bone/55'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div data-reveal-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
