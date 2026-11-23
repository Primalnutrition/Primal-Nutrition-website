import { useState } from 'react'
import { usePage } from '../context/RouterContext.jsx'
import Footer from './Footer.jsx'
import HomeReels from './HomeReels.jsx'
import { api } from '../lib/api.js'

/* T-REX Athletes: community page for everyday athletes who create content.
   Terms are shared privately after review. */
const SPORTS = ['Gym / Strength', 'Running', 'Marathon', 'Cycling', 'CrossFit / HYROX', 'Calisthenics', 'Combat sports', 'Other sport']

const PILLARS = [
  ['Show up.', 'Consistency over everything. The quiet reps add up.'],
  ['Share the grind.', 'Your routine might be the push someone else needed today.'],
  ['Rise together.', 'A community of athletes who lift each other, on and off the field.'],
]
const GRINDS = ['Gym', 'Running', 'Marathon', 'Cycling', 'CrossFit / HYROX', 'Calisthenics', 'Combat sports']
const STEPS = [
  ['01', 'Tell us your story', 'Who you are, how you train, where you share it.'],
  ['02', 'We get to know you', 'Our team reaches out personally on WhatsApp or email.'],
  ['03', 'Train as one', 'Welcome to T-REX Athletes.'],
]

const EMPTY = {
  name: '', handle: '', email: '', phone: '', sport: '', followers: '',
  addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', whyUs: '', website: '',
}

