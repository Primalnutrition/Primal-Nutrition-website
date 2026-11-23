/* One calm row of facts. Every item is true and shown once. */
const items = [
  '12,400+ Indian men',
  'Free delivery',
  'Cash on Delivery',
  'Lab tested',
  'Ayurvedic Lic. AL946M',   // hidden on small phones to keep the row to two lines
]

export default function TrustStrip() {
  return (
    <section className="border-y border-bone/10 bg-ink-800/40">
      <div className="container-x py-5 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-bone/60 font-brand">
        {items.map((t) => (
          <span key={t} className={`items-center gap-2 ${t.startsWith('Ayurvedic') ? 'hidden sm:inline-flex' : 'inline-flex'}`}>
            <span className="text-amber">✓</span>{t}
          </span>
        ))}
      </div>
    </section>
  )
}
