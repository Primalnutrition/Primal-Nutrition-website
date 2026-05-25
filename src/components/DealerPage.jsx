import { useState } from 'react'
import { usePage } from '../context/RouterContext.jsx'
import Footer from './Footer.jsx'

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
            Carrying Primal in your gym, store, or distribution network? Apply below. We respond within 24 hours via WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
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
