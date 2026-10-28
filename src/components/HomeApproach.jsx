import Picture from './Picture.jsx'

/* How we solve it — three pillars, no ingredient lists. */
const PILLARS = [
  {
    n: '01',
    img: '/products/forge/trex-maca.jpg',          // placeholder → /home/pillar-sourcing.jpg
    title: 'Rare herbs, sourced at origin',
    body: 'Himalayan Shilajit, Malaysian Tongkat Ali, Andean Black Maca. Each herb comes from where it grows best.',
  },
  {
    n: '02',
    img: '/products/forge/trex-ginseng.jpg',       // placeholder → /home/pillar-traditional.jpg
    title: 'Made the traditional way',
    body: 'Ayurvedic methods refined over three generations. Nothing synthetic, no stimulants, no shortcuts.',
  },
  {
    n: '03',
    img: '/products/forge/trex-liver.jpg',         // placeholder → /home/pillar-lab.jpg
    title: 'Proven, not promised',
    body: 'Every batch is tested by an independent lab, and the certificates are online for you to read.',
  },
]

export default function HomeApproach() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-ink to-ink-800/30">
      <div className="container-x">
        <div className="max-w-2xl mb-12">
          <div className="eyebrow mb-5">How we solve it</div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold tracking-tightest leading-[1.02]">
            Old wisdom.<br /><span className="text-shimmer">Modern standards.</span>
          </h2>
        </div>
        <div data-reveal-stagger className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <div key={p.n} className="rounded-2xl border border-bone/10 bg-ink-800/50 overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <Picture src={p.img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <div className="p-7">
              <div className="font-display font-black text-4xl text-amber mb-4">{p.n}<span className="text-amber/50">.</span></div>
              <h3 className="font-display font-bold text-xl uppercase tracking-wide mb-3">{p.title}</h3>
              <p className="text-bone/65 leading-relaxed text-[15px]">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
