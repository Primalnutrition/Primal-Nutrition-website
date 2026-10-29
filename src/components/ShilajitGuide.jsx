import { useCart } from '../context/CartContext.jsx'
import { usePage } from '../context/RouterContext.jsx'
import Footer from './Footer.jsx'
import Picture from './Picture.jsx'
import { BENEFIT_ICONS } from '../lib/benefitIcons.jsx'

const MOB = '(max-width: 767px)'

/* Desktop + mobile crops, each as avif / webp / jpg */
function Art({ base, className = '', eager = false }) {
  return (
    <picture>
      <source media={MOB} type="image/avif" srcSet={`${base}-mob.avif`} />
      <source media={MOB} type="image/webp" srcSet={`${base}-mob.webp`} />
      <source media={MOB} srcSet={`${base}-mob.jpg`} />
      <source type="image/avif" srcSet={`${base}-dsk.avif`} />
      <source type="image/webp" srcSet={`${base}-dsk.webp`} />
      <img src={`${base}-dsk.jpg`} alt="" className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </picture>
  )
}

function IconTile({ name, size = 'w-12 h-12' }) {
  return (
    <span className={`${size} rounded-xl bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0`}>
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-amber" aria-hidden>
        {BENEFIT_ICONS[name]}
      </svg>
    </span>
  )
}

