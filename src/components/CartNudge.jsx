import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { track } from '../lib/metaPixel.js'

// Shoppers who add to cart and then wander off get one gentle nudge:
// finish checkout, or order over WhatsApp with the cart pre-filled.
const WA_NUMBER = '917838026415'
const DELAY_MS = 45000
const SEEN_KEY = 'primal_cart_nudge_seen'

export default function CartNudge() {
  const { lineItems, count, payable, isOpen, openCart } = useCart()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!count || isOpen) { setShow(false); return }
    try { if (sessionStorage.getItem(SEEN_KEY)) return } catch {}
    const t = setTimeout(() => {
      setShow(true)
      try { sessionStorage.setItem(SEEN_KEY, '1') } catch {}
    }, DELAY_MS)
    return () => clearTimeout(t)
  }, [count, isOpen])

  if (!show) return null

  const lines = lineItems.map((l) => `• ${l.product.name} (${l.variant.label}) × ${l.qty}`).join('\n')
  const text = `Hi Primal, I'd like to order:\n${lines}\nTotal: ₹${payable.toLocaleString('en-IN')}`
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-4 right-4 sm:right-auto sm:w-[360px] z-[65]">
      <div className="relative bg-ink-800 border border-bone/10 rounded-2xl p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <button
          onClick={() => setShow(false)}
          aria-label="Dismiss"
          className="absolute top-3 right-3 w-7 h-7 rounded-full text-bone/50 hover:text-bone hover:bg-bone/10 transition"
        >
          ×
        </button>
        <div className="text-[11px] uppercase tracking-widest text-amber mb-1">Your cart is waiting</div>
        <div className="font-display font-bold text-lg leading-snug pr-6">
          {count} item{count > 1 ? 's' : ''} · ₹{payable.toLocaleString('en-IN')}
        </div>
        <p className="text-sm text-bone/60 mt-1">Questions before you order? Chat with us, or order directly on WhatsApp.</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => { setShow(false); openCart() }}
            className="btn-primary flex-1 text-sm py-2.5"
          >
            Checkout
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { track('Contact', { content_name: 'cart_nudge_whatsapp', value: payable, currency: 'INR' }); setShow(false) }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-ink font-semibold text-sm py-2.5 hover:brightness-110 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0012 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 005.6 1.4h.1c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.3zM12 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 01-1.5-5.2C2.1 6.5 6.5 2.1 12 2.1c2.6 0 5.1 1 7 2.9a9.8 9.8 0 012.9 7c0 5.5-4.4 9.7-9.9 9.7zm5.4-7.3c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.2c-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
