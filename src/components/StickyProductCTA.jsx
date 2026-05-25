import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

/* Floating add-to-cart bar that appears on PDP after hero scrolls out.
   Senior-UX move: lets the user act anywhere on the page without scrolling
   back to the hero, and reinforces price anchor + savings constantly. */
export default function StickyProductCTA({ product, variant }) {
  const { addToCart } = useCart()
  const [show, setShow] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!product || !variant) return null

  const handleAdd = () => {
    setAdding(true)
    addToCart(product.id, variant.id, 1, true)
    setTimeout(() => setAdding(false), 1000)
  }

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 transition-all duration-500 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
    >
      <div className="container-x pb-4">
        <div className="mx-auto max-w-3xl bg-ink-800/95 backdrop-blur-xl border border-bone/10 rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
          {/* Mini visual */}
          <div className={`hidden sm:block flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${product.accent} flex items-center justify-center font-display font-black text-ink text-xl`}>
            {product.name[0]}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold leading-tight text-bone truncate">{product.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-bone/45 truncate">
              {variant.label}{variant.sub ? ` · ${variant.sub}` : ''}
            </div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0 hidden sm:block">
            <div className="font-stencil text-2xl text-gradient-primal leading-none">₹{variant.price.toLocaleString('en-IN')}</div>
            {variant.compareAt && (
              <div className="text-[10px] text-bone/40 line-through">₹{variant.compareAt.toLocaleString('en-IN')}</div>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={adding}
            className={`flex-shrink-0 py-2.5 px-4 sm:px-5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              adding ? 'bg-forest text-bone' : 'btn-primary !py-2.5 !px-5'
            }`}
          >
            <span className="sm:hidden">
              {adding ? '✓ Added' : `Add · ₹${variant.price.toLocaleString('en-IN')}`}
            </span>
            <span className="hidden sm:inline">
              {adding ? '✓ Added' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