export default function ShilajitGuide() {
  const { navigate } = usePage()
  const { addToCart } = useCart()

  return (
    <>
      <section className="relative pt-28 pb-20 border-b border-bone/10 overflow-hidden min-h-[640px] lg:min-h-[680px] flex items-end">
        <Art base="/shilajit/hero-mountain" eager className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10 md:bg-gradient-to-r md:from-ink/85 md:via-ink/45 md:to-transparent" />

        <div className="container-x relative z-10">
          <nav className="mb-8 text-xs uppercase tracking-widest text-bone/45 flex items-center gap-2 font-brand">
            <button onClick={() => navigate('home')} className="hover:text-amber transition">Home</button>
            <span>/</span>
            <span className="text-bone/80">Shilajit Purity Guide</span>
          </nav>
          <div className="eyebrow mb-5 font-brand tracking-[0.28em]">
            <span className="inline-block w-2 h-2 rounded-full bg-amber mr-3 align-middle animate-shimmer" />
            Educational · Sourcing + Extraction
          </div>
          <h1 className="font-display text-5xl lg:text-8xl tracking-tight leading-[0.92] mb-6 uppercase">
            FROM THE HIGHEST<br/>
            PEAKS OF BHUTAN.<br/>
            <span className="text-shimmer">PURIFIED FOR 15 DAYS.</span>
          </h1>
          <p className="text-lg text-bone/70 max-w-2xl leading-relaxed">
            Our Shilajit is collected from Himalayan altitudes by local villagers, extracted using the ancient granthit process documented in Ayurvedic scriptures. Most manufacturers refuse this method because it takes longer and costs more. We refuse to do it any other way.
          </p>
        </div>
      </section>

      {/* Why Shilajit */}
      <section className="py-24">
        <div className="container-x max-w-4xl">
          <div className="eyebrow mb-5 font-brand tracking-[0.28em]">The Conqueror of Mountains</div>
          <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.98] mb-8 uppercase">
            "DESTROYER OF<br/>
            <span className="text-shimmer">WEAKNESS."</span>
          </h2>
          <div className="space-y-5 text-lg text-bone/75 leading-relaxed">
            <p>
              <em className="font-editorial text-amber-light not-italic">Shilajit</em> in Sanskrit means "conqueror of mountains and destroyer of weakness." The Charaka Samhita — written around 200 BC — states that there is no curable disease which cannot be effectively cured by Shilajit when administered at the appropriate times.
            </p>
            <p>
              The Tibetans call it the <em className="font-editorial text-amber-light not-italic">Juice of Rock</em>. The Burmese call it the <em className="font-editorial text-amber-light not-italic">Blood of the Mountains</em>. It develops over centuries from the slow decomposition of plants trapped between Himalayan rocks, seeping out during summer when the heat draws it through cracks.
            </p>
          </div>
        </div>
      </section>

      {/* Raw resin, collected by hand */}
      <section className="relative aspect-[735/919] md:aspect-[1919/820] max-h-[760px] w-full overflow-hidden">
        <Art base="/shilajit/hands" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
        <div className="container-x absolute inset-x-0 bottom-6 lg:bottom-10">
          <p className="font-brand text-[11px] lg:text-xs uppercase tracking-[0.28em] text-white/85">Raw Shilajit, hand-collected high in the Himalayas</p>
        </div>
      </section>

      {/* The Process — visual flow */}
      <section className="py-24 bg-gradient-to-b from-ink to-ink-800/50">
        <div className="container-x">
          <div className="max-w-3xl mb-14">
            <div className="eyebrow mb-5 font-brand tracking-[0.28em]">The Ancient Process</div>
            <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.98] mb-5 uppercase">
              FOUR STEPS.<br/>
              <span className="text-shimmer">FIFTEEN DAYS.</span>
            </h2>
            <p className="text-lg text-bone/65 leading-relaxed">
              The granthit purification process — documented in Ayurvedic scriptures, used by our ancestors, ignored by 95% of modern manufacturers because it is lengthy and costly.
            </p>
          </div>

          <div data-reveal-stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => (
              <article key={p.title} className="card-lift relative p-7 rounded-2xl border border-bone/10 bg-ink-800/60 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="font-stencil text-red-500 text-6xl leading-none">0{i + 1}</div>
                  <IconTile name={processIcons[i]} />
                </div>
                <div className="font-brand text-[10px] uppercase tracking-[0.28em] text-amber mb-2">{p.span}</div>
                <h3 className="font-display text-2xl tracking-tight uppercase mb-3 leading-tight">{p.title}</h3>
                <p className="text-bone/65 text-[14px] leading-relaxed">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why fulvic acid */}
      <section className="py-24">
        <div className="container-x grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="eyebrow mb-5 font-brand tracking-[0.28em]">The Active Compound</div>
            <h2 className="font-display text-4xl lg:text-5xl tracking-tight leading-[0.98] mb-6 uppercase">
              FULVIC ACID +<br/>
              <span className="text-shimmer">70 CHELATED VITAMINS.</span>
            </h2>
            <div className="space-y-4 text-bone/75 leading-relaxed">
              <p>Pure Shilajit contains <strong className="text-bone">fulvic acid</strong>, humic acid, trace minerals, vitamins A/B/C, phospholipids, polyphenols, and minerals — calcium, magnesium, copper, potassium, iron, manganese, chromium, selenium.</p>
              <p>Fulvic acid is the magic. It dilates cell walls and transports minerals <em className="font-editorial text-amber-light not-italic">deep into the cells</em>. It boosts energy, promotes cell life, enhances endurance, controls inflammation, regulates hormone production, and stimulates brain function.</p>
              <p>Many studies confirm: Shilajit is fully absorbed by the body <strong className="text-amber">only in its liquid form</strong>. This is why T-Rex is liquid. The harder path is the only path that works.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-amber/10 blur-3xl rounded-full" />
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-ink-700 via-ink-800 to-ink border border-bone/10 overflow-hidden flex items-center justify-center">
              <Picture src="/products/trex-liquid.png" alt="T-Rex Liquid" loading="lazy" decoding="async" className="w-3/4 h-3/4 object-contain" style={{ filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.6))' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Purity tests */}
      <section className="py-24 bg-gradient-to-b from-ink-800/50 to-ink">
        <div className="container-x">
          <div className="max-w-3xl mb-12">
            <div className="eyebrow mb-5 font-brand tracking-[0.28em]">How to spot fake Shilajit</div>
            <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.98] mb-5 uppercase">
              FOUR TESTS.<br/>
              <span className="text-shimmer">EVERY TIME.</span>
            </h2>
            <p className="text-lg text-bone/65 leading-relaxed">
              Counterfeit Shilajit is everywhere — coal, charcoal powder, fertilizers blended into resin. Here is how to tell real from fake.
            </p>
          </div>

          <div data-reveal-stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {tests.map((t) => (
              <article key={t.title} className="card-lift p-6 rounded-2xl border border-bone/10 bg-ink-800/60">
                <div className="flex items-center gap-3 mb-4">
                  <IconTile name={testIcons[t.test]} size="w-11 h-11" />
                  <div className="font-brand text-[10px] uppercase tracking-[0.28em] text-amber">{t.test}</div>
                </div>
                <h3 className="font-display text-xl tracking-tight uppercase mb-3 leading-tight">{t.title}</h3>
                <p className="text-bone/65 text-[13px] leading-relaxed mb-3">{t.real}</p>
                <p className="text-[12px] text-rust/80 italic">{t.fake}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container-x">
          <div className="relative max-w-4xl mx-auto p-10 lg:p-14 rounded-3xl border border-amber/30 bg-gradient-to-br from-amber/10 via-ink-800/40 to-rust/5 text-center overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-amber/20 blur-[100px]" />
            <div className="relative">
              <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.98] mb-5 uppercase">
                THE PUREST SHILAJIT<br/>
                <span className="text-shimmer">IN INDIA.</span>
              </h2>
              <p className="text-bone/70 text-lg mb-8 max-w-xl mx-auto">
                Stacked with six clinically-studied Ayurvedic herbs in a 7-in-1 liquid. The way our ancestors made it. Validated by modern lab testing.
              </p>
              <button onClick={() => { addToCart('trex-liquid', 'trex-1', 1, true) }} className="btn-primary text-base">
                Buy T-Rex — ₹1,999
              </button>
              <div className="mt-5 flex items-center justify-center gap-4 text-[11px] uppercase tracking-widest text-bone/40 font-brand">
                <span>Free pan-India shipping</span>
                <span>·</span>
                <span>COD available</span>
                <span>·</span>
                <span>Third-party tested</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

const processIcons = ['peak', 'filter', 'pot', 'flask']
const testIcons = { Pliability: 'hand', Solubility: 'glass', Flame: 'flame', Form: 'drop' }

const process = [
  { span: 'Day 1-3', title: 'Collection', body: 'Local villagers hand-collect resin from cracks in Himalayan/Bhutanese rocks at 18,000+ ft altitude. Summer-only harvest.' },
  { span: 'Day 4-9', title: 'Granthit Purification', body: 'The traditional 15-day water-based dissolution + filtration cycle. Heavy minerals + impurities settle out. Repeated until clear.' },
  { span: 'Day 10-12', title: 'Reduction', body: 'The purified solution is slow-evaporated over low heat — no chemical extraction, no synthetic acidifiers. Concentration only.' },
  { span: 'Day 13-15', title: 'Liquid Standardization', body: 'Tested for fulvic acid %, heavy metals, microbial load. Standardized to clinical dose. Sealed in amber glass.' },
]

const tests = [
  { test: 'Pliability', title: 'Melts in your hand', real: 'Pure Shilajit becomes sticky in warm hands. Place in fridge, shatters like glass when struck.', fake: 'Hard, brittle resin that does not respond to warmth = poorly processed or fake.' },
  { test: 'Solubility', title: 'Dissolves clean', real: 'Dissolves completely in warm water/milk in ~5 minutes. Turns golden-reddish.', fake: 'Gritty texture or residue at bottom = non-soluble fillers added.' },
  { test: 'Flame', title: 'Will not burn', real: 'Heat with mini blow torch — bubbles, no smoke, no ash, no flame.', fake: 'Catches fire or produces smoke = contains charcoal/coal powder.' },
  { test: 'Form', title: 'Liquid only', real: 'Studies confirm full absorption only in liquid form. Liquid extraction is the only honest format.', fake: 'Powder forms typically 2-30% Shilajit + fillers. Avoid.' },
]
