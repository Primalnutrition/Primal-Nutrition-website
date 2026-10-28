import Picture from './Picture.jsx'

/* Editorial split: one large image, one short story, one link. `side` puts the
   image left or right so consecutive stories alternate. */
export default function HomeStory({ img, side = 'left', eyebrow, title, body, cta }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-x grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className={`rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[4/3] ${side === 'right' ? 'lg:order-2' : ''}`}>
          <Picture src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-lg">
          <div className="eyebrow mb-5">{eyebrow}</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] mb-6">
            {title[0]}<br /><span className="text-shimmer">{title[1]}</span>
          </h2>
          <p className="text-lg text-bone/70 leading-relaxed mb-8">{body}</p>
          {cta && (
            <button onClick={cta.onClick} className="text-amber hover:text-amber-light font-semibold tracking-wide">
              {cta.label} →
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
