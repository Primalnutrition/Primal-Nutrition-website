import { useCart } from '../context/CartContext.jsx'

export default function ProductDeepDive() {
  const { addToCart } = useCart()
  return (
    <section id="science" className="py-28 relative bg-gradient-to-b from-ink to-ink-800/60">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Visual — real T-Rex bottle floating with chip overlays */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative aspect-[4/5]">
              {/* Floating T-Rex bottle — raw image, no bg, no gradient, no filter, no crop */}
              <div className="absolute inset-0 flex items-center justify-center animate-float">
                <img
                  src="/products/trex-liquid-02.png"
                  alt="T-Rex 500ml bottle"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Floating callouts — animation-delayed so they don't sync with bottle */}
              <FloatChip className="top-8 left-8" label="50 Servings" sub="Per bottle" />
              <FloatChip className="top-8 right-8" label="500ml" sub="Liquid form" />
              <FloatChip className="bottom-8 left-8" label="Shilajit" sub="Purified resin" />
              <FloatChip className="bottom-8 right-8" label="7 Herbs" sub="Clinical doses" />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="eyebrow mb-5">The Hero · T-REX</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tightest mb-6">
              One bottle.<br/>
              50 mornings.<br/>
              <span className="italic font-medium text-amber-light">Zero compromises.</span>
            </h2>

            <p className="text-lg text-bone/70 mb-8 leading-relaxed">
              T-Rex is liquid sublingual Ayurveda — absorbed 3× faster than capsules. One 10ml shot in the morning. Eight standardized herbs working in synergy on testosterone, strength, recovery, and mental clarity.
            </p>

            {/* Feature grid */}
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mb-10">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-bone/85">
                  <svg className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-[15px]">{f}</span>
                </li>
              ))}
            </ul>

            {/* Price + CTA */}
            <div className="p-6 rounded-2xl border border-amber/20 bg-ink-800/60 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display font-bold text-4xl text-bone">₹1,999</span>
                  <span className="text-bone/40 line-through text-lg">₹2,200</span>
                  <span className="text-xs uppercase tracking-widest text-amber font-medium px-2 py-1 rounded-full bg-amber/10">Save 10%</span>
                </div>
                <div className="text-sm text-bone/50 mt-1">₹40 per serving · Free shipping</div>
              </div>
              <button onClick={() => addToCart('trex-liquid', 'trex-1', 1, true)} className="btn-primary">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const features = [
  'Liquid sublingual — 3× faster absorption than pills',
  'Standardized to active compound %',
  'No artificial sweeteners or flavors',
  'Shilajit sourced from Himalayan altitudes >18,000ft',
  'Clinical doses — not "fairy dust" sprinkles',
  'Third-party tested · every batch',
]

function FloatChip({ className, label, sub }) {
  return (
    <div className={`absolute ${className} bg-ink/80 backdrop-blur-md border border-amber/20 rounded-xl px-4 py-2.5`}>
      <div className="font-display font-bold text-amber text-base leading-none">{label}</div>
      <div className="text-[10px] uppercase tracking-wider text-bone/50 mt-1">{sub}</div>
    </div>
  )
}