export default function AthletesPage() {
  const { navigate } = usePage()
  const [form, setForm] = useState(EMPTY)
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState({ sending: false, done: false, error: '' })

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!consent) { setState({ ...state, error: 'Please accept the terms to apply.' }); return }
    setState({ sending: true, done: false, error: '' })
    try {
      await api.post('/api/creators/apply', { ...form, phone: form.phone.replace(/\D/g, '').slice(-10), consent })
      setState({ sending: false, done: true, error: '' })
      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      setState({ sending: false, done: false, error: err.message || 'Something went wrong. Please try again.' })
    }
  }

  return (
    <>
      <section className="relative pt-28 pb-14 gradient-amber grain border-b border-bone/10 overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-amber/10 blur-[140px] pointer-events-none" />
        <div className="container-x relative">
          <nav className="mb-8 text-xs uppercase tracking-widest text-bone/45 flex items-center gap-2 font-brand">
            <button onClick={() => navigate('home')} className="hover:text-amber transition">Home</button>
            <span>/</span>
            <span className="text-bone/80">T-REX Athletes</span>
          </nav>
          <div className="eyebrow mb-5 font-brand tracking-[0.28em]">
            <span className="inline-block w-2 h-2 rounded-full bg-amber mr-3 align-middle animate-shimmer" />
            Gym · Running · Cycling · Marathon · Sport
          </div>
          <h1 className="font-display text-5xl lg:text-7xl tracking-tight leading-[0.95] mb-5 uppercase">
            BECOME A<br/>
            <span className="text-shimmer">T-REX ATHLETE.</span>
          </h1>
          <p className="text-lg text-bone/70 max-w-2xl leading-relaxed">
            For the ones who show up before sunrise, chase one more kilometre and never skip the last set. T-REX Athletes is a community of everyday men who train for themselves — and share it to push others forward.
          </p>
          <button
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="btn-primary mt-8"
          >Join the pack ↓</button>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="max-w-3xl mb-10">
            <div className="eyebrow mb-5">Why we exist</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-6">
              Strength isn't built<br /><span className="text-shimmer">on stage.</span>
            </h2>
            <p className="text-lg text-bone/70 leading-relaxed">
              It's built at 5 AM in a half-empty gym. On empty roads before the city wakes up. In the last kilometre when your legs say stop. We started T-REX for the men who do the work when nobody's watching — and we want to stand beside the ones who share that journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
            {PILLARS.map(([t, b]) => (
              <div key={t} className="p-6 rounded-2xl border border-amber/20 bg-gradient-to-br from-amber/[0.06] via-ink-800/60 to-ink">
                <h3 className="font-display text-2xl mb-2">{t}</h3>
                <p className="text-bone/65 text-[15px] leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator videos */}
      <HomeReels
        ids={['customer-ad', 'gym-ritual', 'match-day']}
        eyebrow="Made by our athletes"
        title={['Real athletes.', 'Real routines.']}
        hideChips
      />

      {/* Every kind of grind */}
      <section className="py-16 lg:py-24 bg-ink-800/30">
        <div className="container-x max-w-3xl">
          <div className="eyebrow mb-5">For every athlete</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-6">
            Every kind of grind.<br /><span className="text-shimmer">One pack.</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {GRINDS.map((c) => (
              <span key={c} className="px-4 py-2 rounded-full border border-amber/30 bg-amber/5 text-[11px] uppercase tracking-widest text-bone/85 font-brand font-semibold">
                <span className="text-amber mr-1.5">✓</span>{c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-5">How it works</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              Three steps to<br /><span className="text-shimmer">the pack.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
            {STEPS.map(([n, t, b]) => (
              <div key={n} className="p-6 rounded-2xl border border-amber/20 bg-gradient-to-br from-amber/[0.06] via-ink-800/60 to-ink">
                <div className="font-display text-5xl text-amber/80 leading-none mb-3">{n}</div>
                <h3 className="font-display text-xl mb-2">{t}</h3>
                <p className="text-bone/65 text-[15px] leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="py-16 lg:py-24 scroll-mt-24">
        <div className="container-x max-w-3xl">
          <div className="mb-8">
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-3">
              Tell us <span className="text-shimmer">your story.</span>
            </h2>
            <p className="text-bone/65 text-lg">Every athlete in the pack started with a message like this.</p>
          </div>
          {state.done ? (
            <div className="bg-ink-800/40 border border-amber/30 rounded-3xl p-8 lg:p-10 text-center">
              <div className="font-display text-4xl text-shimmer mb-4">Application received.</div>
              <p className="text-bone/70 text-lg leading-relaxed mb-8">
                Thanks, {form.name.split(' ')[0]}. We'll get to know @{form.handle.replace(/^@/, '')} and reach out personally on WhatsApp or email.
              </p>
              <button onClick={() => navigate('product', { id: 'trex-liquid' })} className="btn-primary">See T-REX →</button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-ink-800/40 border border-bone/10 rounded-3xl p-8 lg:p-10">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" required>
                <input type="text" required value={form.name} onChange={update('name')} className="form-input" placeholder="Rohan Sharma" />
              </Field>
              <Field label="Instagram Handle" required>
                <input type="text" required value={form.handle} onChange={update('handle')} className="form-input" placeholder="@rohan.lifts" autoCapitalize="none" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Your Sport" required>
                <select required value={form.sport} onChange={update('sport')} className="form-input">
                  <option value="">Select...</option>
                  {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Instagram Followers" required>
                <input type="number" required min="0" inputMode="numeric" value={form.followers} onChange={update('followers')} className="form-input" placeholder="5000" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="WhatsApp Number" required>
                <input type="tel" required value={form.phone} onChange={update('phone')} className="form-input" placeholder="90000 00000" />
              </Field>
              <Field label="Email ID" required>
                <input type="email" required value={form.email} onChange={update('email')} className="form-input" placeholder="rohan@gmail.com" />
              </Field>
            </div>

            <Field label="Delivery Address" required>
              <input type="text" required value={form.addressLine1} onChange={update('addressLine1')} className="form-input" placeholder="House / flat, street, area" />
            </Field>
            <input type="text" value={form.addressLine2} onChange={update('addressLine2')} className="form-input" placeholder="Landmark (optional)" />

            <div className="grid sm:grid-cols-3 gap-5">
              <Field label="City" required>
                <input type="text" required value={form.city} onChange={update('city')} className="form-input" placeholder="Pune" />
              </Field>
              <Field label="State" required>
                <input type="text" required value={form.state} onChange={update('state')} className="form-input" placeholder="Maharashtra" />
              </Field>
              <Field label="Pincode" required>
                <input type="text" required inputMode="numeric" maxLength={6} value={form.pincode} onChange={update('pincode')} className="form-input" placeholder="411001" />
              </Field>
            </div>

            <Field label="Your story (optional)">
              <textarea rows={3} value={form.whyUs} onChange={update('whyUs')} className="form-input" placeholder="How you train, what drives you, what you share." />
            </Field>

            {/* Honeypot: hidden from people, bots fill it */}
            <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} className="hidden" aria-hidden />

            <label className="flex gap-3 items-start text-sm text-bone/65 leading-relaxed cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-[rgb(var(--c-amber))]" />
              <span>
                I'm happy for Primal Nutrition to contact me about T-REX Athletes and to reshare content I create featuring T-REX, with credit to me.
              </span>
            </label>

            {state.error && <p className="text-sm text-red-400">{state.error}</p>}

            <button type="submit" disabled={state.sending} className="btn-primary w-full !py-4 text-base disabled:opacity-60">
              {state.sending ? 'Sending…' : 'Join the pack'}
            </button>

            <p className="text-[11px] uppercase tracking-widest text-bone/40 text-center font-brand">
              We read every story · Our team replies personally
            </p>
          </form>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        .form-input {
          width: 100%;
          background: rgb(var(--c-ink));
          border: 1px solid rgb(var(--c-bone) / 0.12);
          border-radius: 12px;
          padding: 12px 14px;
          color: rgb(var(--c-bone));
          font-size: 15px;
          transition: border-color 0.2s;
        }
        .form-input:focus { outline: none; border-color: rgb(var(--c-amber)); }
        .form-input::placeholder { color: rgb(var(--c-bone) / 0.3); }
        select.form-input { appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23F5F1E8' fill-opacity='0.5'><path d='M5 7l5 6 5-6H5z'/></svg>"); background-repeat: no-repeat; background-position: right 12px center; }
      `}</style>
    </>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.22em] font-brand font-semibold text-bone/65 mb-2">
        {label} {required && <span className="text-amber">*</span>}
      </span>
      {children}
    </label>
  )
}
