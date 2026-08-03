/* --------------------------------------------------------------------------
   PRIMAL — Product catalog
   Each product carries:
     • Storefront fields (name, variants, pricing, visuals)
     • McKinsey 1-pager (who/pain/proof/protocol/partner)
     • PDP narrative (problem, mechanism, evidence, protocol, who/who-not,
       stack, metrics, reviews, faq)
-------------------------------------------------------------------------- */

const sharedReviewSeed = [
  { name: 'Arjun M.', city: 'Bengaluru', age: 34, rating: 5 },
  { name: 'Vikrant S.', city: 'Mumbai', age: 41, rating: 5 },
  { name: 'Rohan T.', city: 'Pune', age: 29, rating: 5 },
  { name: 'Karan B.', city: 'Delhi', age: 37, rating: 4 },
  { name: 'Sahil R.', city: 'Hyderabad', age: 32, rating: 5 },
  { name: 'Aakash V.', city: 'Gurgaon', age: 45, rating: 5 },
]

export const products = [
  /* ============================================================
     HERO · T-Rex Liquid
  ============================================================ */
  {
    id: 'trex-liquid',
    image: '/products/trex-v2-01.png',
    gallery: [
      '/products/trex-v2-01.png',
      '/products/trex-v2-02.png',
      '/products/trex-v2-03.png',
      '/products/trex-v2-04.png',
      '/products/trex-v2-05.png',
      '/products/trex-v2-06.jpg',
      '/products/trex-v2-07.png',
    ],
    name: 'T-Rex',
    subtitle: 'Strength & Testosterone Booster',
    tagline: "India's First 7-in-1 Natural Liquid · Hazelnut",
    category: 'liquid',
    categoryLabel: 'Liquid',
    tier: 'HERO',
    hero: true,
    accent: 'from-amber to-rust',
    bottleType: 'tall',
    badge: 'Bestseller',
    description: 'Our flagship liquid sublingual T-booster. 3× faster absorption than capsules.',
    variants: [
      { id: 'trex-1', label: 'Pack of 1 · 500ml', sub: '50 servings', price: 1999, compareAt: 2200 },
      { id: 'trex-2', label: 'Pack of 2 · 1L', sub: '100 servings', price: 3999, compareAt: 4400, save: 'Save ₹401', popular: true },
      { id: 'trex-3', label: 'Pack of 3 · 1.5L', sub: '150 servings', price: 5999, compareAt: 6600, save: 'Best value' },
    ],
    mckinsey: {
      who: 'Executive lifter, 32–52',
      pain: 'Testosterone drop, recovery debt, drive loss',
      proof: '8 standardised adaptogens, Third-Party Lab COA, +23% free T (clinical avg)',
      protocol: '10ml sublingual AM · 90-day cycle',
      partner: 'Vita Peak + Tongkat Ali',
    },
    pdp: {
      heroClaim: "India's first 7-in-1 Natural Liquid — Himalayan Shilajit with six clinically-studied Ayurvedic herbs in hazelnut-flavored liquid form. 100% Ayurvedic. No chemicals. No stimulants. The way our ancestors made it.",
      metrics: [
        { label: '7-in-1 Natural Formula', value: '7 Herbs' },
        { label: 'Bottle size', value: '500 ml' },
        { label: 'Daily dose · sublingual', value: '10 ml' },
        { label: 'Cost per day (50 servings)', value: '₹40' },
      ],
      problem: {
        title: 'Chemical supplements broke a generation of Indian men.',
        body: 'Synthetic boosters spike testosterone then crash it. Pre-workouts run on caffeine. "Proprietary blends" hide dust-sized doses. T-Rex busts the myths created by stimulant-based products — by going back to what worked for 5,000 years: Shilajit, Ashwagandha, Arjun, Gokhru, Draksha, Safed Musli, Kath Badam. Liquid-extracted by ancestral methods. Disclosed mg-by-mg.',
      },
      mechanism: {
        title: 'How the 7-in-1 works',
        steps: [
          { h: 'Liquid bioavailability', b: 'Shilajit is fully absorbed by the body only in its liquid form. Capsules and powders lose 40–60% of actives to first-pass liver metabolism. We chose the harder, costlier liquid route because it is the only one that delivers.' },
          { h: 'Ancestral extraction', b: 'Our Shilajit is collected from the highest Himalayan points by local villagers, then liquid-extracted using the multi-step process our ancestors used — a process most manufacturers refuse because it is lengthy and costly.' },
          { h: '7 herbs working together', b: 'Ashwagandha calms cortisol. Arjun protects the heart and lifts VO₂. Gokhru drives libido. Safed Musli boosts testosterone. Draksha speeds recovery. Kath Badam raises LDL (T building block). Shilajit ties it all together.' },
        ],
      },
      evidence: [
        { study: 'Biswas T.K. et al., Andrologia 2010', finding: 'Processed Shilajit 100mg × 2/day × 90 days — significant improvement in sperm count, motility, serum testosterone, and FSH.', source: 'Andrologia' },
        { study: 'Charaka Samhita, c. 200 BC', finding: '"No curable disease in the universe is not effectively cured by Shilajit when administered at the appropriate times." Known as "Destroyer of Weakness."', source: 'Ancient Ayurvedic text' },
        { study: 'Ashwagandha extract studies, multiple', finding: 'Anxiety-relieving effects as powerful as common antidepressants, without side effects. Regenerates nerve cells (Japanese university research). Balances thyroid + adrenals.', source: 'Ayurvedic clinical literature' },
      ],
      protocol: {
        when: 'Morning, before food.',
        how: '10ml sublingual for daily use — or 15ml twice daily as printed on the label, with milk or other beverages.',
        withWhat: 'Shake well before use. Best with warm milk for traditional preparation, or a chase of warm water + honey.',
        cycle: 'Daily for sustained benefit. Best results across 8–12 weeks of consistent use.',
      },
      whoFor: [
        'High performance men',
        'Lifters, athletes, executives',
        'Reduced energy, drive, recovery',
        'Want a natural path before pharmaceuticals',
      ],
      whoNotFor: [
        'Under 16',
        'Currently on TRT',
        'On blood thinners or BP medication without doctor consultation',
        'Pregnancy (obvious)',
      ],
      stackWith: ['vita-peak', 'trex-tongkat', 'hydra-muscle'],
      timeline: [
        { week: 'Week 1', what: 'Sleep deepens. Morning energy sharpens. Cortisol normalises.' },
        { week: 'Week 4', what: 'Strength and stamina return. Recovery time drops between sessions.' },
        { week: 'Week 8', what: 'Free testosterone and libido shifts measurable. Mood and drive stabilise.' },
        { week: 'Week 12', what: 'New baseline established. The 5,000-year-old protocol, validated in your body.' },
      ],
      faq: [
        { q: 'Is this a steroid or stimulant?', a: 'No. T-Rex is an Ayurvedic Proprietary Medicine. Zero hormones, stimulants, or banned substances. Mfg. Lic. AL946M.' },
        { q: 'Dosage?', a: 'Daily wellness dose: 10ml sublingual in the morning — one bottle lasts 50 days (≈₹40/day). Intensive phase, as printed on the label: 15ml twice daily with milk for short cycles, as directed by physician. Shake well before use.' },
        { q: 'Why liquid?', a: 'Shilajit is fully absorbed only in liquid form. The ancestral process we use takes longer and costs more — and it is the only method that delivers full bioavailability.' },
      ],
      reviews: [
        { ...sharedReviewSeed[0], title: 'My morning is no longer a fight', body: 'Switched from a synthetic stack after 14 months. 6 weeks in: deeper sleep, heavier lifts, fasting energy back. Worth every rupee.', time: '2 weeks ago' },
        { ...sharedReviewSeed[5], title: 'TRT was on the table. Not anymore.', body: 'My T was 340. Doctor suggested TRT. Gave myself 90 days with Primal first. Retested at 510 last week.', time: '2 months ago' },
        { ...sharedReviewSeed[1], title: 'Father of two, slept 4hrs, was a zombie', body: 'I am not a supplement guy. I tried this only because of the Third-Party Lab report. It actually works.', time: '1 month ago' },
      ],
    },
  },


  /* ============================================================
     DAILY FLOOR · Vita Peak
  ============================================================ */
  {
    id: 'vita-peak',
    image: '/products/vita-peak.png',
    name: 'Vita Peak',
    subtitle: 'Multivitamin + Energy',
    tagline: 'Full-spectrum + taurine + clean caffeine',
    category: 'daily',
    categoryLabel: 'Daily',
    tier: 'DAILY FLOOR',
    accent: 'from-forest to-amber',
    bottleType: 'jar',
    description: 'Full-spectrum daily multivitamin with clean caffeine for AM energy.',
    variants: [
      { id: 'vp-60', label: '60 tablets', sub: '30 days', price: 1500 },
      { id: 'vp-120', label: '120 tablets', sub: '60 days', price: 3000, save: 'Stock up' },
    ],
    mckinsey: {
      who: 'Every Primal customer',
      pain: 'Inconsistent micronutrient floor',
      proof: '21 nutrients at RDA+ doses, taurine + 80mg caffeine',
      protocol: '2 tabs AM with breakfast',
      partner: 'Every other Primal SKU',
    },
    pdp: {
      heroClaim: 'The daily floor every Indian man should be on. 21 micronutrients, taurine, and clean caffeine — engineered for the diet you actually eat.',
      metrics: [
        { label: 'Nutrients', value: '21' },
        { label: 'Caffeine per dose', value: '80mg' },
        { label: 'Dosing', value: '2 tabs AM' },
        { label: 'Days per bottle', value: '30 / 60' },
      ],
      problem: {
        title: 'The Indian diet has an iron + B12 + D3 problem.',
        body: 'NFHS-5 data: 25% of urban Indian men are vitamin D deficient. 47% are B12 insufficient. Most multivitamins under-dose the things Indians actually need and over-dose the rest. Vita Peak is built around the real deficiency pattern.',
      },
      mechanism: {
        title: 'What 21 micronutrients + clean caffeine + taurine actually do',
        steps: [
          { h: 'Plug the gaps', b: 'D3, B12, iron, magnesium, zinc — at the doses Indian deficiency profiles actually require.' },
          { h: 'Clean AM energy', b: '80mg caffeine + 500mg taurine = focused alertness without the jitters or crash of coffee.' },
          { h: 'Foundation for everything', b: 'Your T-booster works better. Your training works better. Your sleep works better. Multivitamin is the floor that makes ceilings possible.' },
        ],
      },
      evidence: [
        { study: 'NFHS-5 (2019–21) micronutrient survey', finding: '25% Indian urban men D3 deficient; 47% B12 insufficient; 23% iron-deficient.', source: 'Govt. of India' },
        { study: 'Caffeine + L-taurine, Giles GE et al. 2012', finding: 'Combination improves vigilance and reaction time vs caffeine alone.', source: 'PMID 22877246' },
      ],
      protocol: {
        when: 'Morning, with breakfast.',
        how: '2 tablets with food and a full glass of water.',
        withWhat: 'After your T-Rex shot. Before training (if AM training).',
        cycle: 'Daily, indefinitely.',
      },
      whoFor: [
        'Every man over 25',
        'Anyone training 3+ days/week',
        'Vegetarians (especially B12 attention)',
        'Indian dietary patterns',
      ],
      whoNotFor: [
        'Anyone caffeine-sensitive (try our caffeine-free Vita Peak coming soon)',
        'On other high-dose iron supplements',
      ],
      stackWith: ['trex-liquid', 'hydra-muscle', 'trex-tongkat'],
      faq: [
        { q: 'Is the caffeine harsh?', a: '80mg = roughly one cup of coffee. Smooth from the taurine pairing.' },
        { q: 'Can I take this with T-Rex?', a: 'Yes — they are designed to layer. Take Vita Peak with breakfast, T-Rex before.' },
        { q: 'Vegetarian?', a: 'Yes. Gelatin-free shell.' },
      ],
      reviews: [
        { ...sharedReviewSeed[2], title: 'Replaced coffee + 3 other pills', body: 'I was taking D3, B12, and creatine separately. Vita Peak replaced two of them. AM ritual is now one bottle.', time: '6 weeks ago' },
        { ...sharedReviewSeed[4], title: 'The caffeine is perfectly tuned', body: 'I cannot do pre-workouts. This is sharper than coffee, no jitter. Genuinely impressive blend.', time: '2 weeks ago' },
      ],
    },
  },

  /* ============================================================
     SPECIALIST · Korean Panax Ginseng
  ============================================================ */
  {
    id: 'trex-ginseng',
    image: '/products/ginseng-v2-01.png',
    gallery: [
      '/products/ginseng-v2-01.png',
      '/products/ginseng-v2-02.png',
      '/products/ginseng-v2-03.png',
      '/products/ginseng-v2-04.jpeg',
      '/products/ginseng-v2-05.jpeg',
      '/products/ginseng-v2-06.jpeg',
      '/products/ginseng-v2-07.jpeg',
    ],
    name: 'Korean Panax Ginseng',
    subtitle: 'Energy · Cognition · Vitality',
    tagline: 'Standardized ginsenoside extract',
    category: 'adaptogen',
    categoryLabel: 'Adaptogen',
    tier: 'SPECIALIST',
    accent: 'from-rust to-amber',
    bottleType: 'capsule',
    description: 'Korean Panax — the most-studied ginseng for male energy, focus, and libido.',
    variants: [{ id: 'gin-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'Cognitive performance + libido seekers',
      pain: 'Brain fog, sexual energy',
      proof: 'Ginsenoside Rg1/Rb1 standardized, Choi YD studies',
      protocol: '1 cap AM',
      partner: 'Cordyceps',
    },
    pdp: {
      heroClaim: 'The most-studied ginseng in the world. Standardized to ginsenosides Rg1 + Rb1 — the bioactives that actually drive cognition, libido, and HPA-axis balance.',
      metrics: [
        { label: 'Ginsenoside %', value: '5% std.' },
        { label: 'Capsules', value: '60' },
        { label: 'Days', value: '30' },
        { label: 'Best for', value: 'Brain + libido' },
      ],
      problem: {
        title: 'Ginseng is the most counterfeited adaptogen on Amazon.',
        body: 'Most "ginseng" capsules sold in India contain Indian ginseng (a different plant), or are non-standardized — meaning you have no idea how much actual ginsenoside is inside. Our Korean Panax is sourced from 6-year-aged roots and standardized to 5% ginsenosides.',
      },
      mechanism: {
        title: 'What ginsenosides actually do',
        steps: [
          { h: 'Cognitive', b: 'Rb1 + Rg1 cross the blood-brain barrier, support acetylcholine and dopamine signaling.' },
          { h: 'Libido', b: 'Korean ginseng increases nitric oxide and supports erectile function via cGMP pathway.' },
          { h: 'Adaptogen', b: 'Modulates HPA axis — sharpens response to acute stress without burning out.' },
        ],
      },
      evidence: [
        { study: 'Choi Y.D. et al., Asian Journal of Andrology 2013', finding: 'Korean red ginseng improved erectile function scores in 60% of subjects with mild ED.', source: 'doi:10.1038/aja.2012.137' },
        { study: 'Reay J.L. et al., Psychopharmacology 2005', finding: 'Panax ginseng improved cognitive performance + mood in healthy young adults.', source: 'PMID 15876775' },
      ],
      protocol: {
        when: 'Morning.',
        how: '1 capsule with water.',
        withWhat: 'With or without food. Pair with T-Rex for compounded effect.',
        cycle: '8 weeks on, 2 weeks off.',
      },
      whoFor: [
        'Men with cognitive fatigue / brain fog',
        'Anyone with mild libido decline',
        'Adaptogen stack-builders',
      ],
      whoNotFor: [
        'On blood pressure medication',
        'On blood thinners',
        'Pregnant or breastfeeding',
      ],
      stackWith: ['trex-cordyceps', 'trex-liquid', 'vita-peak'],
      faq: [
        { q: 'Is this Indian ginseng or Korean?', a: 'Korean (Panax). Indian ginseng = ashwagandha, totally different plant.' },
        { q: 'Will I feel it the first day?', a: 'Some men do. Most need 5–10 days for sustained effect.' },
      ],
      reviews: [
        { ...sharedReviewSeed[3], title: 'Sharper afternoons', body: '3pm slump is the worst. Two weeks in, the slump is gone. Will repurchase.', time: '4 days ago' },
      ],
    },
  },

  /* ============================================================
     SPECIALIST · Cordyceps
  ============================================================ */
  {
    id: 'trex-cordyceps',
    image: '/products/cordyceps-v2-01.png',
    gallery: [
      '/products/cordyceps-v2-01.png',
      '/products/cordyceps-v2-02.png',
      '/products/cordyceps-v2-03.png',
      '/products/cordyceps-v2-04.png',
    ],
    name: 'Cordyceps',
    subtitle: 'VO₂ Max · Stamina',
    tagline: 'Cordyceps sinensis 10:1 extract',
    category: 'adaptogen',
    categoryLabel: 'Adaptogen',
    tier: 'SPECIALIST',
    accent: 'from-amber-dark to-forest',
    bottleType: 'capsule',
    description: 'For endurance athletes and high-altitude warriors. Mushroom-derived ATP fuel.',
    variants: [{ id: 'cord-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'Endurance athletes, climbers, runners',
      pain: 'VO2 ceiling, late-session fatigue',
      proof: 'Chen S 2010 — VO2max +7% in 6 weeks',
      protocol: '1 cap pre-workout',
      partner: 'Hydra Muscle',
    },
    pdp: {
      heroClaim: 'The mushroom that climbs Everest. Cordyceps sinensis 10:1 extract — standardized for adenosine, the direct building block of ATP and cellular energy.',
      metrics: [
        { label: 'Extract ratio', value: '10:1' },
        { label: 'VO₂ max lift (literature)', value: '+7%' },
        { label: 'Best for', value: 'Endurance' },
        { label: 'Time to effect', value: '14 days' },
      ],
      problem: {
        title: 'Most endurance supplements are just caffeine in disguise.',
        body: "Pre-workouts blast you with stimulants — useful for 90 minutes, useless past 2 hours. If you ride, run, swim, climb, or train CrossFit-long, you need ATP support that lasts. Cordyceps doesn't stimulate — it expands your cellular fuel ceiling.",
      },
      mechanism: {
        title: 'Why Sherpas have used this for centuries',
        steps: [
          { h: 'Adenosine pathway', b: 'Cordyceps sinensis contains adenosine — a direct building block of ATP — supporting mitochondrial energy production at the cellular level.' },
          { h: 'Oxygen efficiency', b: 'Improves VO₂ max and oxygen uptake, particularly noticeable at sustained intensity.' },
          { h: 'No stim crash', b: 'Cordyceps is non-stimulant — no jitters, no crash, no tolerance build.' },
        ],
      },
      evidence: [
        { study: 'Chen S. et al., Journal of Alternative Med. 2010', finding: 'Cordyceps supplementation × 6 weeks: VO₂ max +7%, ventilatory threshold +10.5% in active adults.', source: 'PMID 20524422' },
      ],
      protocol: {
        when: '30–60 minutes pre-training.',
        how: '1 capsule with water.',
        withWhat: 'Pair with Hydra Muscle on heavy training days.',
        cycle: '8–12 weeks on, 2 weeks off.',
      },
      whoFor: [
        'Endurance athletes',
        'CrossFit / long-format training',
        'High-altitude hikers, climbers',
        'Anyone hitting a VO₂ ceiling',
      ],
      whoNotFor: [
        'Pure strength athletes (look at Tongkat or Maca)',
        'Those on immunosuppressants',
      ],
      stackWith: ['hydra-muscle', 'trex-ginseng', 'vita-peak'],
      faq: [
        { q: 'Is this the "zombie" Cordyceps from The Last of Us?', a: 'Different genus entirely. The game\'s fungus is Ophiocordyceps unilateralis — an insect parasite. Ours is Cordyceps sinensis — the rare Himalayan species Sherpas have used for centuries.' },
        { q: 'Will it stimulate me like caffeine?', a: 'No. Cordyceps is non-stimulant. You feel it as expanded ceiling, not a buzz.' },
      ],
      reviews: [
        { ...sharedReviewSeed[1], title: 'Marathon PB after 6 weeks', body: 'Was plateaued at 4:12 marathon for 2 years. Cordyceps stack + tempo training = 3:54 last month.', time: '3 weeks ago' },
      ],
    },
  },

  /* ============================================================
     SPECIALIST · Tongkat Ali
  ============================================================ */
  {
    id: 'trex-tongkat',
    image: '/products/tongkat-v2-01.png',
    gallery: [
      '/products/tongkat-v2-01.png',
      '/products/tongkat-v2-02.png',
      '/products/tongkat-v2-03.png',
      '/products/tongkat-v2-04.jpeg',
      '/products/tongkat-v2-05.jpeg',
      '/products/tongkat-v2-06.jpeg',
      '/products/tongkat-v2-07.jpeg',
    ],
    name: 'Tongkat Ali',
    subtitle: 'Testosterone · Strength',
    tagline: '2% eurycomanone standardized',
    category: 'adaptogen',
    categoryLabel: 'Adaptogen',
    tier: 'SPECIALIST',
    accent: 'from-amber to-rust',
    bottleType: 'capsule',
    description: 'Free testosterone, explosive strength, drive. Lab-standardized eurycomanone.',
    variants: [{ id: 'tong-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'T-focused lifters on a plateau',
      pain: 'Stalled lifts, lost drive',
      proof: '2% eurycomanone std., Tambi 2012 hypogonadal trial',
      protocol: '1 cap AM',
      partner: 'T-Rex Liquid',
    },
    pdp: {
      heroClaim: 'The most direct T-supporting adaptogen in nature. Standardized to 2% eurycomanone — the molecule clinical trials use.',
      metrics: [
        { label: 'Eurycomanone', value: '2% std.' },
        { label: 'Capsule dose', value: '200mg' },
        { label: 'Best for', value: 'Plateaued lifters' },
        { label: 'Time to effect', value: '21 days' },
      ],
      problem: {
        title: "You've been training hard for 8 months and your lifts haven't moved.",
        body: "When natural recovery and progressive overload stop working, the problem is rarely your program — it's your hormonal baseline. Tongkat Ali (Eurycoma longifolia) is the most direct, evidence-based natural intervention for free testosterone support.",
      },
      mechanism: {
        title: 'Why it works where other "T-boosters" fail',
        steps: [
          { h: 'Releases bound T', b: 'Tongkat reduces SHBG (sex hormone binding globulin) — freeing up bound testosterone that was unavailable.' },
          { h: 'Standardized dose', b: '2% eurycomanone = lab-verified concentration. Generic tongkat without this number is essentially a coin flip.' },
          { h: 'Compounds with T-Rex', b: 'T-Rex provides the foundational adaptogenic stack. Tongkat adds direct T-release support on top.' },
        ],
      },
      evidence: [
        { study: 'Tambi M.I. et al., Andrologia 2012', finding: 'Tongkat Ali 200 mg/day × 30 days: significant serum testosterone uplift in hypogonadal men.', source: 'doi:10.1111/j.1439-0272.2011.01168.x' },
        { study: 'Henkel R.R. et al., Phytotherapy Research 2014', finding: 'Tongkat Ali in physically active seniors: T uplift + muscular force +20%.', source: 'doi:10.1002/ptr.5017' },
      ],
      protocol: {
        when: 'Morning.',
        how: '1 capsule with water.',
        withWhat: 'Best paired with T-Rex Liquid for compounded effect.',
        cycle: '8 weeks on, 2 weeks off.',
      },
      whoFor: [
        'Lifters plateaued for 6+ months',
        'Men over 35 with low-normal T',
        'Anyone already on T-Rex looking for next layer',
      ],
      whoNotFor: [
        'Men with hormone-sensitive cancers (history)',
        'Currently on TRT',
      ],
      stackWith: ['trex-liquid', 'trex-maca', 'vita-peak'],
      faq: [
        { q: 'Can I take this alone, without T-Rex?', a: 'Yes — but T-Rex gives you the foundational stack (cortisol, adaptogens). Tongkat alone is good. With T-Rex it is meaningfully better.' },
        { q: 'Should I take this alongside T-Rex Liquid?', a: 'Yes — T-Rex Liquid uses 7 different herbs (Shilajit, Ashwagandha, Arjun, Gokhru, Draksha, Safed Musli, Kath Badam). Adding standalone Tongkat layers in direct testosterone-release support on top of T-Rex\'s adaptogenic foundation.' },
      ],
      reviews: [
        { ...sharedReviewSeed[0], title: 'Bench broke through 4 months stuck', body: 'I was stuck at 100kg bench for 4 months. Added Tongkat to T-Rex stack. Hit 107.5kg six weeks later.', time: '1 month ago' },
      ],
    },
  },

  /* ============================================================
     SPECIALIST · Royal Jelly
  ============================================================ */
  {
    id: 'trex-royal-jelly',
    image: '/products/royal-jelly-v2-01.png',
    gallery: [
      '/products/royal-jelly-v2-01.png',
      '/products/royal-jelly-v2-02.png',
      '/products/royal-jelly-v2-03.png',
      '/products/royal-jelly-v2-04.jpeg',
      '/products/royal-jelly-v2-05.jpeg',
      '/products/royal-jelly-v2-06.jpeg',
      '/products/royal-jelly-v2-07.jpeg',
    ],
    name: 'Royal Jelly',
    subtitle: 'Myogenesis · Vigour',
    tagline: 'Bee-derived androgenic support',
    category: 'adaptogen',
    categoryLabel: 'Adaptogen',
    tier: 'SPECIALIST',
    accent: 'from-amber-light to-amber-dark',
    bottleType: 'capsule',
    description: 'Royal jelly for muscle protein synthesis and androgenic support. Not vegan.',
    variants: [{ id: 'rj-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'Muscle-building athletes who can eat animal-source',
      pain: 'Slow recovery, lagging hypertrophy',
      proof: 'Morita 2012 androgen receptor markers',
      protocol: '1 cap AM',
      partner: 'T-Rex Liquid',
    },
    pdp: {
      heroClaim: 'The substance that turns a worker bee into a queen — same compounds that drive androgenic differentiation in mammals.',
      metrics: [
        { label: '10-HDA std.', value: '5%' },
        { label: 'Capsules', value: '60' },
        { label: 'Best for', value: 'Hypertrophy' },
        { label: 'Vegan', value: 'No' },
      ],
      problem: {
        title: 'You train. Recovery is the limiting factor.',
        body: "Muscle isn't built in the gym — it's built between sessions. Royal jelly contains 10-hydroxy-2-decenoic acid (10-HDA), shown in animal models to support androgen receptor expression and muscle protein synthesis pathways.",
      },
      mechanism: {
        title: 'What 10-HDA does',
        steps: [
          { h: 'Androgen receptor support', b: 'Animal studies show 10-HDA upregulates AR expression — making the testosterone you already have more effective.' },
          { h: 'Protein synthesis', b: 'Compounds in royal jelly support mTOR pathway activation, accelerating recovery between training sessions.' },
          { h: 'Energy + libido', b: 'Anecdotally, men report higher daily vigour and libido within 2 weeks.' },
        ],
      },
      evidence: [
        { study: 'Morita H. et al., Endocrine Journal 2012', finding: '10-HDA from royal jelly: increased AR expression in mammalian muscle cells in vitro.', source: 'PMID 22573102' },
      ],
      protocol: {
        when: 'Morning.',
        how: '1 capsule with water.',
        withWhat: 'Best stacked with T-Rex for compounded androgenic support.',
        cycle: '8 weeks on, 2 weeks off.',
      },
      whoFor: [
        'Lifters in hypertrophy phase',
        'Athletes in heavy training blocks',
        'Anyone who eats animal products',
      ],
      whoNotFor: [
        'Strict vegans (royal jelly is bee-derived)',
        'Anyone with bee or pollen allergies',
      ],
      stackWith: ['trex-liquid', 'trex-tongkat', 'hydra-muscle'],
      faq: [
        { q: 'Is royal jelly vegan?', a: 'No. It is bee-derived. If you are vegan, look at Tongkat, Maca, or Cordyceps instead.' },
        { q: 'Bee allergy?', a: 'Avoid. Royal jelly can trigger severe allergic reactions in bee-sensitive individuals.' },
      ],
      reviews: [
        { ...sharedReviewSeed[4], title: 'Recovery between sessions', body: 'Was training 5x. Now I can do 6x without burning out. Quietly impressive.', time: '2 weeks ago' },
      ],
    },
  },

  /* ============================================================
     SPECIALIST · Black Maca
  ============================================================ */
  {
    id: 'trex-maca',
    image: '/products/maca-v2-01.png',
    gallery: [
      '/products/maca-v2-01.png',
      '/products/maca-v2-02.png',
      '/products/maca-v2-03.png',
      '/products/maca-v2-04.jpeg',
      '/products/maca-v2-05.jpeg',
      '/products/maca-v2-06.jpeg',
      '/products/maca-v2-07.jpeg',
    ],
    name: 'Black Maca',
    subtitle: 'Strength · Recovery · Stamina',
    tagline: 'Peruvian black maca root',
    category: 'adaptogen',
    categoryLabel: 'Adaptogen',
    tier: 'SPECIALIST',
    accent: 'from-ink-700 to-amber-dark',
    bottleType: 'capsule',
    description: 'Strongest maca variant for male energy, endurance, and recovery.',
    variants: [{ id: 'maca-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'Stamina + libido + mood',
      pain: 'Energy dips, mood volatility',
      proof: 'Gonzales GF — black maca specifically for male sexual desire',
      protocol: '1 cap AM',
      partner: 'Tongkat Ali',
    },
    pdp: {
      heroClaim: 'Of the three maca colors, only black maca shows male-specific effects in clinical trials. Sourced from Junín, Peru at 4,100m altitude.',
      metrics: [
        { label: 'Sourced from', value: 'Junín, Peru' },
        { label: 'Altitude', value: '4,100m' },
        { label: 'Best for', value: 'Stamina + mood' },
        { label: 'Vegan', value: 'Yes' },
      ],
      problem: {
        title: 'Most "maca" is the cheap yellow variant.',
        body: "Yellow maca is the most common — and the least studied. Black maca is the variant clinical trials use, particularly for male sexual desire, sperm parameters, and physical endurance. We import only Junín-sourced black maca from cooperative-certified farms.",
      },
      mechanism: {
        title: 'Why black, not yellow',
        steps: [
          { h: 'Macamides + macaenes', b: 'Black maca has the highest concentration of these signature compounds — linked to libido and endurance effects.' },
          { h: 'Non-hormonal', b: 'Maca does not directly increase testosterone or estrogen — it works on the hypothalamus and central nervous system.' },
          { h: 'Mood + stamina', b: 'Self-reported energy and mood improvements in 50%+ of clinical trial participants.' },
        ],
      },
      evidence: [
        { study: 'Gonzales G.F. et al., Andrologia 2002', finding: 'Maca 1500–3000 mg × 12 weeks: improved sexual desire in 40–60% of men, independent of mood or T levels.', source: 'doi:10.1046/j.1439-0272.2002.00519.x' },
      ],
      protocol: {
        when: 'Morning or pre-workout.',
        how: '1 capsule with water.',
        withWhat: 'Tongkat for T-focused stack; with Cordyceps for endurance stack.',
        cycle: '8–12 weeks, then 2 weeks off.',
      },
      whoFor: [
        'Men with mood + libido concerns',
        'Endurance athletes (alternative to Cordyceps)',
        'Vegans (maca is plant-based)',
      ],
      whoNotFor: [
        'Anyone allergic to cruciferous vegetables',
        'On thyroid medication (consult doctor)',
      ],
      stackWith: ['trex-tongkat', 'trex-cordyceps', 'vita-peak'],
      faq: [
        { q: 'Black vs red vs yellow maca?', a: 'Black: best for male energy and libido. Red: female hormonal support. Yellow: generic. We sell only black.' },
        { q: 'Will it raise my testosterone?', a: 'No — maca is non-hormonal. It works on CNS pathways, not the endocrine system directly.' },
      ],
      reviews: [
        { ...sharedReviewSeed[5], title: 'Mood + stamina, both lifted', body: 'Did not expect mood improvement. But after 3 weeks, I just felt steadier — at work and at home.', time: '5 weeks ago' },
      ],
    },
  },

  /* ============================================================
     RECOVERY LAYER · Liver Detox
  ============================================================ */
  {
    id: 'trex-liver',
    image: '/products/liver-v2-01.png',
    gallery: [
      '/products/liver-v2-01.png',
      '/products/liver-v2-02.png',
      '/products/liver-v2-03.png',
      '/products/liver-v2-04.png',
      '/products/liver-v2-05.jpeg',
      '/products/liver-v2-06.jpeg',
      '/products/liver-v2-07.jpeg',
      '/products/liver-v2-08.jpeg',
    ],
    name: 'Liver Detox',
    subtitle: 'Cleanse · Repair',
    tagline: 'Milk thistle + glutathione precursors',
    category: 'adaptogen',
    categoryLabel: 'Recovery',
    tier: 'RECOVERY',
    accent: 'from-forest to-amber-dark',
    bottleType: 'capsule',
    description: 'For the man who lifts hard and drinks occasionally. Repair what you punish.',
    variants: [{ id: 'liver-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'Hard-living lifter',
      pain: 'Alcohol + processed food load on liver',
      proof: 'Silymarin 80% standardized; Abenavoli systematic review',
      protocol: 'Cycle 2 weeks/quarter',
      partner: 'T-Rex (mandatory if on cycle)',
    },
    pdp: {
      heroClaim: "For the man who lifts hard, works hard, and occasionally lives hard. Milk thistle silymarin at 80% — the same dose used in clinical hepatoprotection trials.",
      metrics: [
        { label: 'Silymarin std.', value: '80%' },
        { label: 'Capsules', value: '60' },
        { label: 'Cycle length', value: '14 days' },
        { label: 'Best for', value: 'Quarterly reset' },
      ],
      problem: {
        title: 'Your liver processes everything — including your supplements.',
        body: "If you train hard, eat processed food, drink socially, or take any oral supplements long-term, your liver carries the load. Liver Detox is a quarterly 14-day reset built on silymarin (milk thistle's active compound), glutathione precursors, and dandelion root.",
      },
      mechanism: {
        title: 'How silymarin protects + repairs',
        steps: [
          { h: 'Membrane protection', b: 'Silymarin stabilises hepatocyte cell membranes, blocking toxin entry.' },
          { h: 'Glutathione restoration', b: 'NAC + alpha-lipoic acid restore depleted glutathione — your body\'s primary detox antioxidant.' },
          { h: 'Bile flow', b: 'Dandelion root and turmeric stimulate bile production, helping clear fat-soluble toxins.' },
        ],
      },
      evidence: [
        { study: 'Abenavoli L. et al., Phytotherapy Research 2018', finding: 'Silymarin: significant hepatoprotection markers (ALT, AST) across multiple clinical settings.', source: 'doi:10.1002/ptr.6171' },
      ],
      protocol: {
        when: 'Morning + evening.',
        how: '1 capsule AM, 1 capsule PM with food.',
        withWhat: 'Plenty of water. Reduce alcohol during cycle.',
        cycle: '14 days every quarter, or after any high-toxin period.',
      },
      whoFor: [
        'Lifters running supplement stacks long-term',
        'Anyone drinking socially',
        'Quarterly health-reset believers',
      ],
      whoNotFor: [
        'Active liver disease (consult doctor)',
        'On medications metabolized by the liver',
      ],
      stackWith: ['trex-liquid', 'vita-peak'],
      faq: [
        { q: 'Do I need this if I do not drink?', a: 'Less urgently — but if you take supplements year-round, a quarterly reset is sensible.' },
        { q: 'Can I take this with T-Rex?', a: 'Yes. In fact, if you are running long T-Rex cycles, this is recommended every 90 days.' },
      ],
      reviews: [
        { ...sharedReviewSeed[2], title: 'My quarterly reset', body: 'Run a 14-day cycle every 3 months between training blocks. Feel cleaner afterward — bloodwork ALT/AST are stable.', time: '3 months ago' },
      ],
    },
  },

  /* ============================================================
     PERFORMANCE LAYER · Hydra Muscle
  ============================================================ */
  {
    id: 'hydra-muscle',
    image: '/products/hydra-muscle/1.png',
    gallery: [
      '/products/hydra-muscle/1.png',
      '/products/hydra-muscle/2.jpg',
      '/products/hydra-muscle/3.jpg',
      '/products/hydra-muscle/4.jpg',
      '/products/hydra-muscle/5.jpg',
      '/products/hydra-muscle/6.jpg',
      '/products/hydra-muscle/7.jpg',
      '/products/hydra-muscle/8.jpg',
    ],
    name: 'Hydra Muscle',
    subtitle: 'Creatine + Electrolytes',
    tagline: "India's first creatine + hydration formula",
    category: 'hydration',
    categoryLabel: 'Hydration',
    tier: 'PERFORMANCE',
    accent: 'from-amber-light to-amber',
    bottleType: 'tub',
    badge: 'New',
    description: '3g creatine monohydrate, himalayan pink salt, coconut water powder & 1500mg electrolytes. Strawberry.',
    variants: [{ id: 'hydra-1', label: '150g', sub: '30 servings · strawberry', price: 1200 }],
    mckinsey: {
      who: 'Active training days',
      pain: 'Cramping, hydration, mid-set strength',
      proof: 'Creatine — most validated supplement in sports science',
      protocol: '1 scoop intra-workout',
      partner: 'Cordyceps + Vita Peak',
    },
    pdp: {
      heroClaim: '3g creatine monohydrate, himalayan pink salt, coconut water powder & 1500mg electrolytes, no artificial sweeteners. Built for Indian summer training — the only category where you sweat 1.5L per hour.',
      metrics: [
        { label: 'Creatine', value: '3g per serving' },
        { label: 'Electrolytes', value: '1500mg blend' },
        { label: 'Servings', value: '30' },
        { label: 'Flavor', value: 'Strawberry' },
      ],
      problem: {
        title: 'Indian gyms are hotter than your AC tells you.',
        body: 'Most Indian lifters are chronically under-hydrated and under-electrolyted. Adding pure creatine to plain water gives you strength gains but no hydration support. Hydra Muscle is the first Indian formulation pairing 3g creatine monohydrate with himalayan pink salt, coconut water powder & 1500mg electrolytes.',
      },
      mechanism: {
        title: 'Why creatine + electrolytes together',
        steps: [
          { h: 'Creatine = strength', b: '3g daily monohydrate — clean, effective dose backed by sports science. 4-6 weeks for full saturation.' },
          { h: 'Electrolytes = hydration', b: 'Sodium, potassium, magnesium, chloride — replace what Indian summer sessions burn.' },
          { h: 'Together', b: 'Creatine pulls water into muscle cells. Electrolytes ensure that water actually exists in your system.' },
        ],
      },
      evidence: [
        { study: 'Kreider R.B. et al., JISSN 2017 position statement', finding: '5g creatine monohydrate daily: gold-standard for strength + lean mass. Most-studied supplement in history.', source: 'doi:10.1186/s12970-017-0173-z' },
      ],
      protocol: {
        when: 'Pre or intra-workout.',
        how: '1 scoop in 300–500ml water.',
        withWhat: 'Sip across the session. On rest days, take in the morning.',
        cycle: 'Daily, indefinitely.',
      },
      whoFor: [
        'Lifters and athletes training in heat',
        'Anyone serious about strength progression',
        'CrossFit, HIIT, sport training',
      ],
      whoNotFor: [
        'Pure endurance-only athletes (creatine is less relevant)',
        'Anyone with kidney issues (consult doctor)',
      ],
      stackWith: ['trex-cordyceps', 'vita-peak', 'trex-liquid'],
      faq: [
        { q: 'Do I need a loading phase?', a: 'No. Taking daily for 28 days saturates muscle creatine — same end state as loading, no GI distress.' },
        { q: 'Is creatine safe?', a: 'Most-studied supplement in sports science. Safe for healthy adults at this dose, indefinitely. Consult doctor if kidney issues.' },
      ],
      reviews: [
        { ...sharedReviewSeed[2], title: 'Finally an Indian creatine that hydrates', body: 'I used to mix creatine with electrolyte tablets separately. This is one scoop, better taste, same result. Done.', time: '1 month ago' },
      ],
    },
  },
]

export const productById = (id) => products.find((p) => p.id === id)
export const variantById = (productId, variantId) => {
  const p = productById(productId)
  return p?.variants.find((v) => v.id === variantId)
}

export const categories = [
  { id: 'all', label: 'Everything' },
  { id: 'liquid', label: 'Liquids' },
  { id: 'daily', label: 'Daily' },
  { id: 'adaptogen', label: 'Adaptogens' },
  { id: 'hydration', label: 'Hydration' },
]

/* Funnel tier reference for portfolio strategy */
export const tiers = {
  HERO: { label: 'Hero', role: 'Brand-defining transformation' },
  'TRIP-WIRE': { label: 'Trip-wire', role: 'Acquisition' },
  'DAILY FLOOR': { label: 'Daily Floor', role: 'Frequency / habit' },
  SPECIALIST: { label: 'Specialist', role: 'Personalization' },
  RECOVERY: { label: 'Recovery', role: 'Lifestyle reset' },
  PERFORMANCE: { label: 'Performance', role: 'Activity-coupled' },
}
