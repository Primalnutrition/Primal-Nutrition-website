import { useState } from 'react'
import { usePage } from '../context/RouterContext.jsx'
import Footer from './Footer.jsx'
import Picture from './Picture.jsx'
import HomeReels from './HomeReels.jsx'
import IndiaStateMap from './IndiaStateMap.jsx'
import { BENEFIT_ICONS } from '../lib/benefitIcons.jsx'

const STATS = [
  ['1000+', 'Stores & retailers'],
  ['28', 'States across India'],
  ['AL946M', 'Licensed Ayurvedic manufacturer'],
  ['Every batch', 'Lab tested'],
]
const WHY = [
  { icon: 'shield', title: 'Licensed & lab tested', body: 'Made under Mfg. Lic. AL946M, with independent lab testing on every batch.' },
  { icon: 'leaf', title: 'A full rare-herb range', body: 'Eight products: T-REX, Tongkat Ali, Black Maca, Korean Ginseng, Cordyceps and more.' },
  { icon: 'peak', title: 'Trusted nationwide', body: '1000+ retailers, gyms and distributors across all 28 states stock Primal.' },
  { icon: 'user', title: 'Pan-India sales team', body: 'A dedicated sales team supports our partners across India, from the first order to every re-stock.' },
]
const STEPS = [
  ['01', 'Apply below', 'Fill in the short form. It opens on WhatsApp.'],
  ['02', 'We call you', 'Our team replies within 24 hours.'],
  ['03', 'Your first order ships', 'Stock your shelves and start selling.'],
]

function IconTile({ name }) {
  return (
    <span className="w-12 h-12 rounded-xl bg-amber/15 border border-amber/30 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-amber" aria-hidden>
        {BENEFIT_ICONS[name]}
      </svg>
    </span>
  )
}

