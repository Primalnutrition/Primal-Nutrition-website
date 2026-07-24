import { useState } from 'react'
import PrimalLogo from './PrimalLogo.jsx'
import { usePage } from '../context/RouterContext.jsx'

const PRODUCTS = [
  { id: 'trex-liquid',      name: 'T-Rex Strength & Testosterone Booster', pack: '500 ml liquid' },
  { id: 'trex-cordyceps',   name: 'Primal Nutrition Cordyceps Capsules',   pack: '60 capsules' },
  { id: 'trex-royal-jelly', name: 'Primal Nutrition Royal Jelly Capsules', pack: '60 capsules' },
  { id: 'trex-maca',        name: 'Primal Nutrition Black Maca Capsules',  pack: '60 capsules' },
  { id: 'trex-ginseng',     name: 'Primal Nutrition Korean Panax Ginseng Capsules', pack: '60 capsules' },
  { id: 'trex-tongkat',     name: 'Primal Nutrition Tongkat Ali Capsules', pack: '60 capsules' },
  { id: 'trex-liver',       name: 'Primal Nutrition Liver Detox+ Capsules', pack: '60 capsules' },
]

const COMPLIANCE = {
  mfgLic:      'AL946M',
  fssaiLic:    '13326998000382',
  marketedBy:  'Primal Nutrition (a unit of Jiyo Ayurveda Pvt. Ltd.), No.5, FF, Sec-8 Mkt., Rama Krishna Puram, New Delhi – 110022',
  mfgBy:       'Raaj Ayurvedic Pharmacy, B.N. Para PS Bhakti Nagar, District Jalpaiguri – 734006 (West Bengal)',
  email:       'saleshead@primalnutrition.in',
  phone1:      '+91 78380 26415',
  phone2:      '+91 84475 15161',
}

/* ── Field row ──────────────────────────────────────────────────────────── */
function Field({ label, value, mono }) {
  return (
    <div className="py-3 border-b border-bone/8 last:border-0">
      <div className="text-[10px] font-bold uppercase tracking-widest text-bone/40 mb-1">{label}</div>
      <div className={`text-sm text-bone/85 leading-snug ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}

/* ── Detail view (compliance block) ──────────────────────────────────────── */
function ComplianceBlock({ product, onBack }) {
  return (
    <div className="min-h-screen bg-ink text-bone flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-ink/90 backdrop-blur-xl border-b border-bone/8 flex items-center gap-3 px-4 py-3">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-bone/15 text-bone/50 hover:text-bone transition"
          aria-label="Back"
        >
          ←
        </button>
        <PrimalLogo className="h-7 w-auto" />
        <span className="text-[10px] text-bone/35 uppercase tracking-widest ml-auto">Product Info</span>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
        {/* Product name */}
        <div className="border border-amber/20 bg-amber/5 rounded-2xl p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber mb-2">Selected Product</div>
          <div className="text-bone font-semibold text-base leading-snug">{product.name}</div>
          <div className="text-bone/45 text-xs mt-1">{product.pack}</div>
        </div>

        {/* Compliance block */}
        <div className="bg-bone/3 border border-bone/10 rounded-2xl px-4 pt-2 pb-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-bone/35 py-3 border-b border-bone/8 mb-1">
            Manufacturer & Regulatory Info
          </div>
          <Field label="Mfg. Licence No." value={COMPLIANCE.mfgLic} mono />
          <Field label="FSSAI Licence No." value={COMPLIANCE.fssaiLic} mono />
          <Field label="Marketed By" value={COMPLIANCE.marketedBy} />
          <Field label="Manufactured By" value={COMPLIANCE.mfgBy} />
        </div>

        {/* Customer care */}
        <div className="bg-bone/3 border border-bone/10 rounded-2xl px-4 pt-2 pb-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-bone/35 py-3 border-b border-bone/8 mb-1">
            Customer Care
          </div>
          <div className="py-3 space-y-2">
            <a
              href={`mailto:${COMPLIANCE.email}`}
              className="flex items-center gap-2 text-amber text-sm hover:underline"
            >
              <span className="text-base">✉</span> {COMPLIANCE.email}
            </a>
            <a href={`tel:${COMPLIANCE.phone1.replace(/\s/g, '')}`} className="flex items-center gap-2 text-bone/70 text-sm hover:text-amber transition">
              <span className="text-base">📞</span> {COMPLIANCE.phone1}
            </a>
            <a href={`tel:${COMPLIANCE.phone2.replace(/\s/g, '')}`} className="flex items-center gap-2 text-bone/70 text-sm hover:text-amber transition">
              <span className="text-base">📞</span> {COMPLIANCE.phone2}
            </a>
          </div>
        </div>

        {/* Trust note */}
        <p className="text-center text-bone/30 text-[11px] leading-relaxed px-2">
          This page is only accessible via the QR code printed on the original Primal Nutrition product label.
          If you received this product without a label QR, please contact customer care.
        </p>

        {/* Shop CTA */}
        <div className="pb-6">
          <a
            href="https://primalnutrition.in"
            className="block w-full text-center py-3 rounded-xl border border-bone/15 text-bone/60 text-sm hover:border-amber/30 hover:text-bone transition"
          >
            Visit primalnutrition.in →
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Product picker (landing view) ────────────────────────────────────────── */
export default function ProductInfoPage({ productId }) {
  const [selected, setSelected] = useState(
    productId ? PRODUCTS.find(p => p.id === productId) ?? null : null
  )

  if (selected) {
    return <ComplianceBlock product={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="min-h-screen bg-ink text-bone flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-ink/90 backdrop-blur-xl border-b border-bone/8 flex items-center justify-between px-4 py-3">
        <PrimalLogo className="h-8 w-auto" />
        <span className="text-[10px] text-bone/35 uppercase tracking-widest">Label · Product Info</span>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        {/* Hero */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            <span className="text-amber text-[10px] font-bold uppercase tracking-widest">QR Verified · Authentic Label</span>
          </div>
          <h1 className="font-display text-2xl font-black tracking-tight leading-tight mb-2">
            Which product are you holding?
          </h1>
          <p className="text-bone/50 text-sm">
            Tap your product below to see manufacturer details, licence numbers, and customer care.
          </p>
        </div>

        {/* Product list */}
        <div className="space-y-2">
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="w-full text-left flex items-center justify-between gap-3 px-4 py-4 rounded-2xl border border-bone/10 bg-bone/2 hover:border-amber/30 hover:bg-amber/5 transition-all"
            >
              <div className="min-w-0">
                <div className="text-bone text-sm font-semibold leading-snug">{p.name}</div>
                <div className="text-bone/40 text-xs mt-0.5">{p.pack}</div>
              </div>
              <span className="text-bone/25 text-sm shrink-0">›</span>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-bone/25 text-[11px] leading-relaxed">
            Primal Nutrition · Jiyo Ayurveda Pvt. Ltd.<br />
            primalnutrition.in · saleshead@primalnutrition.in
          </p>
        </div>
      </div>
    </div>
  )
}
