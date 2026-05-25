const badges = [
  { label: 'FSSAI Licensed', sub: 'Lic. 10024XXXXXXXX' },
  { label: 'GMP Certified', sub: 'WHO standards' },
  { label: 'ISO 22000', sub: 'Food safety' },
  { label: '3rd Party Tested', sub: 'Independent lab' },
  { label: '100% Vegetarian', sub: 'Plant-derived' },
  { label: 'No Steroids', sub: 'Hormone-free' },
  { label: 'Heavy Metals', sub: 'Under LOQ' },
  { label: 'WADA Aligned', sub: 'Athlete-safe' },
]

function Badge({ label, sub }) {
  return (
    <div className="flex items-center gap-3 px-7 shrink-0">
      <div className="w-9 h-9 rounded-full border border-amber/30 flex items-center justify-center text-amber transition-colors">
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="whitespace-nowrap">
        <div className="text-xs font-semibold text-bone leading-tight">{label}</div>
        <div className="text-[10px] uppercase tracking-wider text-bone/40">{sub}</div>
      </div>
    </div>
  )
}

export default function TrustStrip() {
  // Duplicate for seamless loop
  const loop = [...badges, ...badges]
  return (
    <section className="border-y border-bone/10 bg-ink-800/40 overflow-hidden">
      <div className="py-6 marquee-mask">
        <div className="marquee-track">
          {loop.map((b, i) => (
            <Badge key={`${b.label}-${i}`} {...b} />
          ))}
        </div>
      </div>
    </section>
  )
}
