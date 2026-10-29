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
 * Liquid is populated from the real T-REX label composition (shown per 10 ml serving).
 */
const INGREDIENTS = {
  'trex-liquid': {
    eyebrow: '7 actives · every dose disclosed',
    title: (<>What's inside.<br /><span className="text-shimmer">Down to the milligram.</span></>),
    intro:
      'No proprietary blends. No fairy-dusting. Seven Ayurvedic actives, each named in Sanskrit, botanical and English — at the exact mg printed on the bottle.',
    servingLabel: 'Per 10 ml',
    doseNote: 'Daily dose: 10 ml. For a higher dose, take 2 × 10 ml.',
    otherIngredients: 'Hazelnut-flavoured natural liquid base.',
    items: [
      { name: 'Himalayan Shilajit', sanskrit: 'शिलाजीत', botanical: 'Asphaltum', dose: '100 mg', source: 'Bhutan / Himalayan rock', role: 'The fulvic-acid engine', detail: 'The fulvic-acid-rich resin that powers the whole formula. Liquid-extracted by the ancestral 15-day granthit process — the only form the body fully absorbs.', image: '/products/ingredients/shilajit.jpg' },
      { name: 'Ashwagandha', sanskrit: 'अश्वगंधा', botanical: 'Withania somnifera', dose: '200 mg', source: 'Root extract', role: 'Cortisol & calm energy', detail: 'Balances cortisol and the adrenals so daily energy holds without caffeine — anxiety-relieving, without the side effects of stimulants.', image: '/products/ingredients/ashwagandha.jpg' },
      { name: 'Arjun Chal', sanskrit: 'अर्जुन छाल', botanical: 'Terminalia arjuna', dose: '200 mg', source: 'Tree-bark extract', role: 'Heart & VO₂ max', detail: 'Cardio-protective — supports healthy cholesterol and blood pressure. A study showed VO₂ max +4.9% in two weeks. Pairs with Ashwagandha for effect.', image: '/products/ingredients/arjun.jpg' },
      { name: 'Gokhru', sanskrit: 'गोखरू', botanical: 'Tribulus terrestris', dose: '100 mg', source: 'Fruit extract', role: 'Libido & vitality', detail: 'Used for millennia across Indian and Chinese medicine. Steroidal glycosides support sexual well-being, function and natural vitality.', image: '/products/ingredients/gokhru.jpg' },
      { name: 'Draksha', sanskrit: 'द्राक्षा', botanical: 'Vitis vinifera', dose: '200 mg', source: 'Dried grape extract', role: 'Recovery adaptogen', detail: 'The ancient endurance fuel — speeds muscle recovery, guards against muscle loss, scavenges free radicals, and protects the heart.', image: '/products/ingredients/draksha.jpg' },
      { name: 'Safed Musli', sanskrit: 'सफेद मूसली', botanical: 'Chlorophytum arundinaceum', dose: '200 mg', source: 'Rare Indian root', role: 'Testosterone & stamina', detail: 'The natural alternative to commercial drugs. Supports testosterone production, sperm count and desire — effective even where diabetes-driven dysfunction is present.', image: '/products/ingredients/safed-musli.jpg' },
      { name: 'Kath Badam', sanskrit: 'कथ बादाम', botanical: 'Prunus dulcis', dose: '100 mg', source: 'Whole almond extract', role: 'Aphrodisiac · building block', detail: 'Vatada in Ayurveda. Raises good cholesterol — the raw material testosterone is built from — stabilises blood sugar, and sharpens memory.', image: '/products/ingredients/kath-badam.jpg' },
    ],
    credit: 'Ingredient photos: Pexels & Wikimedia Commons (Tribulus terrestris fruit © Hüseyin Cahid Doğan, Shilajit © Chirag jindal, Safed Musli/Ashwagandha contributors, CC BY-SA); Arjun bark — public domain.',
    claims: ['100% Ayurvedic', 'No Proprietary Blends', 'No Stimulants', 'No Chemicals', 'Non-GMO', '3rd-Party Lab Tested'],
  },
  'trex-ginseng': {
    eyebrow: '1 active · fully disclosed',
    title: (<>What's inside.<br /><span className="text-shimmer">One root. Nothing else.</span></>),
    intro: 'Genuine Korean Panax ginseng root, named in botanical and English, at the exact strength printed on the bottle. No blends, no fillers dressed up as actives.',
    servingLabel: 'Per 2 capsules',
    doseNote: 'Daily dose: 2 capsules after breakfast. 60 capsules = 30 days.',
    otherIngredients: 'Microcrystalline cellulose, vegetable capsule (HPMC).',
    items: [
      { name: 'Korean Panax Ginseng Root Extract', sanskrit: 'Insam', botanical: 'Panax ginseng', dose: '1,000 mg', source: 'Korean mountain roots', role: 'The king of herbs', detail: 'Genuine Korean Panax, not Indian ginseng (ashwagandha). An adaptogen traditionally used for steady energy, focus and vitality.', image: '/products/ingredients/ginseng.jpg' },
    ],
    claims: ['100% Ayurvedic proprietary medicine', 'No Stimulants', 'No Fillers', 'Non-GMO', '3rd-Party Lab Tested'],
  },
  'trex-cordyceps': {
    eyebrow: '1 active · fully disclosed',
    title: (<>What's inside.<br /><span className="text-shimmer">One fungus. Nothing else.</span></>),
    intro: 'Cordyceps sinensis extract at the exact strength printed on the bottle. No blends, no fillers dressed up as actives.',
    servingLabel: 'Per 2 capsules',
    doseNote: 'Daily dose: 2 capsules after breakfast. 60 capsules = 30 days.',
    otherIngredients: 'Microcrystalline cellulose, vegetable capsule (HPMC).',
    items: [
      { name: 'Cordyceps Sinensis Extract', sanskrit: 'Keedajadi', botanical: 'Cordyceps sinensis', dose: '1,000 mg', source: 'High-altitude caterpillar fungus', role: '10:1 concentrate · 10,000 mg raw equivalent', detail: 'A rare medicinal fungus traditionally found on the high Himalayan and Tibetan plateau. Concentrated 10:1 for stamina, oxygen use and clean energy.', image: '/products/ingredients/cordyceps.jpg' },
    ],
    claims: ['10:1 Extract', 'No Stimulants', 'No Fillers', 'Non-GMO', '3rd-Party Lab Tested'],
  },
  'trex-royal-jelly': {
    eyebrow: '1 active · fully disclosed',
    title: (<>What's inside.<br /><span className="text-shimmer">Pure royal jelly. Nothing else.</span></>),
    intro: 'Royal jelly at the exact strength printed on the bottle. No blends, no fillers dressed up as actives.',
    servingLabel: 'Per 2 capsules',
    doseNote: 'Daily dose: 2 capsules after breakfast. 60 capsules = 30 days. Not suitable for vegans.',
    otherIngredients: 'Microcrystalline cellulose, vegetable capsule (HPMC).',
    items: [
      { name: 'Royal Jelly', sanskrit: 'Bee-made', botanical: 'Apis mellifera', dose: '1,000 mg', source: 'Honeybee colonies', role: 'Protein, amino acids, B vitamins', detail: 'The food worker bees make for their queen. Rich in protein, amino acids and B vitamins, traditionally used for vitality and recovery.' },
    ],
    claims: ['Pure Royal Jelly', 'No Stimulants', 'No Fillers', '3rd-Party Lab Tested'],
  },
  'trex-maca': {
    eyebrow: '1 active · fully disclosed',
    title: (<>What's inside.<br /><span className="text-shimmer">One root. Nothing else.</span></>),
    intro: 'Black maca root extract at the exact strength printed on the bottle. No blends, no fillers dressed up as actives.',
    servingLabel: 'Per 2 capsules',
    doseNote: 'Daily dose: 2 capsules after breakfast. 60 capsules = 30 days.',
    otherIngredients: 'Microcrystalline cellulose, vegetable capsule (HPMC).',
    items: [
      { name: 'Black Maca Root Extract', sanskrit: 'Maca', botanical: 'Lepidium meyenii', dose: '1,000 mg', source: 'Junín plateau, Peru · 4,100 m', role: '10:1 concentrate · 10,000 mg raw equivalent', detail: 'The rarest of the three maca colours, grown high in the Peruvian Andes and eaten for strength and stamina for over 2,000 years.', image: '/products/ingredients/maca.jpg' },
    ],
    claims: ['10:1 Extract', 'No Stimulants', 'No Fillers', 'Non-GMO', '3rd-Party Lab Tested'],
  },
  'trex-liver': {
    eyebrow: '13 herbs · every dose disclosed',
    title: (<>What's inside.<br /><span className="text-shimmer">Thirteen herbs. Down to the milligram.</span></>),
    intro: 'A classical Ayurvedic liver formula with milk thistle. Every herb is named in Hindi, botanical and English, at the exact mg printed on the bottle.',
    servingLabel: 'Per 2 capsules',
    doseNote: 'Daily dose: 2 capsules after breakfast. 60 capsules = 30 days.',
    otherIngredients: 'Louha Bhasma (calcined iron) 5 mg, sodium benzoate I.P. 2.5 mg, lactose I.P. (contains lactose).',
    items: [
      { name: 'Gulancha', sanskrit: 'Giloy', botanical: 'Tinospora cordifolia', dose: '100 mg', source: 'Stem', role: 'Rasayana · Immune and liver support', detail: 'A traditional Ayurvedic herb, used for generations. Part used: stem.' },
      { name: 'Rohitak Chhal', sanskrit: 'Rohitak', botanical: 'Tecomella undulata', dose: '100 mg', source: 'Stem bark', role: 'Classical liver and spleen herb', detail: 'A traditional Ayurvedic herb, used for generations. Part used: stem bark.' },
      { name: 'Mutha', sanskrit: 'Nagarmotha', botanical: 'Cyperus rotundus', dose: '50 mg', source: 'Rhizome', role: 'Digestive support', detail: 'A traditional Ayurvedic herb, used for generations. Part used: rhizome.' },
      { name: 'Katki', sanskrit: 'Kutki', botanical: 'Picrorhiza kurroa', dose: '25 mg', source: 'Root', role: 'Bitter hepatic tonic', detail: 'A traditional Ayurvedic herb, used for generations. Part used: root.' },
      { name: 'Daruharidra', sanskrit: 'Tree turmeric', botanical: 'Berberis aristata', dose: '75 mg', source: 'Heartwood', role: 'Bile support', detail: 'A traditional Ayurvedic herb, used for generations. Part used: heartwood.' },
      { name: 'Kule Khara', sanskrit: 'Talmakhana', botanical: 'Hygrophila spinosa', dose: '50 mg', source: 'Whole plant', role: 'Fluid balance support', detail: 'A traditional Ayurvedic herb, used for generations. Part used: whole plant.' },
      { name: 'Khetpapra', sanskrit: 'Pitpapra', botanical: 'Fumaria parviflora', dose: '50 mg', source: 'Whole plant', role: 'Blood-purifying bitter', detail: 'A traditional Ayurvedic herb, used for generations. Part used: whole plant.' },
      { name: 'Bhuiamla', sanskrit: 'Bhumi amla', botanical: 'Phyllanthus niruri', dose: '50 mg', source: 'Whole plant', role: 'Classical liver herb', detail: 'A traditional Ayurvedic herb, used for generations. Part used: whole plant.' },
      { name: 'Pipul', sanskrit: 'Long pepper', botanical: 'Piper longum', dose: '50 mg', source: 'Fruit', role: 'Helps absorption of the other herbs', detail: 'A traditional Ayurvedic herb, used for generations. Part used: fruit.' },
      { name: 'Kalmegh', sanskrit: 'King of bitters', botanical: 'Andrographis paniculata', dose: '100 mg', source: 'Whole plant', role: 'Liver support', detail: 'A traditional Ayurvedic herb, used for generations. Part used: whole plant.' },
      { name: 'Chirata', sanskrit: 'Chiretta', botanical: 'Swertia chirata', dose: '50 mg', source: 'Whole plant', role: 'Bitter tonic · Digestive fire', detail: 'A traditional Ayurvedic herb, used for generations. Part used: whole plant.' },
      { name: 'Punarnava', sanskrit: 'Punarnava', botanical: 'Boerhaavia diffusa', dose: '50 mg', source: 'Whole plant', role: 'Rejuvenative · Liver and fluid support', detail: 'A traditional Ayurvedic herb, used for generations. Part used: whole plant.' },
      { name: 'Milk Thistle', sanskrit: 'Milk thistle', botanical: 'Silybum marianum', dose: '100 mg', source: 'Seed extract', role: 'The best-known liver herb in the world', detail: 'A traditional Ayurvedic herb, used for generations. Part used: seed extract.' },
    ],
    claims: ['100% Ayurvedic proprietary medicine', 'No Stimulants', '13 Herbs + Milk Thistle', '3rd-Party Lab Tested'],
  },
  'hydra-muscle': {
    eyebrow: '4 actives · every dose disclosed',
    title: (<>What's inside.<br /><span className="text-shimmer">Strength and salts. Nothing else.</span></>),
    intro: 'Creatine with the salts to match, at the exact amounts printed on the tub. No proprietary blends.',
    servingLabel: 'Per scoop (10 g)',
    doseNote: 'Daily dose: 1 scoop in 300–500 ml of water, before or during your workout.',
    otherIngredients: 'Natural strawberry flavour, stevia leaf extract, silicon dioxide (anti-caking). Sodium 160 mg and potassium 75 mg per scoop.',
    items: [
      { name: 'Creatine Monohydrate', sanskrit: 'Strength', botanical: '99.9% pure', dose: '3,000 mg', source: 'Pure monohydrate', role: 'Strength and power', detail: 'The most researched supplement in sport. Supports strength, power and lean muscle.' },
      { name: 'Coconut Water Powder', sanskrit: 'Hydration', botanical: 'Cocos nucifera', dose: '500 mg', source: 'Natural potassium', role: 'Natural electrolytes', detail: 'A natural source of potassium to help replace what you sweat out.' },
      { name: 'Himalayan Pink Salt', sanskrit: 'Hydration', botanical: '84+ minerals', dose: '400 mg', source: 'Himalayan mineral salt', role: 'Sodium and trace minerals', detail: 'Replaces the sodium lost in hot, sweaty sessions.' },
      { name: 'Magnesium', sanskrit: 'Recovery', botanical: 'As magnesium citrate', dose: '50 mg', source: 'Magnesium citrate', role: 'Muscle and recovery support', detail: 'Supports normal muscle function and recovery.' },
    ],
    claims: ['3 g Creatine', 'No Artificial Sweeteners', 'Himalayan Pink Salt', '3rd-Party Lab Tested'],
  },
  'trex-tongkat': {
    eyebrow: '1 active · fully disclosed',
    title: (<>What's inside.<br /><span className="text-shimmer">One root. Nothing else.</span></>),
    intro:
      'A single hero ingredient, named in botanical and English, at the exact strength printed on the bottle. No blends, no fillers dressed up as actives.',
    servingLabel: 'Per 2 capsules',
    doseNote: 'Daily dose: 2 capsules after breakfast. 60 capsules = 30 days.',
    otherIngredients: 'Microcrystalline cellulose, vegetable capsule (HPMC).',
    items: [
      { name: 'Tongkat Ali Root Extract', sanskrit: 'Ali\u2019s walking stick', botanical: 'Eurycoma longifolia', dose: '1,000 mg', source: 'Malaysian rainforest root', role: '100:1 ultra-concentrated extract', detail: 'Equal to 1,00,000 mg of raw root. Made from rainforest roots that mature for 5\u20137 years, then concentrated for maximum strength. It supports free testosterone, drive and stamina.', image: '/products/ingredients/tongkat-ali.jpg' },
    ],
    credit: 'Ingredient photo: Tongkat Ali (Eurycoma longifolia) \u00a9 Mokkie, Wikimedia Commons, CC BY-SA 3.0.',
    claims: ['100:1 Extract', 'No Stimulants', 'No Fillers', 'Non-GMO', '3rd-Party Lab Tested'],
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
                  {h.image && (
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full overflow-hidden border border-amber/25 ring-1 ring-ink/40 shadow-lg">
                      <Picture src={h.image} alt={h.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className={`font-display text-xl uppercase tracking-tight text-bone leading-tight ${h.image ? 'pr-20' : ''}`}>{h.name}</div>
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
