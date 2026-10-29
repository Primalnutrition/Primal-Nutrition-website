import { usePage } from '../context/RouterContext.jsx'
import Picture from './Picture.jsx'

/* Homepage teaser for the Manufacturing page: a short brief, a 2×2 glimpse
   of the photos (no captions), and a "Know more" button. */
const IMAGES = [
  '/manufacturing/tanks.jpg',
  '/manufacturing/floor.jpg',
  '/manufacturing/warehouse-qc.jpg',
  '/manufacturing/warehouse-stock.jpg',
]

export default function HomeManufacturing() {
  const { navigate } = usePage()
  const open = () => navigate('manufacturing')

  return (
    <section className="py-16 lg:py-24">
      <div className="container-x grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="max-w-lg">
          <div className="eyebrow mb-5">Our manufacturing</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-6">
            Ancient recipes.<br /><span className="text-shimmer">Clean manufacturing.</span>
          </h2>
          <p className="text-lg text-bone/70 leading-relaxed mb-6">
            Made by Raaj Ayurvedic Pharmacy in Siliguri, a licensed Ayurvedic manufacturer from a family with more than 60 years in the craft. Raw herbs are checked on arrival, made in clean rooms by trained hands, and tested by an independent lab before they ship.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {['Licensed · AL946M', 'Checked on arrival', 'Lab tested'].map((c) => (
              <span key={c} className="px-4 py-2 rounded-full border border-amber/30 bg-amber/5 text-[11px] uppercase tracking-widest text-bone/85 font-brand font-semibold">
                <span className="text-amber mr-1.5">✓</span>{c}
              </span>
            ))}
          </div>
          <button onClick={open} className="btn-primary">Know more →</button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:gap-4">
          {IMAGES.map((src, i) => (
            <button
              key={src}
              onClick={open}
              aria-label="See our manufacturing"
              className={`group rounded-2xl overflow-hidden aspect-[4/5] ${i % 2 === 1 ? 'lg:translate-y-8' : ''}`}
            >
              <Picture src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
