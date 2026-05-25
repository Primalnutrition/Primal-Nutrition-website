import { useCart } from '../context/CartContext.jsx'

/* Bundle tiers — restructured per client brief to 1/2/3 bottle (30/60/90 day)
   matching the actual T-Rex 500ml variant pricing. ₹499 trial shot is gone. */
const bundles = [
  {
    title: '1 Bottle',
    sub: 'Begin the protocol',
    qty: '500ml · 30 days',
    price: 1999,
    strike: 2200,
    pdsBadge: null,
    cta: 'Add to cart',
    productId: 'trex-liquid',
    variantId: 'trex-1',
  },
  {
    title: '2 Bottle Stack',
    sub: 'Recommended cycle',
    qty: '500ml × 2 · 60 days',
    price: 3999,
    strike: 4400,
    pdsBadge: 'Most popular',
    cta: 'Add to cart',
    productId: 'trex-liquid',
    variantId: 'trex-2',
  },
  {
    title: '3 Bottle · Full Cycle',
    sub: 'Total transformation',
    qty: '500ml × 3 · 90 days',
    price: 5999,
    strike: 6600,
    pdsBadge: 'Best value',
    cta: 'Add to cart',
    featured: true,
    productId: 'trex-liquid',
    variantId: 'trex-3',
  },
]

export default function Bundle() {
  const { addToCart } = useCart()
  return (
    <section id="bundle" className="py-28 relative">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow mb-5 font-brand tracking-[0.28em]">Pick Your Pace</div>
          <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[1.02] mb-5 uppercase">
            ONE BOTTLE. TWO. THREE.<br/>
            <span className="text-shimmer">SAME PROTOCOL.</span>
          </h2>
          <p className="text-lg text-bone/65">
            T-Rex works on a 30/60/90-day cycle. Pick the duration that matches your commitment.
          </p>
        </div>

        <div data-reveal-stagger className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {bundles.map((b) => (
            <article
              key={b.title}
              className={`card-lift relative p-7 rounded-2xl border ${
                b.featured ? 'border-amber bg-amber/5 glow-ring' : 'border-bone/10 bg-ink-800/40'
              } flex flex-col`}
            >
              {b.pdsBadge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                  b.featured ? 'bg-amber text-bone' : 'bg-ink border border-amber/30 text-amber'
                }`}>{b.pdsBadge}</div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-3xl tracking-tight uppercase mb-1">{b.title}</h3>
                <p className="text-bone/55 text-sm font-sans">{b.sub}</p>
                <p className="text-[11px] uppercase tracking-widest text-bone/40 mt-2 font-brand">{b.qty}</p>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-stencil text-5xl text-bone leading-none">₹{b.price.toLocaleString('en-IN')}</span>
                {b.strike && <span className="text-bone/40 line-through text-base">₹{b.strike.toLocaleString('en-IN')}</span>}
              </div>
              {b.strike && (
                <div className="text-amber text-xs font-semibold mb-5 uppercase tracking-widest font-brand">
                  Save ₹{(b.strike - b.price).toLocaleString('en-IN')} ({Math.round(((b.strike - b.price) / b.strike) * 100)}%)
                </div>
              )}

              <ul className="space-y-2 text-sm text-bone/70 mb-7 flex-1">
                <Bullet>Free pan-India shipping</Bullet>
                <Bullet>Cash on delivery available</Bullet>
                <Bullet>Third-party tested</Bullet>
                {b.featured && <Bullet>WhatsApp protocol coach included</Bullet>}
              </ul>

              <button
                onClick={() => addToCart(b.productId, b.variantId, 1, true)}
                className={`w-full py-3.5 rounded-full font-semibold transition ${
                b.featured ? 'btn-primary !py-3.5 !px-0' : 'border border-bone/20 text-bone hover:border-amber hover:text-amber'
              }`}>
                {b.cta}
              </button>
            </article>
          ))}
        </div>

        <div className="mt-12 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-bone/50 font-brand">
            <svg className="w-4 h-4 text-forest" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            Free shipping pan-India · Cash on delivery
          </div>
        </div>
      </div>
    </section>
  )
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-amber mt-0.5">✓</span>
      <span>{children}</span>
    </li>
  )
}
