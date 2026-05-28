import { useState } from 'react'
import PrimalLogo from './PrimalLogo.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function Footer() {
  return (
    <footer className="border-t border-bone/10 pt-20 pb-10 bg-ink relative">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="mb-6">
              <PrimalLogo className="h-16 w-auto" />
            </div>
            <p className="text-bone/60 max-w-md text-[15px] leading-relaxed mb-6">
              India's first 7-in-1 Natural Performance Liquid. We bring Ayurveda into modern sports nutrition — the way our ancestors made it, scientifically validated, free from chemicals.
            </p>
            <p className="text-bone/45 text-sm italic mb-6">
              "The answer always lies in nature, in the food we eat and the places we train."
            </p>
            <SubscribeForm />
            <p className="text-[11px] text-bone/35 mt-3">Get the protocol guide free. Unsubscribe anytime.</p>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <Col title="Shop">
              <a href="#/shop">All Products</a>
              <a href="#/product/trex-liquid">T-Rex Liquid</a>
              <a href="#/product/vita-peak">Vita Peak</a>
              <a href="#/product/hydra-muscle">Hydra Muscle</a>
              <a href="#/stacks">Stacks</a>
            </Col>
            <Col title="Learn">
              <a href="#/shilajit-guide">Shilajit Purity Guide</a>
              <a href="#/product/trex-liquid">Ingredient sourcing</a>
              <a href="#/shop">Adaptogen series</a>
            </Col>
            <Col title="Support">
              <a href="https://wa.me/917838026415">WhatsApp +91-7838026415</a>
              <a href="mailto:salesmanager@primalnutrition.in">salesmanager@primalnutrition.in</a>
              <a href="#/dealer">Become a Dealer</a>
            </Col>
            <Col title="Company">
              <a href="#/shilajit-guide">Manufacturing</a>
              <a href="#/shop">Our Products</a>
              <a href="#/dealer">Wholesale</a>
            </Col>
          </div>
        </div>

        {/* Believe refrain — industrial all-caps treatment */}
        <div className="text-center py-12 border-y border-bone/10 mb-8 bg-ink-800/20">
          <p className="font-display text-3xl lg:text-5xl tracking-tight leading-[1.02] uppercase">
            BELIEVE. <span className="text-bone/45">BELIEVE IN US.</span> <span className="text-gradient-primal">BELIEVE IN OUR INGREDIENTS.</span> <span className="text-bone/45">BELIEVE IN NATURE.</span>
          </p>
          <div className="mt-6 inline-flex items-center gap-6 text-[10px] uppercase tracking-[0.32em] text-bone/40 font-brand font-medium">
            <span>Passion</span><Dot /><span>Quality</span><Dot /><span>Knowledge</span><Dot /><span>Hardwork</span>
          </div>
        </div>

        {/* Compliance bar */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8 text-[11px] text-bone/45 leading-relaxed">
          <div>
            <div className="uppercase tracking-widest text-amber font-semibold mb-2">Marketed by</div>
            <strong className="text-bone/75 font-semibold not-italic">Primal Nutrition</strong><br/>
            No. 5, FF, Sec-8 Market, Rama Krishna Puram,<br/>
            New Delhi 110022<br/>
            <span className="text-bone/30">An Ayurvedic Proprietary Medicine</span>
          </div>
          <div>
            <div className="uppercase tracking-widest text-amber font-semibold mb-2">Manufactured by</div>
            <strong className="text-bone/75 font-semibold not-italic">Raaj Ayurvedic Pharmacy</strong><br/>
            B.N. Para PS Bhakti Nagar, District Jalpaiguri 734006, West Bengal<br/>
            <span className="text-bone/30">Mfg. Lic. No. AL946M</span>
          </div>
        </div>

        {/* Trust bar */}
        <div className="border-t border-bone/10 pt-8 mb-8 flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-bone/40">
          <span>Banned Substance Free</span>
          <Dot />
          <span>ISO 22000</span>
          <Dot />
          <span>GMP Certified</span>
          <Dot />
          <span>HDR</span>
          <Dot />
          <span>Made in India</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-bone/10">
          <div className="text-[11px] text-bone/35">
            © {new Date().getFullYear()} Primal Nutrition · A unit of Jiyo Ayurveda Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-5 text-[11px] text-bone/40">
            <a href="#" className="hover:text-amber">Privacy</a>
            <a href="#" className="hover:text-amber">Terms</a>
            <a href="#" className="hover:text-amber">Shipping</a>
            <a href="#" className="hover:text-amber">Refunds</a>
          </div>
        </div>

        <p className="text-[10px] text-bone/30 max-w-3xl mx-auto mt-8 text-center leading-relaxed">
          T-Rex is an Ayurvedic Proprietary Medicine. As directed by the physician. Best before 2 years from manufacture. Keep in cool & dry place. Shake well before use. Do not use if the seal is broken. Not for use by persons under 18. Consult a physician before starting any supplement, particularly if you are on medication or have a pre-existing condition.
        </p>
      </div>
    </footer>
  )
}

function Col({ title, children }) {
  const items = Array.isArray(children) ? children : [children]
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-amber mb-4">{title}</div>
      <div className="flex flex-col gap-2.5 text-[14px] text-bone/60">
        {items.map((c, i) => (
          <a key={i} href={c.props.href} className="hover:text-amber transition">
            {c.props.children}
          </a>
        ))}
      </div>
    </div>
  )
}

function Dot() { return <span className="w-1 h-1 rounded-full bg-bone/20" /> }

function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || status === 'sending') return
    setStatus('sending')
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'footer' }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setMessage(body.message || 'Could not subscribe. Try again.')
        return
      }
      setStatus('success')
      setMessage(body.alreadySubscribed
        ? "You're already in. Check your inbox for the protocol guide."
        : "You're in. Check your inbox for the welcome drop.")
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div>
      <form className="flex gap-2 max-w-md" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={status === 'sending'}
          placeholder="your@email.com"
          className="flex-1 bg-ink-800 border border-bone/10 rounded-full px-4 py-3 text-sm placeholder:text-bone/30 focus:outline-none focus:border-amber disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'sending' || !email.trim()}
          className="bg-amber text-bone font-semibold px-5 py-3 rounded-full text-sm hover:bg-amber-light transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending…' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p className={`text-[12px] mt-2 ${status === 'success' ? 'text-amber' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
