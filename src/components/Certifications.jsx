/* Real certifications carousel — sources are the actual PDFs converted
   to PNG, sitting in /brand/certifications/. */
const certs = [
  { id: 'fssai', src: '/brand/certifications/fssai-1.png', label: 'FSSAI Licensed', sub: 'Jiyo Ayurveda Pvt. Ltd.' },
  { id: 'ayush', src: '/brand/certifications/ayush.jpg', label: 'AYUSH Certified', sub: 'Govt. of India' },
  { id: 'dope-free', src: '/brand/certifications/dope-free-1.png', label: 'Dope Free', sub: 'Declaration certified' },
  { id: 'trademark', src: '/brand/certifications/trademark-1.png', label: 'RAAJ T-Rex', sub: 'Trademark Class 5' },
  { id: 'iec', src: '/brand/certifications/iec-1.png', label: 'IEC Certified', sub: 'Import-Export Code' },
]

export default function Certifications() {
  return (
    <section className="py-24 bg-gradient-to-b from-ink-800/50 to-ink">
      <div className="container-x">
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-5 font-brand tracking-[0.28em]">Government + Trade Certifications</div>
          <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.98] mb-5 uppercase">
            VERIFIED.<br/>
            <span className="text-shimmer">EVERY CLAIM.</span>
          </h2>
          <p className="text-lg text-bone/65 leading-relaxed">
            Manufacturing License No. AL946M · An Ayurvedic Proprietary Medicine · ISO 22000 + GMP certified facility · Banned Substance Free.
          </p>
        </div>

        <div data-reveal-stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {certs.map((c) => (
            <article key={c.id} className="card-lift group p-3 rounded-2xl border border-bone/10 bg-ink-800/50 flex flex-col">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-bone/95 mb-3 flex items-center justify-center">
                <img src={c.src} alt={c.label} loading="lazy" decoding="async" className="w-full h-full object-cover object-top" />
              </div>
              <div className="px-2 pb-2">
                <div className="font-display text-lg uppercase tracking-tight leading-tight">{c.label}</div>
                <div className="font-brand text-[10px] uppercase tracking-[0.22em] text-bone/45 mt-1">{c.sub}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
