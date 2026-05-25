import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function StickyCTA() {
  const [visible, setVisible] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`fixed bottom-0 inset-x-0 z-30 sm:hidden transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-ink/95 backdrop-blur-xl border-t border-amber/20 px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-widest text-bone/40">T-Rex · 500ml</div>
          <div className="font-display font-bold text-bone leading-tight">₹1,999 <span className="text-bone/40 line-through text-xs">₹2,200</span></div>
        </div>
        <button
          onClick={() => addToCart('trex-liquid', 'trex-1', 1, true)}
          className="bg-amber text-bone font-bold px-5 py-3 rounded-full text-sm"
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}
