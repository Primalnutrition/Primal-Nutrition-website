import Picture from './Picture.jsx'

/* Per-product "What's inside" showcase for the PDP.
 *
 * Design (validated against AG1 / Ritual / Transparent Labs + the Indian
 * Ayurvedic players Kapiva / Man Matters):
 *   - transparency headline ("every dose disclosed — no proprietary blends")
 *   - editorial cards, glanceable, that EXPAND on tap for the researcher
 *     (native <details> → accessible + works without JS)
 *   - a styled, always-visible Supplement Facts panel (a selling point, not
 *     a compliance afterthought)
 *   - credibility chips + an "us vs typical proprietary blend" strip
 *
 * Data-driven: add a product id below and the section renders for it. T-Rex
 * Liquid is populated from the real T-REX label composition (per 5 ml).
 */
const INGREDIENTS = {
  'trex-liquid': {
    eyebrow: '7 actives · every dose disclosed',
    title: (<>What's inside.<br /><span className="text-shimmer">Down to the milligram.</span></>),
    intro:
      'No proprietary blends. No fairy-dusting. Seven Ayurvedic actives, each named in Sanskrit, botanical and English — at the exact mg printed on the bottle.',
    servingLabel: 'Per 5 ml',
    doseNote: 'Label dose: 15 ml twice daily with milk or beverage.',
    otherIngredients: 'Hazelnut-flavoured natural liquid base.',
    items: [
      { name: 'Himalayan Shilajit', sanskrit: 'शिलाजीत', botanical: 'Asphaltum', dose: '50 mg', source: 'Bhutan / Himalayan rock', role: 'The fulvic-acid engine', detail: 'The fulvic-acid-rich resin that powers the whole formula. Liquid-extracted by the ancestral 15-day granthit process — the only form the body fully absorbs.', image: '/products/ingredients/shilajit.jpg' },
      { name: 'Ashwagandha', sanskrit: 'अश्वगंधा', botanical: 'Withania somnifera', dose: '100 mg', source: 'Root extract', role: 'Cortisol & calm energy', detail: 'Balances cortisol and the adrenals so daily energy holds without caffeine — anxiety-relieving, without the side effects of stimulants.', image: '/products/ingredients/ashwagandha.jpg' },
      { name: 'Arjun Chal', sanskrit: 'अर्जुन छाल', botanical: 'Terminalia arjuna', dose: '100 mg', source: 'Tree-bark extract', role: 'Heart & VO₂ max', detail: 'Cardio-protective — supports healthy cholesterol and blood pressure. A study showed VO₂ max +4.9% in two weeks. Pairs with Ashwagandha for effect.', image: '/products/ingredients/arjun.jpg' },
      { name: 'Gokhru', sanskrit: 'गोखरू', botanical: 'Tribulus terrestris', dose: '50 mg', source: 'Fruit extract', role: 'Libido & vitality', detail: 'Used for millennia across Indian and Chinese medicine. Steroidal glycosides support sexual well-being, function and natural vitality.', image: '/products/ingredients/gokhru.jpg' },
      { name: 'Draksha', sanskrit: 'द्राक्षा', botanical: 'Vitis vinifera', dose: '100 mg', source: 'Dried grape extract', role: 'Recovery adaptogen', detail: 'The ancient endurance fuel — speeds muscle recovery, guards against muscle loss, scavenges free radicals, and protects the heart.', image: '/products/ingredients/draksha.jpg' },
      { name: 'Safed Musli', sanskrit: 'सफेद मूसली', botanical: 'Chlorophytum arundinaceum', dose: '100 mg', source: 'Rare Indian root', role: 'Testosterone & stamina', detail: 'The natural alternative to commercial drugs. Supports testosterone production, sperm count and desire — effective even where diabetes-driven dysfunction is present.', image: '/products/ingredients/safed-musli.jpg' },
      { name: 'Kath Badam', sanskrit: 'कथ बादाम', botanical: 'Prunus dulcis', dose: '50 mg', source: 'Whole almond extract', role: 'Aphrodisiac · building block', detail: 'Vatada in Ayurveda. Raises good cholesterol — the raw material testosterone is built from — stabilises blood sugar, and sharpens memory.', image: '/products/ingredients/kath-badam.jpg' },
    ],
    credit: 'Ingredient photos: Pexels & Wikimedia Commons (Tribulus terrestris fruit © Hüseyin Cahid Doğan, Safed Musli/Shilajit/Ashwagandha contributors, CC BY-SA); Arjun bark — public domain.',
    claims: ['100% Ayurvedic', 'No Proprietary Blends', 'No Stimulants', 'No Chemicals', 'Non-GMO', '3rd-Party Lab Tested'],
  },
}

export default function IngredientShowcase({ product }) {
  const data = INGREDIENTS[product.id]
  if (!data) return null

  return (
    <section className="py-24 bg-gradient-to-b from-ink to-ink-800/30">
      <div className="container-x">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="eyebrow mb-5 text-amber">
            <span className="inline-block w-2 h-2 rounded-full bg-gradient-primal mr-3 align-middle animate-shimmer" />
            {data.eyebrow}
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] mb-5">
            {data.title}
          </h2>
          <p className="text-lg text-bone/70 leading-relaxed">{data.intro}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Ingredient cards — expand on tap */}
          <div data-reveal-stagger className="lg:col-span-8 grid sm:grid-cols-2 gap-4 self-start">
            {data.items.map((h) => (
              <details
                key={h.name}
                className="group card-lift rounded-2xl border border-bone/10 bg-ink-800/40 hover:border-amber/30 transition overflow-hidden"
              >
                <summary className="cursor-pointer list-none p-5 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber via-amber/40 to-transparent" />
                  {/* Ingredient photo */}
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full overflow-hidden border border-amber/25 ring-1 ring-ink/40 shadow-lg">
                    <Picture src={h.image} alt={h.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </div>

                  <div className="font-display text-xl uppercase tracking-tight text-bone pr-20 leading-tight">{h.name}</div>
                  <div className="font-stencil text-gradient-primal text-2xl leading-none mt-1 mb-1.5">{h.dose}</div>
                  <div className="text-[10px] uppercase tracking-widest text-bone/40 italic font-brand mb-2">
                    {h.sanskrit} · {h.botanical}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-amber/85 text-sm font-medium">{h.role}</span>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border border-bone/20 flex items-center justify-center text-bone/60 text-sm group-open:bg-amber group-open:text-ink group-open:border-amber group-open:rotate-45 transition">
                      +
                    </span>
                  </div>
                </summary>

                {/* Expanded detail */}
                <div className="px-5 pb-5 -mt-1">
                  <div className="pt-3 border-t border-bone/5 text-[10px] uppercase tracking-widest text-bone/40 font-brand mb-2">
                    Sourced · {h.source}
                  </div>
                  <p className="text-[13px] text-bone/65 leading-relaxed">{h.detail}</p>
                </div>
              </details>
            ))}
          </div>

          {/* Supplement Facts panel — always visible */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border-2 border-bone/15 bg-ink-800/60 p-5 lg:sticky lg:top-28">
              <div className="font-display font-black text-xl uppercase tracking-tight text-bone border-b-4 border-bone/20 pb-2 mb-1">
                Supplement Facts
              </div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-bone/45 font-brand border-b border-bone/15 py-2">
                <span>{data.servingLabel}</span>
                <span>Amount</span>
              </div>
              <dl className="divide-y divide-bone/10">
                {data.items.map((h) => (
                  <div key={h.name} className="flex items-baseline justify-between gap-3 py-2">
                    <dt className="text-bone/80 text-[13px]">
                      {h.name}
                      <span className="block text-[10px] italic text-bone/35">{h.botanical}</span>
                    </dt>
                    <dd className="font-stencil text-bone text-sm whitespace-nowrap">{h.dose}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t-4 border-bone/20 mt-1 pt-3 space-y-1.5">
                <p className="text-[11px] text-bone/50 leading-relaxed">{data.doseNote}</p>
                <p className="text-[11px] text-bone/40 leading-relaxed"><span className="uppercase tracking-widest font-brand text-bone/55">Other:</span> {data.otherIngredients}</p>
                <p className="text-[10px] text-bone/30 leading-relaxed">† Daily Value not established.</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Credibility chips */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {data.claims.map((c) => (
            <span key={c} className="px-4 py-2 rounded-full border border-amber/30 bg-amber/5 text-[11px] uppercase tracking-widest text-bone/85 font-brand font-semibold">
              <span className="text-amber mr-1.5">✓</span>{c}
            </span>
          ))}
        </div>

        {/* Us vs typical — transparency wedge */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4 max-w-3xl">
          <div className="p-5 rounded-2xl border border-amber/30 bg-amber/5">
            <div className="eyebrow mb-2 text-amber">{product.name}</div>
            <ul className="space-y-1.5 text-[14px] text-bone/85">
              <li className="flex gap-2"><span className="text-amber">✓</span>Every milligram printed on the label</li>
              <li className="flex gap-2"><span className="text-amber">✓</span>Botanical + Sanskrit names disclosed</li>
              <li className="flex gap-2"><span className="text-amber">✓</span>3rd-party lab report</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl border border-bone/10 bg-ink-800/30">
            <div className="eyebrow mb-2 text-bone/40">Typical "proprietary blend"</div>
            <ul className="space-y-1.5 text-[14px] text-bone/50">
              <li className="flex gap-2"><span className="text-rust">✕</span>Total blend weight only — per-herb doses hidden</li>
              <li className="flex gap-2"><span className="text-rust">✕</span>Trace "fairy-dusted" actives for the label</li>
              <li className="flex gap-2"><span className="text-rust">✕</span>No independent verification</li>
            </ul>
          </div>
        </div>

        {data.credit && (
          <p className="mt-8 text-[10px] text-bone/30 leading-relaxed max-w-3xl">{data.credit}</p>
        )}
      </div>
    </section>
  )
}
