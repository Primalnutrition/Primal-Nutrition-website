import { useState } from 'react'
import { usePage } from '../context/RouterContext.jsx'
import Footer from './Footer.jsx'
import HomeReels from './HomeReels.jsx'
import { api } from '../lib/api.js'

/* T-REX Athletes: barter program for small fitness creators.
   We send a free bottle; they post honest content about their routine. */
const SPORTS = ['Gym / Strength', 'Running', 'Marathon', 'Cycling', 'CrossFit / HYROX', 'Calisthenics', 'Combat sports', 'Other sport']

const GET = [
  ['Free T-REX', 'A full 500 ml bottle of T-REX, shipped free to your door.'],
  ['Featured on our page', 'The best videos are reshared on @primalnutritiontrex, credited to you.'],
  ['Long-term partnership', 'Creators whose content performs can join our paid partner roster.'],
]
const GIVE = [
  ['1 Reel', 'Your real routine with T-REX: training, running, riding, match day.'],
  ['2 Stories', 'Unboxing or your first shot, tagging @primalnutritiontrex.'],
  ['Within 14 days', 'Posted within 14 days of delivery, labelled as a paid partnership.'],
]
const STEPS = [
  ['01', 'Apply below', 'Two minutes. Tell us about your sport and your page.'],
  ['02', 'We review', 'Our team checks your profile and confirms on WhatsApp or email.'],
  ['03', 'T-REX ships', 'Your bottle arrives. Train, create, tag us.'],
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
            You train hard and share it. We send you T-REX free. Post your real routine with it and grow with a brand that backs everyday athletes.
          </p>
          <button
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="btn-primary mt-8"
          >Apply now ↓</button>
        </div>
      </section>

      {/* What you get / what we ask */}
      <section className="py-16 lg:py-24">
        <div className="container-x grid lg:grid-cols-2 gap-10 lg:gap-16">
          <Block eyebrow="What you get" title={['Free T-REX,', 'shipped to you.']} items={GET} />
          <Block eyebrow="What we ask" title={['Real content,', 'your way.']} items={GIVE} />
        </div>
      </section>

      {/* Creator videos */}
      <HomeReels
        ids={['customer-ad', 'gym-ritual', 'match-day']}
        eyebrow="Made by our athletes"
        title={['Real athletes.', 'Real routines.']}
        hideChips
      />

      {/* Who it's for */}
      <section className="py-16 lg:py-24 bg-ink-800/30">
        <div className="container-x max-w-3xl">
          <div className="eyebrow mb-5">Who we're looking for</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-6">
            Everyday athletes.<br /><span className="text-shimmer">Not just big pages.</span>
          </h2>
          <ul className="space-y-3 text-bone/75 text-[17px] leading-relaxed">
            {[
              'Men who post gym, running, cycling, marathon or sports content',
              'Public Instagram account with 2,000+ followers',
              'Posting regularly, with real engagement from your audience',
              'Based in India',
            ].map((t) => (
              <li key={t} className="flex gap-3"><span className="text-amber mt-0.5">✓</span><span>{t}</span></li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-24">
        <div className="container-x">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-5">How it works</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              Three steps to<br /><span className="text-shimmer">your first bottle.</span>
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
          {state.done ? (
            <div className="bg-ink-800/40 border border-amber/30 rounded-3xl p-8 lg:p-10 text-center">
              <div className="font-display text-4xl text-shimmer mb-4">Application received.</div>
              <p className="text-bone/70 text-lg leading-relaxed mb-8">
                Thanks, {form.name.split(' ')[0]}. Our team will review @{form.handle.replace(/^@/, '')} and get back to you on WhatsApp or email.
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

            <Field label="Why T-REX? (optional)">
              <textarea rows={3} value={form.whyUs} onChange={update('whyUs')} className="form-input" placeholder="Tell us about your training and your page." />
            </Field>

            {/* Honeypot: hidden from people, bots fill it */}
            <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} className="hidden" aria-hidden />

            <label className="flex gap-3 items-start text-sm text-bone/65 leading-relaxed cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-[rgb(var(--c-amber))]" />
              <span>
                If selected, I'll post 1 Reel and 2 Stories within 14 days of delivery, label them as a paid partnership, and
                Primal Nutrition may reshare my content and use it in its ads with credit to me.
              </span>
            </label>

            {state.error && <p className="text-sm text-red-400">{state.error}</p>}

            <button type="submit" disabled={state.sending} className="btn-primary w-full !py-4 text-base disabled:opacity-60">
              {state.sending ? 'Sending…' : 'Apply to T-REX Athletes'}
            </button>

            <p className="text-[11px] uppercase tracking-widest text-bone/40 text-center font-brand">
              Limited spots each month · We reply on WhatsApp or email
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

function Block({ eyebrow, title, items }) {
  return (
    <div>
      <div className="eyebrow mb-5">{eyebrow}</div>
      <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-8">
        {title[0]}<br /><span className="text-shimmer">{title[1]}</span>
      </h2>
      <div className="space-y-3">
        {items.map(([t, b]) => (
          <div key={t} className="p-5 rounded-2xl border border-bone/10 bg-ink-800/60">
            <h3 className="font-display text-xl mb-1">{t}</h3>
            <p className="text-bone/65 text-[15px] leading-relaxed">{b}</p>
          </div>
        ))}
      </div>
    </div>
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
