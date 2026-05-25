import { useCart } from '../context/CartContext.jsx'
import { usePage } from '../context/RouterContext.jsx'
import { stacks, pricingFor } from '../data/stacks.js'
import { productById } from '../data/products.js'
import Footer from './Footer.jsx'

export default function StacksPage() {
  const { navigate } = usePage()
  const { addToCart, openCart } = useCart()

  const addStack = (stack) => {
    stack.items.forEach((it) => addToCart(it.productId, it.variantId, 1, false))
    setTimeout(openCart, 250)
  }

  return (
    <>
      {/* Hero strip */}
      <section className="relative pt-28 pb-14 gradient-amber grain border-b border-bone/10 overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-amber/10 blur-[140px] pointer-events-none" />
        <img src="/brand/dotted-circle.png" alt="" aria-hidden className="absolute -bottom-32 -left-32 w-[600px] opacity-10 mix-blend-lighten pointer-events-none" />
        <div className="container-x relative">
          <nav className="mb-8 text-xs uppercase tracking-widest text-bone/45 flex items-center gap-2 font-brand">
            <button onClick={() => navigate('home')} className="hover:text-amber transition">Home</button>
            <span>/</span>
            <span className="text-bone/80">Stacks</span>
          </nav>
          <div className="eyebrow mb-5 font-brand tracking-[0.28em]">
            <span className="inline-block w-2 h-2 rounded-full bg-amber mr-3 align-middle animate-shimmer" />
            Premium Performance Stacks
          </div>
          <h1 className="font-display text-5xl lg:text-8xl tracking-tight leading-[0.92] mb-5 uppercase">
            BUILT IN<br/>
            <span className="text-shimmer">STACKS.</span>
          </h1>
          <p className="text-lg text-bone/70 max-w-2xl leading-relaxed">
            Six engineered bundles. Each one layers T-Rex with a specialist product for a specific goal — strength, recovery, drive, vitality. Bundle pricing locked in below.
          </p>
        </div>
      </section>

      {/* Stack grid */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div data-reveal-stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stacks.map((stack) => {
              const price = pricingFor(stack)
              return (
                <article key={stack.id} className="card-lift relative rounded-3xl border border-bone/10 bg-ink-800/50 overflow-hidden flex flex-col">
                  {/* Header strip */}
                  <div className={`h-1.5 bg-gradient-to-r ${stack.accent}`} />

                  {/* Product image collage — white background so photos render faithfully */}
                  <div className="relative aspect-[5/3] bg-white flex items-center justify-center overflow-hidden">
                    <div className="relative flex items-center justify-center gap-1">
                      {stack.items.map((it, i) => {
                        const p = productById(it.productId)
                        return (
                          <img
                            key={i}
                            src={p?.image}
                            alt={p?.name}
                            className="h-32 w-auto object-contain"
                            style={{ filter: 'drop-shadow(0 16px 18px rgba(0,0,0,0.3))' }}
                          />
                        )
                      })}
                    </div>
                    <div className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.22em] text-ink bg-amber rounded-full px-2.5 py-1 font-brand font-bold z-10">
                      {stack.badge}
                    </div>
                    <div className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.22em] text-bone bg-ink/80 backdrop-blur rounded-full px-2.5 py-1 font-brand font-semibold z-10">
                      {Math.round(stack.discount * 100)}% off
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="font-brand text-[10px] uppercase tracking-[0.28em] text-amber mb-2">{stack.theme}</div>
                    <h3 className="font-display text-3xl tracking-tight uppercase mb-2 leading-tight">{stack.name}</h3>
                    <p className="text-bone text-[15px] mb-3 leading-snug">{stack.promise}</p>
                    <p className="text-bone/55 text-[13px] mb-5 leading-relaxed flex-1">{stack.pitch}</p>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-stencil text-4xl text-gradient-primal leading-none">
                        ₹{price.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-bone/40 line-through text-sm">₹{price.mrp.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-amber text-[11px] uppercase tracking-widest font-brand font-semibold mb-5">
                      Save ₹{price.save.toLocaleString('en-IN')}
                    </div>

                    <button
                      onClick={() => addStack(stack)}
                      className="btn-primary w-full !py-3.5"
                    >
                      Add Stack to Cart
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Trust line */}
          <p className="mt-14 text-center text-[11px] uppercase tracking-widest text-bone/40 font-brand">
            Free pan-India shipping · Cash on delivery · Independent lab tested
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
