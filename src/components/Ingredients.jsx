import Picture from './Picture.jsx'

/* The actual 7 ingredients in T-Rex (per 5ml) — pulled verbatim from
   the Primal Nutrition T-REX LABEL.pdf composition statement.
   Each herb now carries an icon from the official brand assets. */
const herbs = [
  {
    name: 'Himalayan Shilajit',
    sanskrit: 'शिलाजीत',
    botanical: 'Asphaltum',
    dose: '50 mg',
    source: 'Bhutan/Himalayan rocks',
    role: '"Destroyer of Weakness"',
    detail: 'Conqueror of mountains. The fulvic-acid-rich resin that powers the entire formula. Liquid-extracted by ancestral 15-day granthit process — the only form fully absorbed by the body.',
    accent: 'from-amber to-rust',
    icon: '/brand/icon-energy.png',
  },
  {
    name: 'Ashwagandha',
    sanskrit: 'अश्वगंधा',
    botanical: 'Withania somnifera',
    dose: '100 mg',
    source: 'Root extract · clinically-studied',
    role: 'Indian Ginseng · rayasana',
    detail: 'King plant of the herbal kingdom. Balances cortisol and adrenals so daily energy holds without caffeine. Anxiety-relieving without side effects.',
    accent: 'from-forest to-amber-dark',
    icon: '/brand/icon-stress.png',
  },
  {
    name: 'Arjun Chal',
    sanskrit: 'अर्जुन छाल',
    botanical: 'Terminalia arjuna',
    dose: '100 mg',
    source: 'Tree bark extract',
    role: 'Heart & VO₂ max',
    detail: 'Cardio-protective. Lowers cholesterol and blood pressure. One study: VO₂ max +4.9% in 2 weeks. Paired with Ashwagandha for maximum effect.',
    accent: 'from-rust to-amber',
    icon: '/brand/icon-performance.png',
  },
  {
    name: 'Gokhru',
    sanskrit: 'गोखरू',
    botanical: 'Tribulus terrestris',
    dose: '50 mg',
    source: 'Fruit extract',
    role: 'Libido + sexual function',
    detail: 'Used for millennia in Indian and Chinese medicine. Steroidal glycosides drive sexual well-being, erectile function, and natural vitality.',
    accent: 'from-amber-light to-amber-dark',
    icon: '/brand/icon-build.png',
  },
  {
    name: 'Draksha',
    sanskrit: 'द्राक्षा',
    botanical: 'Vitis vinifera',
    dose: '100 mg',
    source: 'Dried grape extract',
    role: 'Recovery + adaptogen',
    detail: 'The ancient endurance fuel. Speeds muscle recovery, prevents muscle loss, antioxidant scavenger. Cardio-protective. Used by long-distance walkers across centuries.',
    accent: 'from-forest to-amber',
    icon: '/brand/icon-performance.png',
  },
  {
    name: 'Safed Musli',
    sanskrit: 'सफेद मूसली',
    botanical: 'Chlorophytum arundinaceum',
    dose: '100 mg',
    source: 'Rare Indian root',
    role: 'Testosterone + stamina',
    detail: 'The natural alternative to commercial drugs. Increases testosterone production, sperm count, and sexual desire. Effective even where diabetes-driven dysfunction is present.',
    accent: 'from-rust to-ink',
    icon: '/brand/icon-build.png',
  },
  {
    name: 'Kath Badam',
    sanskrit: 'कथ बादाम',
    botanical: 'Prunus dulcis (Almond)',
    dose: '50 mg',
    source: 'Whole almond extract',
    role: 'Vrushya · aphrodisiac',
    detail: 'Vatada in Ayurveda. Boosts good cholesterol (LDL) — the raw material testosterone is built from. Stabilises blood sugar. Sharpens memory.',
    accent: 'from-amber-dark to-rust',
    icon: '/brand/icon-brain.png',
  },
]

export default function Ingredients() {
  return (
    <section id="ingredients" className="py-28 relative overflow-hidden">
      {/* Decorative dotted gradient circle, brand asset */}
      <Picture src="/brand/dotted-circle.png" alt="" aria-hidden loading="lazy" decoding="async" className="absolute -top-32 -right-40 w-[600px] opacity-10 mix-blend-lighten pointer-events-none" />

      <div className="container-x relative">
        <div className="max-w-3xl mb-16">
          <div className="eyebrow mb-5 font-brand tracking-[0.28em]">The 7 · Ingredients as Heroes</div>
          <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.98] mb-5 uppercase">
            INDIA'S FIRST<br/>
            <span className="text-shimmer">7-IN-1 NATURAL LIQUID.</span>
          </h2>
          <p className="text-lg text-bone/65 leading-relaxed">
            We preserve ancient traditions and adapt them into modern living. The purest sources, processed by methods our ancestors trusted — and most manufacturers refuse to use because they are lengthy and costly.
          </p>
          <p className="mt-4 text-[15px] text-bone/55 leading-relaxed">
            Every dose disclosed. Every ingredient named in Sanskrit, botanical, and English. Per 5ml serving — exactly as printed on the bottle.
          </p>
        </div>

        <div data-reveal-stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {herbs.map((h) => (
            <article
              key={h.name}
              className="card-lift group relative p-6 rounded-2xl border border-bone/10 bg-ink-800/40 hover:bg-ink-800 hover:border-amber/30 transition overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r ${h.accent}`} />

              {/* Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ink/40 border border-bone/10 flex items-center justify-center p-1.5 group-hover:border-amber/30 transition">
                <Picture src={h.icon} alt="" aria-hidden loading="lazy" decoding="async" className="w-full h-full object-contain opacity-90" style={{ mixBlendMode: 'lighten' }} />
              </div>

              <div className="flex items-baseline gap-2 mb-1 pr-12">
                <div className="font-display text-2xl uppercase tracking-tight text-bone">{h.name}</div>
              </div>
              <div className="font-stencil text-gradient-primal text-2xl leading-none mb-2">{h.dose}</div>
              <div className="text-amber/70 text-sm mb-1 font-medium">{h.sanskrit}</div>
              <div className="text-[10px] uppercase tracking-widest text-bone/40 italic mb-4 font-brand">{h.botanical}</div>

              <dl className="space-y-2.5 text-sm">
                <Row label="Sourced" value={h.source} />
                <Row label="Role" value={h.role} />
              </dl>

              <p className="mt-4 pt-4 border-t border-bone/5 text-[12px] text-bone/55 leading-relaxed">
                {h.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-4xl">
          <Claim>100% Ayurvedic</Claim>
          <Claim>No Artificial Sweetener</Claim>
          <Claim>Non-GMO</Claim>
          <Claim>No Hidden Blends</Claim>
          <Claim>No Chemicals</Claim>
          <Claim>No Stimulants</Claim>
        </div>

        <div className="mt-12 text-center">
          <p className="text-bone/45 text-[13px] font-editorial italic">
            "The answer always lies in nature, in the food we eat and the places we train."
          </p>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <dt className="text-bone/40 text-[11px] uppercase tracking-widest font-brand">{label}</dt>
      <dd className="text-bone text-right text-[13px] font-medium">{value}</dd>
    </div>
  )
}

function Claim({ children }) {
  return (
    <div className="px-4 py-3 rounded-full border border-amber/30 bg-amber/5 text-center text-xs uppercase tracking-widest text-bone/85 font-brand font-semibold">
      <span className="text-amber mr-1.5">✓</span>{children}
    </div>
  )
}
