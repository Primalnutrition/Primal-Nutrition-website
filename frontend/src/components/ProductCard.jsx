import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { usePage } from '../context/RouterContext.jsx'
import { tiers } from '../data/products.js'
import ProductVisual from './ProductVisual.jsx'

export default function ProductCard({ product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const [adding, setAdding] = useState(false)
  const { addToCart } = useCart()
  const { navigate } = usePage()

  const variant = product.variants.find((v) => v.id === variantId)
  const hasMultiple = product.variants.length > 1

  const handleAdd = (e) => {
    e.stopPropagation()
    setAdding(true)
    addToCart(product.id, variantId, 1, false)
    setTimeout(() => setAdding(false), 900)
  }

  const openDetail = () => navigate('product', { id: product.id })

  return (
    <article
      onClick={openDetail}
      className="card-lift cursor-pointer group flex flex-col p-3 rounded-3xl border border-bone/10 bg-ink-800/40 hover:border-amber/30 transition relative"
    >
      <ProductVisual product={product} />

      <div className="p-3 pt-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-xl leading-tight">{product.name}</h3>
          {product.tier && (
            <span className="text-[9px] uppercase tracking-widest text-amber/80 border border-amber/30 rounded-full px-2 py-0.5 font-bold shrink-0">
              {tiers[product.tier]?.label || product.tier}
            </span>
          )}
        </div>
        <p className="text-bone/55 text-[12px] uppercase tracking-widest mb-3">{product.tagline}</p>
        <p className="text-bone/65 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">{product.description}</p>

        {/* Variant selector (multi only) */}
        {hasMultiple && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="grid grid-cols-1 gap-1.5 mb-4"
          >
            {product.variants.map((v) => {
              const active = v.id === variantId
              return (
                <button
                  key={v.id}
                  onClick={(e) => { e.stopPropagation(); setVariantId(v.id) }}
                  className={`flex items-center justify-between text-left px-3 py-2 rounded-lg border text-sm transition ${
                    active
                      ? 'border-amber bg-amber/10 text-bone'
                      : 'border-bone/10 text-bone/65 hover:border-bone/30 hover:text-bone'
                  }`}
                >
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold">{v.label}</span>
                    <span className="text-[10px] uppercase tracking-widest text-bone/40">{v.sub}</span>
                  </div>
                  <div className="text-right leading-tight">
                    <span className="font-display font-bold">₹{v.price.toLocaleString('en-IN')}</span>
                    {v.compareAt && (
                      <div className="text-[10px] text-bone/40 line-through">₹{v.compareAt.toLocaleString('en-IN')}</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {!hasMultiple && (
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-bone/45 mb-0.5">{variant.label} · {variant.sub}</div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl text-bone">₹{variant.price.toLocaleString('en-IN')}</span>
                {variant.compareAt && (
                  <span className="text-bone/40 line-through text-sm">₹{variant.compareAt.toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); openDetail() }}
            className="py-3 rounded-full text-sm font-medium border border-bone/15 text-bone/70 hover:border-amber hover:text-amber transition"
          >
            View
          </button>
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`py-3 rounded-full text-sm font-semibold transition-all ${
              adding ? 'bg-forest text-bone' : 'bg-amber text-ink hover:bg-amber-light'
            }`}
          >
            {adding ? '✓ Added' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  )
}
