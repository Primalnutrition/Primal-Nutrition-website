/* 4-week monthly transformation curve per client brief.
   Themes: Energy · Recovery · Drive · Strength · Performance · Vitality.
   No Tongkat Ali references (removed per directive 7.2).               */
const stages = [
  {
    week: 'Week 1',
    title: 'Ignition',
    body: 'Day 3-5: morning energy sharpens. Sleep deepens. Cortisol begins regulating. Mental clarity returns before the protocol fully kicks in.',
    metric: 'Energy + Sleep',
  },
  {
    week: 'Week 2',
    title: 'Activation',
    body: 'Recovery between sessions accelerates. Gym output measurably higher. Stress tolerance widens. The body starts trusting the formula.',
    metric: 'Recovery + Output',
  },
  {
    week: 'Week 3',
    title: 'Drive',
    body: 'Strength PRs return. Libido and motivation elevate noticeably. Confidence sharpens. The shift others can see, not just feel.',
    metric: 'Strength + Drive',
  },
  {
    week: 'Week 4',
    title: 'New Baseline',
    body: 'Vitality compounds. Body composition shifts. The 5,000-year-old protocol, now your floor — not your ceiling.',
    metric: 'Performance + Vitality',
  },
]

export default function Results() {
  return (
    <section className="py-28 bg-gradient-to-b from-ink to-ink-800/40 relative">
      <div className="container-x">
        <div className="max-w-3xl mb-16">
          <div className="eyebrow mb-5 font-brand tracking-[0.28em]">The 4-Week Curve</div>
          <h2 className="font-display text-4xl lg:text-6xl tracking-tight leading-[0.98] mb-5 uppercase">
            WHAT CHANGES.<br/>
            <span className="text-shimmer">WHEN.</span>
          </h2>
          <p className="text-lg text-bone/65 leading-relaxed">
            Real Ayurvedic adaptogens work on the endocrine system in waves — not overnight. Here is what to expect, week by week, based on user data + clinical literature.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-6 lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber via-amber/40 to-transparent" />

          <div className="space-y-12 lg:space-y-20">
            {stages.map((s, i) => (
              <div
                key={s.week}
                className={`relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  i % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Dot */}
                <div className="absolute left-6 lg:left-1/2 lg:-translate-x-1/2 -translate-y-1/2 top-8 w-4 h-4 rounded-full bg-amber border-4 border-ink shadow-[0_0_0_4px_rgba(236,30,39,0.2)]" />

                <div className={`pl-16 lg:pl-0 ${i % 2 === 1 ? 'lg:order-2 lg:text-left lg:pl-16' : 'lg:text-right lg:pr-16'}`}>
                  <div className="eyebrow mb-2 text-amber font-brand tracking-[0.28em]">{s.week}</div>
                  <h3 className="font-display text-4xl lg:text-5xl uppercase tracking-tight mb-3">{s.title}</h3>
                  <p className="text-bone/65 text-[15px] leading-relaxed max-w-md lg:ml-auto lg:mr-0 lg:max-w-md">{s.body}</p>
                </div>
                <div className={`pl-16 lg:pl-0 ${i % 2 === 1 ? 'lg:order-1 lg:text-right lg:pr-16' : 'lg:pl-16'}`}>
                  <div className="inline-block p-6 rounded-2xl border border-amber/20 bg-amber/5 backdrop-blur-sm">
                    <div className="text-[10px] uppercase tracking-widest text-bone/50 mb-1 font-brand">Focus</div>
                    <div className="font-stencil text-3xl lg:text-4xl text-gradient-primal">{s.metric}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