export default function DealerPage() {
  const { navigate } = usePage()
  const [form, setForm] = useState({
    name: '', store: '', location: '', phone: '', email: '', volume: '', type: 'Retailer',
  })

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = `New Dealer Application

Name: ${form.name}
Store: ${form.store}
Location: ${form.location}
Phone: ${form.phone}
Email: ${form.email}
Monthly Purchase Volume: ${form.volume}
Business Type: ${form.type}`
    const url = `https://wa.me/917838026415?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <>
      <section className="relative pt-28 pb-14 gradient-amber grain border-b border-bone/10 overflow-hidden">
        <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-amber/10 blur-[140px] pointer-events-none" />
        <div className="container-x relative">
          <nav className="mb-8 text-xs uppercase tracking-widest text-bone/45 flex items-center gap-2 font-brand">
            <button onClick={() => navigate('home')} className="hover:text-amber transition">Home</button>
            <span>/</span>
            <span className="text-bone/80">Become a Dealer</span>
          </nav>
          <div className="eyebrow mb-5 font-brand tracking-[0.28em]">
            <span className="inline-block w-2 h-2 rounded-full bg-amber mr-3 align-middle animate-shimmer" />
            Wholesale · Retail · Gym · Distribution
          </div>
          <h1 className="font-display text-5xl lg:text-7xl tracking-tight leading-[0.95] mb-5 uppercase">
            BECOME A<br/>
            <span className="text-shimmer">PRIMAL DEALER.</span>
          </h1>
          <p className="text-lg text-bone/70 max-w-2xl leading-relaxed">
            Join a nationwide network of retailers, gyms and distributors who trust Primal. Apply below and our partnerships team will reach out on WhatsApp within 24 hours.
          </p>
          <button
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="btn-primary mt-8"
          >Apply now ↓</button>
        </div>
      </section>


      {/* Network numbers */}
      <section className="py-10 border-b border-bone/10">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(([n, l]) => (
            <div key={l} className="p-5 rounded-2xl border border-amber/20 bg-gradient-to-br from-amber/[0.06] via-ink-800/60 to-ink text-center">
              <div className="font-display font-bold text-3xl lg:text-4xl text-shimmer leading-none mb-2">{n}</div>
              <div className="text-[11px] uppercase tracking-widest text-bone/60 font-brand">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="py-16 lg:py-24">
        <div className="container-x grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="max-w-lg">
            <div className="eyebrow mb-5">Our network</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-6">
              Stocked across<br /><span className="text-shimmer">India.</span>
            </h2>
            <p className="text-lg text-bone/70 leading-relaxed mb-6">
              1000+ gyms, supplement stores and retailers across all 28 states stock Primal.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Retailers', 'Gyms', 'Distributors'].map((c) => (
                <span key={c} className="px-4 py-2 rounded-full border border-amber/30 bg-amber/5 text-[11px] uppercase tracking-widest text-bone/85 font-brand font-semibold">
                  <span className="text-amber mr-1.5">✓</span>{c}
                </span>
              ))}
            </div>
          </div>
          <IndiaStateMap />
        </div>
      </section>

      {/* Store photos */}
      <section className="py-16 lg:py-24 bg-ink-800/30">
        <div className="container-x">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-5">From our retail partners</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              Trusted on<br /><span className="text-shimmer">store shelves.</span>
            </h2>
          </div>
          <div className="columns-2 lg:columns-3 gap-3 lg:gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="mb-3 lg:mb-4 break-inside-avoid rounded-2xl overflow-hidden">
                <Picture src={`/dealer/store-${n}.jpg`} alt="Primal T-REX at a partner store" loading="lazy" decoding="async" className="w-full h-auto block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store videos */}
      <HomeReels
        ids={['dealer-1', 'dealer-2', 'dealer-3', 'dealer-4', 'dealer-5', 'dealer-6', 'dealer-7']}
        eyebrow="In stores"
        title={['Primal on', 'the shop floor.']}
        hideChips
      />

      {/* Why stock Primal */}
      <section className="py-16 lg:py-24 bg-ink-800/30">
        <div className="container-x">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-5">Why partners choose Primal</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
              Trusted across India.<br /><span className="text-shimmer">Earned shelf by shelf.</span>
            </h2>
            <p className="text-lg text-bone/70 leading-relaxed mt-4">
              Retailers, distributors, gyms and customers across India trust Primal, and our partners keep growing with us.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {WHY.map((w) => (
              <div key={w.title} className="p-6 rounded-2xl border border-bone/10 bg-ink-800/60">
                <IconTile name={w.icon} />
                <h3 className="font-display text-xl mt-4 mb-2">{w.title}</h3>
                <p className="text-bone/65 text-[15px] leading-relaxed">{w.body}</p>
              </div>
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
              Three steps to<br /><span className="text-shimmer">your first order.</span>
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
          <form onSubmit={handleSubmit} className="space-y-6 bg-ink-800/40 border border-bone/10 rounded-3xl p-8 lg:p-10">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full Name" required>
                <input type="text" required value={form.name} onChange={update('name')} className="form-input" placeholder="Raj Verma" />
              </Field>
              <Field label="Store / Business Name" required>
                <input type="text" required value={form.store} onChange={update('store')} className="form-input" placeholder="Verma Health Mart" />
              </Field>
            </div>

            <Field label="Location (City + State)" required>
              <input type="text" required value={form.location} onChange={update('location')} className="form-input" placeholder="Mumbai, Maharashtra" />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Phone Number" required>
                <input type="tel" required value={form.phone} onChange={update('phone')} className="form-input" placeholder="+91 90000 00000" />
              </Field>
              <Field label="Email ID" required>
                <input type="email" required value={form.email} onChange={update('email')} className="form-input" placeholder="raj@verma.com" />
              </Field>
            </div>

            <Field label="Monthly Purchase Volume (units)" required>
              <select required value={form.volume} onChange={update('volume')} className="form-input">
                <option value="">Select range...</option>
                <option value="20-50 bottles">20-50 bottles</option>
                <option value="50-100 bottles">50-100 bottles</option>
                <option value="100-250 bottles">100-250 bottles</option>
                <option value="250-500 bottles">250-500 bottles</option>
                <option value="500+ bottles">500+ bottles</option>
              </select>
            </Field>

            <Field label="Business Type" required>
              <div className="grid grid-cols-3 gap-2">
                {['Retailer', 'Gym', 'Distributor'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`px-4 py-3 rounded-xl border text-sm font-semibold transition ${
                      form.type === t
                        ? 'border-amber bg-amber/10 text-bone'
                        : 'border-bone/15 text-bone/65 hover:border-bone/30 hover:text-bone'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <button type="submit" className="btn-primary w-full !py-4 text-base">
              Submit Application — Continue on WhatsApp
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/></svg>
            </button>

            <p className="text-[11px] uppercase tracking-widest text-bone/40 text-center font-brand">
              Your application will open WhatsApp · We typically respond within 24 hours
            </p>
          </form>
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
