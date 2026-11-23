import { useState } from 'react'
import Picture from './Picture.jsx'
import { BENEFIT_ICONS } from '../lib/benefitIcons.jsx'

/* Problem story for a PDP: a hook, a "day running on low" timeline told in the
   reader's own inner voice, and a tap-to-check grid of common signs.
   Everything is driven by pdp.problem (see trex-liquid in data/products.js).
   The self-check is local UI state only — nothing is stored or sent. */
export default function ProblemStory({ problem, onCta }) {
  const [picked, setPicked] = useState(() => new Set())
  const toggle = (i) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  const title = Array.isArray(problem.title) ? problem.title : [problem.title]
  const count = picked.size
  const r = problem.result || {}
  const message =
    count === 0 ? problem.signsHint
    : count < 3 ? r.few
    : (r.many || '').replace('{n}', count)

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-ink to-ink-800/30">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(225,29,46,0.12),transparent_65%)] pointer-events-none" />
      <div className="container-x relative">

        {/* ── Hook ── */}
        <div className={problem.hookImage ? 'grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20' : 'max-w-3xl mb-14'}>
          <div>
            <div className="eyebrow mb-5">{problem.eyebrow || 'The Problem'}</div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold tracking-tightest leading-[1.02] mb-6">
              {title[0]}
              {title[1] && (<><br /><span className="text-amber">{title[1]}</span></>)}
            </h2>
            <p className="text-lg lg:text-xl text-bone/70 leading-relaxed">{problem.body}</p>
          </div>
          {problem.hookImage && (
            <div className="rounded-3xl overflow-hidden border border-bone/10 max-w-md lg:max-w-none mx-auto w-full">
              <Picture
                src={problem.hookImage}
                alt={problem.hookImageAlt || ''}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          )}
        </div>

        {/* ── A day running on low ── */}
        {problem.day?.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-20">
            {problem.image && (
              <div className="rounded-3xl overflow-hidden border border-bone/10 lg:sticky lg:top-24">
                <Picture
                  src={problem.image}
                  alt={problem.imageAlt || ''}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            )}
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-amber font-brand font-bold mb-7">
                {problem.dayTitle}
              </div>
              <ol className="relative border-l border-bone/15 ml-1.5 space-y-8">
                {problem.day.map((d) => (
                  <li key={d.time} className="relative pl-7">
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-amber ring-4 ring-ink" aria-hidden />
                    <div className="text-[11px] font-brand tracking-[0.2em] uppercase text-bone/45 mb-2">{d.time}</div>
                    <div className="inline-block rounded-2xl rounded-tl-sm bg-ink-800 border border-bone/10 px-4 py-2.5 font-display text-xl lg:text-2xl font-bold text-bone mb-2">
                      {d.line}
                    </div>
                    <p className="text-bone/60 text-[15px] leading-relaxed">{d.b}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* ── Common signs: tap to self-check ── */}
        {problem.signs?.length > 0 && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-6">
              <h3 className="font-display text-3xl lg:text-4xl font-bold tracking-tightest">{problem.signsTitle}</h3>
              <p aria-live="polite" className={`text-sm font-semibold ${count ? 'text-amber' : 'text-bone/50'}`}>
                {message}
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {problem.signs.map((s, i) => {
                const on = picked.has(i)
                return (
                  <button
                    type="button"
                    key={s.title}
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    className={`relative text-left p-4 lg:p-5 rounded-2xl border transition ${
                      on ? 'border-amber bg-amber/10' : 'border-bone/10 bg-ink-800/50 hover:border-bone/30'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center transition ${
                        on ? 'bg-amber border-amber' : 'border-bone/25'
                      }`}
                    >
                      {on && (
                        <svg viewBox="0 0 16 16" className="w-3 h-3 text-white" fill="none">
                          <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-amber mb-3" aria-hidden>
                      {BENEFIT_ICONS[s.icon]}
                    </svg>
                    <div className="font-display font-bold text-lg leading-tight mb-1.5 pr-6">{s.title}</div>
                    <div className="text-[13px] text-bone/60 italic leading-snug">“{s.quote}”</div>
                  </button>
                )
              })}
            </div>
            {problem.note && (
              <p className="mt-5 text-[12px] text-bone/40 leading-relaxed max-w-3xl">{problem.note}</p>
            )}
          </div>
        )}

        {/* ── Visual pause before the turn to the answer ── */}
        {problem.bandImage && (
          <div className="mt-14 rounded-3xl overflow-hidden border border-bone/10">
            <Picture
              src={problem.bandImage}
              alt={problem.bandImageAlt || ''}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/3] sm:aspect-[21/9] object-cover object-center"
            />
          </div>
        )}

        {/* ── Bridge to the solution ── */}
        {problem.bridge && (
          <div className="mt-14 rounded-3xl border border-amber/30 bg-gradient-to-r from-amber/10 to-transparent p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="font-display text-2xl lg:text-3xl font-bold tracking-tightest leading-tight">{problem.bridge}</div>
            {onCta && (
              <button type="button" onClick={onCta} className="btn-primary whitespace-nowrap">
                {problem.cta || 'See how it helps'} ↓
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
