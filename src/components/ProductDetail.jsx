import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { usePage } from '../context/RouterContext.jsx'
import { productById, products, tiers } from '../data/products.js'
import ProductVisual from './ProductVisual.jsx'
import ProductGallery from './ProductGallery.jsx'
import Footer from './Footer.jsx'
import StickyProductCTA from './StickyProductCTA.jsx'

export default function ProductDetail({ productId }) {
  const product = productById(productId)
  const { addToCart } = useCart()
  const { navigate } = usePage()
  const [variantId, setVariantId] = useState(product?.variants[0]?.id)
  const [adding, setAdding] = useState(false)

  // Scroll to top when product changes
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' })
    if (product) setVariantId(product.variants[0].id)
  }, [productId])

  if (!product) {
    return (
      <section className="pt-40 pb-32 container-x text-center">
        <div className="eyebrow mb-3">404</div>
        <h1 className="font-display text-4xl font-bold mb-4">Product not found</h1>
        <button onClick={() => navigate('shop')} className="btn-primary">Back to shop</button>
      </section>
    )
  }

  const pdp = product.pdp
  const variant = product.variants.find((v) => v.id === variantId)
  const stackProducts = (pdp?.stackWith || [])
    .map((id) => productById(id))
    .filter(Boolean)

  const handleAdd = () => {
    setAdding(true)
    addToCart(product.id, variantId, 1, false)
    setTimeout(() => setAdding(false), 900)
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 lg:pb-24 overflow-hidden gradient-amber grain">
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-amber/10 blur-[140px] pointer-events-none" />

        <div className="container-x relative">
          {/* Breadcrumb */}
          <nav className="mb-10 text-xs uppercase tracking-widest text-bone/45 flex items-center gap-2">
            <button onClick={() => navigate('home')} className="hover:text-amber transition">Home</button>
            <span>/</span>
            <button onClick={() => navigate('shop')} className="hover:text-amber transition">Shop</button>
            <span>/</span>
            <span className="text-bone/80">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Visual */}
            <div className="lg:col-span-6 lg:sticky lg:top-28">
              <div className="max-w-md mx-auto">
                <ProductGallery product={product} />
              </div>
              {pdp?.metrics && (
                <div className="grid grid-cols-2 gap-3 mt-6 max-w-md mx-auto">
                  {pdp.metrics.map((m) => (
                    <div key={m.label} className="p-4 rounded-xl border border-bone/10 bg-ink-800/40">
                      <div className="font-display font-bold text-amber text-xl leading-none">{m.value}</div>
                      <div className="text-[10px] uppercase tracking-widest text-bone/45 mt-1.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="lg:col-span-6">
              {product.tier && (
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-5 px-3 py-1 rounded-full bg-amber/15 text-amber border border-amber/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                  {tiers[product.tier]?.label || product.tier} · {tiers[product.tier]?.role}
                </div>
              )}

              <h1 className="font-display font-black text-5xl lg:text-6xl leading-[0.95] tracking-tightest mb-3">
                {product.name}
              </h1>
              <p className="font-display italic text-2xl text-amber-light mb-6">{product.subtitle}</p>

              <p className="text-lg text-bone/75 leading-relaxed mb-8">{pdp?.heroClaim || product.description}</p>

              {/* Variant selector */}
              {product.variants.length > 1 ? (
                <div className="space-y-2 mb-6">
                  <div className="eyebrow text-[10px]">Choose size</div>
                  {product.variants.map((v) => {
                    const active = v.id === variantId
                    return (
                      <button
                        key={v.id}
                        onClick={() => setVariantId(v.id)}
                        className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl border text-sm transition ${
                          active
                            ? 'border-amber bg-amber/10'
                            : 'border-bone/10 hover:border-bone/30'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-bone">{v.label}</div>
                          <div className="text-[11px] uppercase tracking-widest text-bone/45">{v.sub}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-bone">₹{v.price.toLocaleString('en-IN')}</div>
                          {v.compareAt && (
                            <div className="text-[10px] text-bone/40 line-through">₹{v.compareAt.toLocaleString('en-IN')}</div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="mb-6">
                  <div className="text-[10px] uppercase tracking-widest text-bone/45 mb-1">{variant.label} · {variant.sub}</div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display font-bold text-4xl text-bone">₹{variant.price.toLocaleString('en-IN')}</span>
                    {variant.compareAt && (
                      <span className="text-bone/40 line-through text-lg">₹{variant.compareAt.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleAdd}
                disabled={adding}
                className={`w-full py-4 rounded-full font-semibold transition-all duration-300 text-base ${
                  adding ? 'bg-forest text-bone' : 'btn-primary'
                }`}
              >
                {adding ? '✓ Added to cart' : `Add to Cart — ₹${variant.price.toLocaleString('en-IN')}`}
              </button>

              <div className="grid grid-cols-3 gap-2 mt-6 text-[10px] uppercase tracking-widest text-bone/50 text-center font-brand">
                <div className="p-3 border border-bone/10 rounded-xl">
                  <div className="text-amber font-bold mb-1">Free</div>
                  Pan-India shipping
                </div>
                <div className="p-3 border border-bone/10 rounded-xl">
                  <div className="text-amber font-bold mb-1">COD</div>
                  Available nationwide
                </div>
                <div className="p-3 border border-bone/10 rounded-xl">
                  <div className="text-amber font-bold mb-1">3rd Party</div>
                  Lab tested
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ───────────────────────────────────────── */}
      {pdp?.problem && (
        <section className="py-24 bg-gradient-to-b from-ink to-ink-800/30">
          <div className="container-x max-w-4xl">
            <div className="eyebrow mb-5">The Problem</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] mb-8">
              {pdp.problem.title}
            </h2>
            <p className="text-xl text-bone/70 leading-relaxed">{pdp.problem.body}</p>
          </div>
        </section>
      )}

      {/* ── Mechanism ─────────────────────────────────────── */}
      {pdp?.mechanism && (
        <section className="py-24">
          <div className="container-x">
            <div className="max-w-2xl mb-12">
              <div className="eyebrow mb-5">The Mechanism</div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05]">
                {pdp.mechanism.title}
              </h2>
            </div>
            <div data-reveal-stagger className="grid md:grid-cols-3 gap-5">
              {pdp.mechanism.steps.map((s, i) => (
                <div key={s.h} className="card-lift p-7 rounded-2xl border border-bone/10 bg-ink-800/40">
                  <div className="font-display font-black text-amber/40 text-2xl mb-3">0{i + 1}</div>
                  <h3 className="font-display font-semibold text-xl mb-3">{s.h}</h3>
                  <p className="text-bone/65 leading-relaxed text-[15px]">{s.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Evidence ──────────────────────────────────────── */}
      {pdp?.evidence?.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-ink-800/30 to-ink">
          <div className="container-x">
            <div className="max-w-2xl mb-12">
              <div className="eyebrow mb-5">The Evidence</div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05]">
                We don't make claims.<br/>
                <span className="italic font-medium text-amber-light">We cite studies.</span>
              </h2>
            </div>
            <div className="space-y-4 max-w-4xl">
              {pdp.evidence.map((e, i) => (
                <article key={i} className="card-lift p-6 rounded-2xl border border-bone/10 bg-ink-800/40 grid md:grid-cols-12 gap-4 items-start">
                  <div className="md:col-span-5">
                    <div className="text-[11px] uppercase tracking-widest text-amber mb-1">Study {i + 1}</div>
                    <div className="font-display font-semibold text-bone leading-tight">{e.study}</div>
                  </div>
                  <div className="md:col-span-6 text-bone/70 text-[15px] leading-relaxed">{e.finding}</div>
                  <div className="md:col-span-1 text-[10px] uppercase tracking-widest text-bone/40 md:text-right break-all">
                    {e.source}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Protocol + Who-for/Not-for ─────────────────────── */}
      <section className="py-24">
        <div className="container-x grid lg:grid-cols-2 gap-12">
          {pdp?.protocol && (
            <div>
              <div className="eyebrow mb-5">The Protocol</div>
              <h3 className="font-display text-3xl font-bold mb-8 tracking-tightest leading-tight">
                When, how, with what.
              </h3>
              <dl className="space-y-5">
                <Row label="When" value={pdp.protocol.when} />
                <Row label="How" value={pdp.protocol.how} />
                <Row label="With" value={pdp.protocol.withWhat} />
                <Row label="Cycle" value={pdp.protocol.cycle} />
              </dl>
            </div>
          )}

          {(pdp?.whoFor || pdp?.whoNotFor) && (
            <div className="grid gap-6">
              {pdp?.whoFor && (
                <div className="p-6 rounded-2xl border border-amber/20 bg-amber/5">
                  <div className="eyebrow mb-3 text-amber">Built for</div>
                  <ul className="space-y-2">
                    {pdp.whoFor.map((w) => (
                      <li key={w} className="flex items-start gap-2 text-bone/85 text-[15px]">
                        <span className="text-amber mt-0.5">✓</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pdp?.whoNotFor && (
                <div className="p-6 rounded-2xl border border-rust/30 bg-rust/5">
                  <div className="eyebrow mb-3 text-rust">Not for</div>
                  <ul className="space-y-2">
                    {pdp.whoNotFor.map((w) => (
                      <li key={w} className="flex items-start gap-2 text-bone/85 text-[15px]">
                        <span className="text-rust mt-0.5">✕</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Timeline (for T-Rex Liquid) ─────────────────────── */}
      {pdp?.timeline && (
        <section className="py-24 bg-gradient-to-b from-ink to-ink-800/30">
          <div className="container-x">
            <div className="max-w-2xl mb-12">
              <div className="eyebrow mb-5">The 90-Day Curve</div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05]">
                What changes when.
              </h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {pdp.timeline.map((t) => (
                <div key={t.week} className="p-6 rounded-2xl border border-bone/10 bg-ink-800/40 card-lift">
                  <div className="eyebrow text-amber mb-3">{t.week}</div>
                  <p className="text-bone/70 text-[14px] leading-relaxed">{t.what}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Stack with ───────────────────────────────────── */}
      {stackProducts.length > 0 && (
        <section className="py-24">
          <div className="container-x">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div className="max-w-xl">
                <div className="eyebrow mb-5">Stack with</div>
                <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05]">
                  Designed to layer.
                </h2>
                <p className="mt-4 text-bone/65">Recommended companions for the {product.name} protocol.</p>
              </div>
              <button onClick={() => navigate('shop')} className="btn-ghost text-sm">View full catalog →</button>
            </div>

            <div data-reveal-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stackProducts.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => navigate('product', { id: sp.id })}
                  className="card-lift group text-left flex flex-col p-3 rounded-3xl border border-bone/10 bg-ink-800/40 hover:border-amber/30 transition"
                >
                  <ProductVisual product={sp} />
                  <div className="p-3 pt-5">
                    <div className="font-display font-bold text-xl mb-1">{sp.name}</div>
                    <div className="text-[11px] uppercase tracking-widest text-bone/45 mb-3">{sp.tagline}</div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-display font-bold text-bone">From ₹{sp.variants[0].price.toLocaleString('en-IN')}</span>
                      <span className="text-amber text-sm group-hover:translate-x-1 transition">View →</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews ──────────────────────────────────────── */}
      {pdp?.reviews?.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-ink-800/30 to-ink">
          <div className="container-x">
            <div className="max-w-2xl mb-10">
              <div className="eyebrow mb-5">Verified buyers</div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05]">
                Real men. Real results.
              </h2>
            </div>
            <div data-reveal-stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pdp.reviews.map((r) => (
                <article key={r.name} className="card-lift p-6 rounded-2xl border border-bone/10 bg-ink-800/40 flex flex-col">
                  <div className="flex items-center gap-1 text-amber mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => <span key={i}>★</span>)}
                    {Array.from({ length: 5 - r.rating }).map((_, i) => <span key={i} className="text-bone/15">★</span>)}
                  </div>
                  <h3 className="font-display font-semibold text-lg leading-snug mb-3">"{r.title}"</h3>
                  <p className="text-bone/65 text-[14px] leading-relaxed flex-1 mb-5">{r.body}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-bone/5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber/40 to-rust/30 flex items-center justify-center font-display font-bold text-bone text-sm">
                      {r.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-[11px] text-bone/40">{r.city} · {r.age}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-forest/80">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      Verified
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-bone/30 mt-2">{r.time}</div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────── */}
      {pdp?.faq?.length > 0 && (
        <section className="py-24">
          <div className="container-x grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="eyebrow mb-5">Questions</div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05]">
                Asked & answered.
              </h2>
            </div>
            <div className="lg:col-span-8 border-t border-bone/10">
              {pdp.faq.map((f) => (
                <details key={f.q} className="group border-b border-bone/10">
                  <summary className="cursor-pointer flex items-center justify-between py-5 list-none">
                    <span className="font-display text-lg lg:text-xl pr-6 text-bone group-hover:text-amber transition">{f.q}</span>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full border border-bone/20 flex items-center justify-center text-bone/60 group-open:bg-amber group-open:text-ink group-open:border-amber group-open:rotate-45 transition">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                    </span>
                  </summary>
                  <p className="pb-6 text-bone/70 leading-relaxed text-[15px] max-w-2xl">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="py-24">
        <div className="container-x">
          <div className="relative max-w-4xl mx-auto p-10 lg:p-14 rounded-3xl border border-amber/30 bg-gradient-to-br from-amber/10 via-ink-800/40 to-rust/5 text-center overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-amber/20 blur-[100px]" />
            <div className="relative">
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] mb-5">
                Start the {product.name} protocol.
              </h2>
              <p className="text-bone/70 text-lg mb-8 max-w-xl mx-auto">
                {pdp?.protocol?.cycle || 'Cycle this with discipline. We refund if the bottle does not deliver.'}
              </p>
              <button onClick={handleAdd} className="btn-primary text-base">
                {adding ? '✓ Added' : `Add ${product.name} — ₹${variant.price.toLocaleString('en-IN')}`}
              </button>
              <div className="mt-5 flex items-center justify-center gap-4 text-[11px] uppercase tracking-widest text-bone/40 font-brand">
                <span>Free shipping</span>
                <span>·</span>
                <span>Cash on delivery</span>
                <span>·</span>
                <span>3rd Party tested</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <StickyProductCTA product={product} variant={variant} />
    </>
  )
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-bone/10">
      <dt className="text-[11px] uppercase tracking-widest text-bone/45 self-center">{label}</dt>
      <dd className="col-span-2 text-bone/85 text-[15px]">{value}</dd>
    </div>
  )
}
