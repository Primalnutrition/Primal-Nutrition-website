import { useState } from 'react'

/* FAQs aligned to the actual T-REX label and Primal Nutrition brand guide.
   Dosage, ingredients, manufacturing, claims pulled from official docs. */
const faqs = [
  {
    q: 'What exactly is T-Rex?',
    a: "T-Rex is India's first 7-in-1 Natural Liquid — a Strength and Testosterone Booster combining Himalayan Shilajit with six clinically-studied Ayurvedic herbs (Ashwagandha, Arjun Chal, Gokhru, Draksha, Safed Musli, Kath Badam) in a single 500ml hazelnut-flavored liquid. 100% Ayurvedic. No artificial sweetener, non-GMO, no hidden blends, no chemicals, no stimulants, no color or dye.",
  },
  {
    q: 'How do I take it? Dosage?',
    a: 'As printed on the label: 15ml twice daily, mixed with milk or other beverages, as directed by an Ayurvedic physician. Shake well before use. Many of our customers also take a single 10ml shot in the morning sublingual (under the tongue) to make the bottle last a full 50 servings.',
  },
  {
    q: 'Why is it liquid, not capsules?',
    a: 'Shilajit is fully absorbed by the body only in its liquid form. Capsule-form supplements lose 40–60% of their actives to first-pass liver metabolism. Liquid form bypasses this — which is why we chose it. The process is lengthier and costlier, and most manufacturers refuse to do it.',
  },
  {
    q: 'Is this a steroid, hormone, or stimulant?',
    a: 'No. T-Rex is an Ayurvedic Proprietary Medicine. Zero synthetic hormones, prohormones, steroids, or stimulants. Banned-substance-free. Manufacturing License No. AL946M.',
  },
  {
    q: 'When will I feel something?',
    a: 'Most users report sharper morning energy and deeper sleep within the first 7 days. Strength and recovery responses build through weeks 3–8. Free testosterone and stamina shifts become measurable around week 12. The body needs time to recalibrate — this is biology, not magic.',
  },
  {
    q: 'How do I know the Shilajit is real?',
    a: 'Pure Shilajit melts in your hand and becomes sticky. It dissolves completely in warm water or milk to a golden/reddish color in about 5 minutes. It does not burn. It does not dissolve in alcohol. Our Shilajit is collected from the highest points of the Himalayas by local villagers and liquid-extracted using the ancestral process — the only method that delivers full bioavailability.',
  },
  {
    q: 'Where is it manufactured?',
    a: 'Marketed by Primal Nutrition, No. 5, FF, Sec-8 Market, Rama Krishna Puram, New Delhi 110022. Manufactured by Raaj Ayurvedic Pharmacy, B.N. Para PS Bhakti Nagar, District Jalpaiguri 734006, West Bengal. ISO 22000 + GMP + HDR certified facility.',
  },
  {
    q: 'Vegetarian? Allergens?',
    a: '100% vegetarian. Contains almond (Kath Badam) — avoid if you have a tree-nut allergy. Hazelnut flavoring is natural identical, nut-allergen-safe in the formulation. Sodium benzoate used as preservative (20mg per 5ml).',
  },
  {
    q: 'How long does one 500ml bottle last?',
    a: 'At 10ml daily (single AM serving) — 50 days. At the label dose of 15ml twice daily — approximately 16 days. Most users start at one serving daily and adjust under guidance.',
  },
  {
    q: 'Shipping + payment?',
    a: 'Free pan-India shipping. Secure online payments. Cash on delivery available. No-contact shipping standard.',
  },
  {
    q: 'Can I stack T-Rex with other supplements?',
    a: 'Yes. T-Rex is designed to layer with whey, creatine, and pre-workouts. It does not contain stimulants, so no overlap risk. Many users pair it with our Hydra Muscle (creatine + electrolytes) and Vita Peak (multivitamin).',
  },
  {
    q: "I'm over 50. Will this work?",
    a: 'Adaptogenic responses tend to be stronger in men 35+. Best response data sits in the 38–58 range. If you are over 60 or on prescription medication (especially BP, thyroid, or blood-thinners), consult your physician before starting any new supplement.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section className="py-28 relative">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="eyebrow mb-5">Honest Answers</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tightest leading-[1.05] mb-6">
              The questions<br/>
              <span className="italic font-medium text-shimmer">you actually have.</span>
            </h2>
            <p className="text-bone/65 text-lg leading-relaxed mb-6">
              We walk the rough road. We answer the hard ones. Still curious? Message us — a human responds within 4 hours.
            </p>
            <a href="https://wa.me/917838026415" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-amber hover:text-amber-light font-medium text-sm">
              WhatsApp +91-7838026415 →
            </a>
            <a href="mailto:saleshead@primalnutrition.in" className="block mt-2 text-amber hover:text-amber-light font-medium text-sm">
              saleshead@primalnutrition.in →
            </a>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-bone/10">
              {faqs.map((f, i) => (
                <div key={f.q} className="border-b border-bone/10">
                  <button
                    onClick={() => setOpen(open === i ? -1 : i)}
                    className="w-full flex items-center justify-between text-left py-5 group"
                  >
                    <span className={`font-display text-lg lg:text-xl pr-6 transition ${open === i ? 'text-amber-light' : 'text-bone group-hover:text-amber'}`}>{f.q}</span>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full border border-bone/20 flex items-center justify-center transition ${open === i ? 'bg-amber text-bone border-amber rotate-45' : 'text-bone/60 group-hover:border-amber group-hover:text-amber'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${open === i ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="text-bone/70 leading-relaxed text-[15px] max-w-2xl">{f.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
