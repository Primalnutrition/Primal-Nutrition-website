export default function Problem() {
  return (
    <section className="py-28 relative">
      <div className="container-x">
        <div className="max-w-4xl">
          <div className="eyebrow mb-6">The unspoken epidemic</div>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-10 uppercase">
            TESTOSTERONE IN INDIAN MEN HAS DROPPED <span className="text-shimmer">22% SINCE 2000.</span><br/>
            MOST "BOOSTERS" ARE MAKING IT WORSE.
          </h2>

          <div data-reveal-stagger className="grid md:grid-cols-3 gap-8 mt-16">
            <Card
              number="01"
              title="Synthetic spikes, real crashes"
              body="Off-the-shelf T-boosters push your system with caffeine and pro-hormones. Your body downregulates in 6 weeks. You feel worse than when you started."
            />
            <Card
              number="02"
              title="Proprietary blends hide doses"
              body="If a label says '500mg Performance Matrix™' you don't know if there's 5mg of shilajit or 5 grams. We refuse to do this."
            />
            <Card
              number="03"
              title="Ayurveda done as marketing"
              body="Cheap herbs in capsule shells aren't Ayurveda. Real adaptogens require sourcing, standardization, and Vaidya-validated synergy."
            />
          </div>

          <div className="mt-16 pt-12 border-t border-bone/10">
            <p className="font-editorial text-2xl lg:text-3xl text-bone/85 leading-snug max-w-3xl italic">
              "We are the people who choose to be raw, choose to be natural, choose to walk on the rough road. We take risks, we create momentum, we make mistakes. We progress."
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.28em] text-amber font-brand font-semibold">— Primal Nutrition Brand Philosophy</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Card({ number, title, body }) {
  return (
    <div className="card-lift relative p-7 border border-bone/10 rounded-2xl bg-ink-800/40 hover:border-amber/30 transition group">
      <div className="text-amber/40 group-hover:text-amber font-display font-black text-3xl mb-3 transition">{number}</div>
      <h3 className="font-display text-xl font-semibold mb-3 leading-tight">{title}</h3>
      <p className="text-bone/60 text-[15px] leading-relaxed">{body}</p>
    </div>
  )
}
