import CountUp from './CountUp.jsx'

const reviews = [
  { name: 'Arjun M.', city: 'Bengaluru', age: 34, rating: 5, title: 'My morning is no longer a fight', body: 'Switched from a synthetic stack I was running for 14 months. Within 6 weeks I sleep deeper, lift heavier, and my fasting energy is back. The price is fair for what is in the bottle.', verified: true, time: '2 weeks ago' },
  { name: 'Vikrant S.', city: 'Mumbai', age: 41, rating: 5, title: 'Father of two, slept 4hrs, was a zombie', body: 'I am not a supplement guy. I tried this only because I saw the Third-Party Lab report. It actually works. My wife noticed before I did.', verified: true, time: '1 month ago' },
  { name: 'Rohan T.', city: 'Pune', age: 29, rating: 5, title: 'Liquid format is the unlock', body: 'I had tried Kapiva and a US brand. Capsules sit in my stomach. The liquid hits in 20 minutes and I can feel a clean lift that lasts till evening. No crash.', verified: true, time: '3 weeks ago' },
  { name: 'Karan B.', city: 'Delhi', age: 37, rating: 4, title: 'Honest review at week 4', body: 'Week 1-2 nothing. Week 3 sleep improved. Week 4 I am benching what I did at 28. Will repurchase. Knock one star because it tastes earthy — it is what it is.', verified: true, time: '5 days ago' },
  { name: 'Sahil R.', city: 'Hyderabad', age: 32, rating: 5, title: 'Finally a brand that shows the lab report', body: 'I refuse to take anything without third-party testing. Primal puts the certificate online with batch numbers. That is the only reason I tried, and I am staying.', verified: true, time: '6 weeks ago' },
  { name: 'Aakash V.', city: 'Gurgaon', age: 45, rating: 5, title: 'TRT was on the table. Not anymore.', body: 'My T was 340. Doctor suggested TRT. I gave myself 90 days with Primal first. Retested last week — 510. I am not saying it will work for everyone. I am saying it worked for me.', verified: true, time: '2 months ago' },
]

export default function Reviews() {
  return (
    <section id="reviews" className="py-28 bg-gradient-to-b from-ink-800/40 to-ink relative">
      <div className="container-x">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">Verified Buyers</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] mb-5">
              12,400 Indian men.<br/>
              <span className="italic font-medium text-amber-light">One bottle that delivered.</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 text-amber text-2xl">★★★★★</div>
              <div className="font-display font-bold text-3xl"><CountUp end={4.83} decimals={2} duration={2000} /></div>
              <div className="text-xs uppercase tracking-widest text-bone/50">Avg. rating</div>
            </div>
            <div className="h-12 w-px bg-bone/10" />
            <div className="text-center">
              <div className="font-display font-bold text-3xl"><CountUp end={2431} duration={2200} /></div>
              <div className="text-xs uppercase tracking-widest text-bone/50">Verified reviews</div>
            </div>
          </div>
        </div>

        <div data-reveal-stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <article key={r.name} className="card-lift p-6 rounded-2xl border border-bone/10 bg-ink-800/40 hover:border-amber/30 transition group flex flex-col">
              <div className="flex items-center gap-1 text-amber text-sm mb-3">
                {Array.from({ length: r.rating }).map((_, i) => <span key={i}>★</span>)}
                {Array.from({ length: 5 - r.rating }).map((_, i) => <span key={i} className="text-bone/15">★</span>)}
              </div>
              <h3 className="font-display font-semibold text-lg leading-snug mb-3">"{r.title}"</h3>
              <p className="text-bone/65 text-[14px] leading-relaxed mb-5 flex-1">{r.body}</p>
              <div className="flex items-center justify-between pt-4 border-t border-bone/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber/40 to-rust/30 flex items-center justify-center font-display font-bold text-bone text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-[11px] text-bone/40">{r.city} · {r.age}</div>
                  </div>
                </div>
                {r.verified && (
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-forest/80">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Verified
                  </div>
                )}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-bone/30 mt-2">{r.time}</div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#" className="btn-ghost text-sm">Read all 2,431 reviews →</a>
        </div>
      </div>
    </section>
  )
}
