import { useCart } from '../context/CartContext.jsx'

export default function Toast() {
  const { toast, openCart } = useCart()
  return (
    <div
      aria-live="polite"
      className={`fixed top-20 right-6 z-[70] transition-all duration-400 ${
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
      }`}
    >
      {toast && (
        <button
          onClick={openCart}
          className="flex items-center gap-3 bg-amber text-ink px-4 py-3 rounded-full shadow-[0_20px_60px_-15px_rgba(200,146,61,0.7)] hover:bg-amber-light transition group"
        >
          <span className="w-7 h-7 rounded-full bg-ink/20 flex items-center justify-center text-amber font-bold">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          </span>
          <span className="text-sm font-semibold">{toast.text}</span>
          <span className="text-xs uppercase tracking-widest opacity-70 group-hover:opacity-100">View →</span>
        </button>
      )}
    </div>
  )
}
