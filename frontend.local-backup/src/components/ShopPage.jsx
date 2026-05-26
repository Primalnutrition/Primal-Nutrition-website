import { useMemo, useState } from 'react'
import { categories, products } from '../data/products.js'
import ProductCard from './ProductCard.jsx'
import Footer from './Footer.jsx'

export default function ShopPage() {
  const [active, setActive] = useState('all')

  const filtered = useMemo(
    () => (active === 'all' ? products : products.filter((p) => p.category === active)),
    [active]
  )

  return (
    <>
      {/* Page hero */}
      <section className="relative pt-28 pb-14 gradient-amber grain border-b border-bone/10 overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-amber/10 blur-[140px] pointer-events-none" />
        <div className="container-x relative">
          <div className="eyebrow mb-5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber mr-3 align-middle animate-shimmer" />
            The Catalog · 10 SKUs
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-black tracking-tightest leading-[0.95] mb-5">
            Shop the<br />
            <span className="italic font-medium text-shimmer">complete stack.</span>
          </h1>
          <p className="text-lg text-bone/70 max-w-2xl leading-relaxed">
            One liquid hero. Eight standardized adaptogens. One multivitamin floor. One creatine layer. Pick what your protocol needs.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-x-10 gap-y-4 text-sm text-bone/65">
            <Stat label="Products" value={products.length} />
            <Stat label="Categories" value={categories.length - 1} />
            <Stat label="Lab tested" value="Every batch" />
            <Stat label="Shipping" value="Free pan-India" />
          </div>
        </div>
      </section>

      {/* Filter + grid */}
      <section id="shop" className="py-16 lg:py-24">
        <div className="container-x">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-10 sticky top-16 lg:top-20 bg-ink/85 backdrop-blur-xl py-3 -mx-4 px-4 z-20 border-b border-bone/5">
            {categories.map((c) => {
              const isActive = c.id === active
              const count = c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
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

          {filtered.length === 0 && (
            <div className="text-center py-20 text-bone/40">No products in this category yet.</div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="font-display font-bold text-amber text-2xl leading-none">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-bone/50 mt-1">{label}</div>
    </div>
  )
}
