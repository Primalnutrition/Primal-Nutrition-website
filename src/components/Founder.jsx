import Picture from './Picture.jsx'

export default function Founder() {
  return (
    <section id="founder" className="py-28 relative">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Founder portrait — real photograph */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-ink-800 border border-bone/10">
              <Picture
                src="/brand/founder.jpg"
                alt="Founder of Primal Nutrition"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {/* Subtle bottom gradient for legibility */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/55 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="font-brand text-[10px] uppercase tracking-[0.32em] text-amber mb-2">Founder</div>
                <div className="font-display text-2xl tracking-tight uppercase leading-tight">Pro Powerlifter · 3rd-Gen Ayurveda</div>
                <div className="text-xs text-bone/60 mt-1 font-sans">Jiyo Ayurveda Pvt. Ltd. · 60+ years of family lineage</div>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="lg:col-span-7">
            <div className="eyebrow mb-5">The Origin</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] mb-8">
              We didn't start a brand.<br/>
              <span className="italic font-medium text-amber-light">We started a rebellion.</span>
            </h2>

            {/* Hook — the dual identity */}
            <p className="font-display text-2xl lg:text-3xl uppercase tracking-tight leading-[1.05] mb-8 max-w-2xl">
              A PROFESSIONAL POWERLIFTER.<br/>
              A <span className="text-gradient-primal">THIRD-GENERATION</span> AYURVEDIC MANUFACTURER.<br/>
              <span className="text-bone/55">SAME PERSON.</span>
            </p>

            <div className="space-y-5 text-lg text-bone/75 leading-relaxed max-w-2xl">
              <p>
                Our founder is a pro-level athlete — and heir to a family that has been in Ayurvedic manufacturing for <strong className="text-bone">over 60 years</strong>. Two worlds in one person: the discipline of competitive sport, the lineage of authentic Ayurveda.
              </p>
              <p>
                He spent years watching both worlds fail. <strong className="text-bone">Athletes wrecking their hormones</strong> on synthetic stacks. Genuine <strong className="text-bone">Ayurveda losing relevance</strong> because it looked tired and felt dated. Primal is what he built when he refused to accept either outcome.
              </p>
              <p>
                Modern science, earth-grown ingredients, traditional extraction methods refined across three generations — engineered to look, feel, and perform like a modern global nutrition brand. Most manufacturers avoid these methods because they are lengthy, costly, and hard to scale.
              </p>
              <p className="text-bone">
                We refuse to do it any other way. We walk the rough road — because that is where real strength is built.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Stat label="Manufactured at" value="60+ year GMP facility · Siliguri, West Bengal" />
              <Stat label="Batches tested" value="100% · Third-Party Lab" />
              <Stat label="In market since" value="2016" />
            </div>

            {/* What we refuse — the brand promise distilled */}
            <div className="mt-10 pt-8 border-t border-bone/10 max-w-2xl">
              <div className="eyebrow mb-4 font-brand tracking-[0.28em] text-bone/55">What we refuse</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-bone/70 font-brand">
                <Refusal>Chemical shortcuts</Refusal>
                <Refusal>Performance-enhancing drugs</Refusal>
                <Refusal>Synthetic stacks</Refusal>
                <Refusal>Proprietary blends</Refusal>
                <Refusal>Fake heritage</Refusal>
                <Refusal>Mass-produced Ayurveda</Refusal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-bone/40 mb-1 font-brand">{label}</div>
      <div className="font-sans font-semibold text-bone text-[15px] leading-tight">{value}</div>
    </div>
  )
}

function Refusal({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-rust">✕</span>
      {children}
    </span>
  )
}
