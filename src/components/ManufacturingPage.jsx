import { usePage } from '../context/RouterContext.jsx'
import Footer from './Footer.jsx'
import Picture from './Picture.jsx'
import HomeStory from './HomeStory.jsx'
import { BENEFIT_ICONS } from '../lib/benefitIcons.jsx'

/* Where and how the range is made. The two colour photos are the real
   facility; the black-and-white pair illustrates the process (neutral
   captions, no "our warehouse" claim). */
const ORIGINS = [
  { icon: 'peak', name: 'Himalayan Shilajit', from: 'High Himalayan rock faces', line: 'Hand-collected resin, purified the traditional way.' },
  { icon: 'leaf', name: 'Tongkat Ali', from: 'Malaysian rainforest', line: 'Mature roots, concentrated 100:1.' },
  { icon: 'scale', name: 'Black Maca', from: 'Junín, Peru · 4,100 m', line: 'The rarest maca, grown in the high Andes.' },
  { icon: 'brain', name: 'Korean Panax Ginseng', from: 'Korean mountains', line: 'Slow-grown roots, aged about six years.' },
  { icon: 'bolt', name: 'Cordyceps sinensis', from: 'High Himalayan plateau', line: 'The rare fungus known as keedajadi, concentrated 10:1.' },
  { icon: 'drop', name: 'Ayurvedic herbs', from: 'Across India', line: 'Ashwagandha, Giloy, Kalmegh, Safed Musli and more.' },
]

const TESTS = [
  { icon: 'shield', title: 'Heavy metals', body: 'Checked for lead, arsenic, mercury and cadmium.' },
  { icon: 'flask', title: 'Microbial safety', body: 'Checked for yeast, mould and harmful bacteria.' },
  { icon: 'scale', title: 'Label-claim check', body: 'What is on the label is what is in the bottle.' },
]

function IconTile({ name }) {
  return (
    <span className="w-12 h-12 rounded-xl bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-amber" aria-hidden>
        {BENEFIT_ICONS[name]}
      </svg>
    </span>
  )
}

export default function ManufacturingPage() {
  const { navigate } = usePage()
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden min-h-[620px] lg:min-h-[680px] flex items-end">
        <Picture src="/manufacturing/tanks.jpg" alt="Stainless-steel production tanks" loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20 md:bg-gradient-to-r md:from-ink/90 md:via-ink/55 md:to-ink/10" />
        <div className="container-x relative z-10">
          <nav className="mb-8 text-xs uppercase tracking-widest text-bone/55 flex items-center gap-2 font-brand">
            <button onClick={() => navigate('home')} className="hover:text-amber transition">Home</button>
            <span>/</span>
            <span className="text-bone/85">Our manufacturing</span>
          </nav>
          <div className="eyebrow mb-5">Our manufacturing</div>
          <h1 className="font-display text-5xl lg:text-7xl font-bold tracking-tight leading-[0.98] mb-6 max-w-3xl">
            Ancient recipes.<br /><span className="text-shimmer">Clean, modern manufacturing.</span>
          </h1>
          <p className="text-lg text-bone/80 max-w-xl leading-relaxed">
            Made by Raaj Ayurvedic Pharmacy in Siliguri, West Bengal, a licensed Ayurvedic manufacturer (Mfg. Lic. AL946M).
          </p>
        </div>
      </section>

      {/* Inside the facility */}
      <HomeStory
        img="/manufacturing/floor.jpg"
        side="right"
        eyebrow="Inside our facility"
        title={['Clean rooms.', 'Careful hands.']}
        body="Stainless-steel vessels, clean production floors and trained staff in full hygiene gear. Every product is made under a licensed Ayurvedic manufacturing process."
        cta={{ label: 'See our licences', onClick: () => navigate('product-info', { id: 'trex-liquid' }) }}
      />

      {/* Sourced at origin */}
      <section id="sourcing" className="py-16 lg:py-24 bg-ink-800/30 scroll-mt-20">
        <div className="container-x">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-5">Ingredient sourcing</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
              Sourced at origin.<br /><span className="text-shimmer">From where each herb grows best.</span>
            </h2>
            <p className="text-lg text-bone/70 leading-relaxed">
              Rare herbs are at their most potent in the places they grow wild. That is where we source them from.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {ORIGINS.map((o) => (
              <div key={o.name} className="p-6 rounded-2xl border border-amber/20 bg-gradient-to-br from-amber/[0.06] via-ink-800/60 to-ink">
                <div className="flex items-center gap-4 mb-4">
                  <IconTile name={o.icon} />
                  <div>
                    <h3 className="font-display text-xl leading-tight">{o.name}</h3>
                    <div className="text-[11px] uppercase tracking-widest text-amber font-brand mt-1">{o.from}</div>
                  </div>
                </div>
                <p className="text-bone/65 text-[15px] leading-relaxed">{o.line}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('shilajit-guide')} className="btn-ghost text-sm mt-10">
            Read the Shilajit purity guide →
          </button>
        </div>
      </section>

      {/* Checked at every step */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-5">Quality checks</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
              Checked at<br /><span className="text-shimmer">every step.</span>
            </h2>
            <p className="text-lg text-bone/70 leading-relaxed">
              Every lot of raw herbs is checked before it goes into production, then stored clean and dry until it is used.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              ['/manufacturing/warehouse-qc.jpg', 'Raw herbs are checked on arrival'],
              ['/manufacturing/warehouse-stock.jpg', 'Stored clean, dry and sealed'],
            ].map(([src, cap]) => (
              <figure key={src} className="rounded-3xl overflow-hidden relative aspect-[4/5] max-h-[640px]">
                <Picture src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-ink/85 to-transparent font-brand text-[11px] uppercase tracking-[0.24em] text-white/85">
                  {cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Tested before it ships */}
      <section className="py-16 lg:py-24 bg-ink-800/30">
        <div className="container-x">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-5">Lab tested</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              Tested before<br /><span className="text-shimmer">it ships.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
            {TESTS.map((t) => (
              <div key={t.title} className="p-6 rounded-2xl border border-bone/10 bg-ink-800/60">
                <IconTile name={t.icon} />
                <h3 className="font-display text-xl mt-4 mb-2">{t.title}</h3>
                <p className="text-bone/65 text-[15px] leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[12px] uppercase tracking-widest text-bone/45 font-brand">
            Mfg. Lic. AL946M · FSSAI 13326998000382 · An Ayurvedic Proprietary Medicine
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container-x">
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-6">See what we make.</h2>
          <button onClick={() => navigate('shop')} className="btn-primary">Shop the range</button>
        </div>
      </section>

      <Footer />
    </>
  )
}
