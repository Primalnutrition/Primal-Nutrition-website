import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function CartButton({ variant = 'header' }) {
  const { count, openCart } = useCart()
  const [bump, setBump] = useState(false)

  // Pulse the badge when count changes
  useEffect(() => {
    if (count === 0) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 450)
    return () => clearTimeout(t)
  }, [count])

  if (variant === 'icon') {
    return (
      <button
        onClick={openCart}
        aria-label={`Open cart, ${count} items`}
        className="relative w-10 h-10 flex items-center justify-center rounded-full border border-bone/15 hover:border-amber hover:text-amber transition"
      >
        <CartIcon />
        {count > 0 && <Badge count={count} bump={bump} />}
      </button>
    )
  }

  return (
    <button
      onClick={openCart}
      aria-label={`Open cart, ${count} items`}
      className="relative inline-flex items-center gap-2 text-sm font-medium text-bone hover:text-amber transition"
    >
      <CartIcon />
      <span className="hidden sm:inline">Cart</span>
      <span
        className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold transition-all ${
          count > 0 ? 'bg-amber text-ink' : 'bg-bone/10 text-bone/60'
        } ${bump ? 'scale-125' : 'scale-100'}`}
        style={{ transitionDuration: '250ms' }}
      >
        {count}
      </span>
    </button>
  )
}

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function Badge({ count, bump }) {
  return (
    <span
      className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber text-ink text-[10px] font-bold flex items-center justify-center transition-transform ${
        bump ? 'scale-125' : 'scale-100'
      }`}
      style={{ transitionDuration: '250ms' }}
    >
      {count}
    </span>
  )
}
