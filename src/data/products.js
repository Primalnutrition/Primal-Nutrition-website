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
      '/products/trex-nature.jpg',
      '/products/trex-v2-02.png',
      '/products/trex-v2-03.png',
      '/products/trex-v2-04.png',
      '/products/trex-v2-05.png',
      '/products/trex-v2-06.jpg',
      '/products/trex-v2-07.png',
    ],
    name: 'T-Rex',
    subtitle: 'Strength & Testosterone Booster',
    tagline: "7-in-1 Natural Liquid · Hazelnut",
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
      partner: 'Tongkat Ali',
    },
    pdp: {
      heroClaim: 'Ancient strength, made modern. Himalayan Shilajit and six Ayurvedic herbs, in a daily hazelnut shot.',
      metrics: [
        { label: 'Ayurvedic formula', value: '7 Herbs' },
        { label: 'Flavour', value: 'Hazelnut' },
        { label: 'Daily dose', value: '10 ml' },
        { label: 'Servings', value: '50' },
        { label: 'Formula', value: 'Daily Vitality' },
      ],
      problem: {
        title: 'Tired, stressed, running on coffee?',
        body: 'Long workdays, late nights and endless chai leave most men drained by evening. Energy drinks and pre-workouts spike you up, then crash you down. T-REX is the steady, natural fix: seven Ayurvedic herbs in one daily shot.',
      },
      mechanism: {
        eyebrow: 'The T-REX difference',
        title: 'Why T-REX works',
        steps: [
          { h: 'Liquid, not pills', b: 'One smooth 10 ml shot. Easy to take, and mixes into coffee, milk or a shake.' },
          { h: 'Made the traditional way', b: 'Himalayan Shilajit, purified the slow Ayurvedic way. It takes longer and costs more, so nothing is cut short.' },
          { h: '7 herbs, one daily habit', b: 'Ashwagandha for calm energy. Safed Musli and Gokhru for drive. Arjun for stamina. Draksha for recovery. Shilajit ties it together.' },
        ],
      },
      evidence: [
        { study: 'Biswas T.K. et al., Andrologia 2010', finding: 'Processed Shilajit 100mg × 2/day × 90 days — significant improvement in sperm count, motility, serum testosterone, and FSH.', source: 'Andrologia' },
        { study: 'Charaka Samhita, c. 200 BC', finding: '"No curable disease in the universe is not effectively cured by Shilajit when administered at the appropriate times." Known as "Destroyer of Weakness."', source: 'Ancient Ayurvedic text' },
        { study: 'Ashwagandha extract studies, multiple', finding: 'Anxiety-relieving effects as powerful as common antidepressants, without side effects. Regenerates nerve cells (Japanese university research). Balances thyroid + adrenals.', source: 'Ayurvedic clinical literature' },
      ],
      protocol: {
        early: true,
        eyebrow: 'Daily vitality, made simple',
        title: 'One shot. All-day energy.',
        labels: ['When', 'How much', 'How', 'How long'],
        when: 'Every morning.',
        how: 'One 10 ml shot. Want more? Take a second 10 ml shot later in the day.',
        withWhat: 'Take it straight, or mix it into your coffee or your favourite beverage. Shake well before use.',
        cycle: 'Every day. Best results with 8–12 weeks of daily use.',
      },
      whoFor: [
        'High performance men',
        'Lifters, athletes, executives',
        'Reduced energy, drive, recovery',
        'Want a natural path before pharmaceuticals',
      ],
      whoNotFor: [
        'Under 18',
        'Currently on TRT',
        'On blood thinners or BP medication without doctor consultation',
        'Pregnancy (obvious)',
      ],
      stackWith: ['trex-tongkat', 'hydra-muscle'],
      upsellStackId: 'testosterone',
      benefits: [
        { icon: 'male', title: 'Healthy Testosterone', line: 'Supports natural testosterone levels, the Ayurvedic way.' },
        { icon: 'arm', title: 'Strength & Endurance', line: 'More power in the gym, more stamina through the day.' },
        { icon: 'bolt', title: 'All-Day Energy', line: 'Steady energy from morning to night. No caffeine, no crash.' },
        { icon: 'flame', title: 'Drive, Mood & Vitality', line: 'Feel sharper, more motivated and more like yourself.' },
        { icon: 'dumbbell', title: 'Lean Muscle & Recovery', line: 'Supports muscle building and faster recovery between workouts.' },
        { icon: 'leaf', title: 'Stress & Sleep Balance', line: 'Ashwagandha helps you stay calm under pressure and sleep deeper.' },
      ],
      timeline: [
        { week: 'Week 1', icon: 'moon', what: 'Better sleep, steadier mornings.' },
        { week: 'Week 2', icon: 'bolt', what: 'More energy through the day.' },
        { week: 'Week 3', icon: 'arm', what: 'Strength and stamina pick up.' },
        { week: 'Week 4', icon: 'flame', what: 'Drive and mood feel stronger.' },
      ],
      faq: [
        { q: 'Is this a steroid or stimulant?', a: 'No. T-Rex is an Ayurvedic Proprietary Medicine. Zero hormones, stimulants, or banned substances. Mfg. Lic. AL946M.' },
        { q: 'Dosage?', a: 'One 10 ml shot every morning: one bottle lasts 50 days (about ₹40/day). Want a higher dose? Take a second 10 ml shot later in the day. Shake well before use.' },
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
    tagline: "Korean Panax root extract",
    category: 'adaptogen',
    categoryLabel: 'Adaptogen',
    tier: 'SPECIALIST',
    accent: 'from-rust to-amber',
    bottleType: 'capsule',
    description: "Korean Panax Ginseng for steady energy, sharper focus and drive.",
    variants: [{ id: 'gin-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'Cognitive performance + libido seekers',
      pain: 'Brain fog, sexual energy',
      proof: 'Ginsenoside Rg1/Rb1 standardized, Choi YD studies',
      protocol: '1 cap AM',
      partner: 'Cordyceps',
    },
    pdp: {
      heroClaim: "The king of herbs, from the mountains of Korea. 1,000 mg of Korean Panax Ginseng for steady energy, sharper focus and drive. Two capsules a day.",
      metrics: [
        {
          "label": "Per serving",
          "value": "1,000 mg"
        },
        {
          "label": "Daily dose",
          "value": "2 caps"
        },
        {
          "label": "Days per bottle",
          "value": "30"
        },
        {
          "label": "True Korean ginseng",
          "value": "Panax"
        },
        {
          "label": "Steady energy",
          "value": "No caffeine"
        }
      ],
      problem: {
        "title": "Busy mind. Empty tank.",
        "body": "Long days, late nights and a 3 PM fog that coffee can't fix. Korean ginseng has been Asia's answer to mental and physical fatigue for over 2,000 years."
      },
      mechanism: {
        "eyebrow": "The Primal difference",
        "title": "Why Korean Ginseng works",
        "steps": [
          {
            "h": "True Panax, not a substitute",
            "b": "Many 'ginseng' products are actually Indian ginseng (ashwagandha), a different plant. Ours is genuine Korean Panax root."
          },
          {
            "h": "Steady, not wired",
            "b": "An adaptogen gives energy that lasts the day, with no caffeine spike and no crash."
          },
          {
            "h": "Mind and body",
            "b": "Sharper focus at work, more stamina in the gym, and the drive to match."
          }
        ]
      },
      evidence: [
        {
          "study": "Reay J.L. et al., Psychopharmacology 2005",
          "finding": "Panax ginseng improved cognitive performance and mood in healthy young adults.",
          "source": "PMID 15876775"
        }
      ],
      protocol: {
        "early": true,
        "eyebrow": "Daily focus, made simple",
        "title": "Two capsules. Every morning.",
        "labels": [
          "When",
          "How much",
          "How",
          "How long"
        ],
        "when": "After breakfast.",
        "how": "2 capsules (1,000 mg).",
        "withWhat": "With a glass of water.",
        "cycle": "Daily. Best results with 8 weeks on, then 2 weeks off."
      },
      whoFor: [
        "Men with long, mentally demanding days",
        "Anyone with a 3 PM energy dip",
        "Men who want focus and drive without caffeine"
      ],
      whoNotFor: [
        "Under 18",
        "On blood pressure, blood-thinner or diabetes medication, without a doctor's advice",
        "Pregnant or breastfeeding"
      ],
      benefitsHeading: "What Korean Ginseng does for you.",
      benefits: [
        {
          "icon": "bolt",
          "title": "Peak Performance",
          "line": "Energy that holds up from morning to night."
        },
        {
          "icon": "brain",
          "title": "Focus & Cognition",
          "line": "Clearer thinking and sharper concentration."
        },
        {
          "icon": "arm",
          "title": "Recovery & Testosterone Support",
          "line": "Helps you bounce back and supports natural testosterone."
        },
        {
          "icon": "shield",
          "title": "Immune Defence",
          "line": "Supports your body's natural defences."
        },
        {
          "icon": "flame",
          "title": "Energy & Stamina",
          "line": "Steady drive through long days. No crash."
        },
        {
          "icon": "male",
          "title": "Drive & Vitality",
          "line": "Feel more motivated and more like yourself."
        }
      ],
      timeline: [
        {
          "week": "Week 1",
          "icon": "bolt",
          "what": "Steadier energy through the day."
        },
        {
          "week": "Week 2",
          "icon": "brain",
          "what": "Clearer focus at work."
        },
        {
          "week": "Week 3",
          "icon": "dumbbell",
          "what": "More stamina in your workouts."
        },
        {
          "week": "Week 4",
          "icon": "flame",
          "what": "Drive and recovery feel stronger."
        }
      ],
      faq: [
        {
          "q": "Is this Indian ginseng or Korean?",
          "a": "Korean Panax ginseng. Indian ginseng is ashwagandha, a completely different plant."
        },
        {
          "q": "How do I take it?",
          "a": "Take 2 capsules after breakfast with water, every day. Best results come with 8 weeks of use, then a 2-week break."
        },
        {
          "q": "Will it feel like caffeine?",
          "a": "No. Ginseng gives steady energy without a spike or a crash."
        }
      ],
      stackWith: ['trex-cordyceps', 'trex-liquid'],
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
      '/products/cordyceps-nature.jpg',
      '/products/cordyceps-v2-02.png',
      '/products/cordyceps-v2-03.png',
      '/products/cordyceps-v2-04.png',
    ],
    name: 'Cordyceps',
    subtitle: "Stamina · Oxygen · Energy",
    tagline: "Cordyceps sinensis 10:1 extract",
    category: 'adaptogen',
    categoryLabel: 'Adaptogen',
    tier: 'SPECIALIST',
    accent: 'from-amber-dark to-forest',
    bottleType: 'capsule',
    description: "The rare high-altitude fungus for stamina and clean energy.",
    variants: [{ id: 'cord-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'Endurance athletes, climbers, runners',
      pain: 'VO2 ceiling, late-session fatigue',
      proof: 'Chen S 2010 — VO2max +7% in 6 weeks',
      protocol: '1 cap pre-workout',
      partner: 'Hydra Muscle',
    },
    pdp: {
      heroClaim: "The rare medicinal fungus of the high Himalayas, known as keedajadi. Cordyceps sinensis, concentrated 10:1, for stamina, oxygen use and clean energy. No stimulants.",
      metrics: [
        {
          "label": "Extract strength",
          "value": "10:1"
        },
        {
          "label": "Per serving",
          "value": "1,000 mg"
        },
        {
          "label": "Daily dose",
          "value": "2 caps"
        },
        {
          "label": "Days per bottle",
          "value": "30"
        },
        {
          "label": "Clean energy",
          "value": "No stimulants"
        }
      ],
      problem: {
        "title": "Gassed out before the workout ends?",
        "body": "Pre-workouts spike you for an hour, then drop you. Cordyceps works differently. It supports how your body makes and uses energy, so your stamina lasts the whole session."
      },
      mechanism: {
        "eyebrow": "The Primal difference",
        "title": "Why Cordyceps works",
        "steps": [
          {
            "h": "Rare by nature",
            "b": "Cordyceps sinensis grows on the high Himalayan and Tibetan plateau, where it has been prized for centuries as keedajadi."
          },
          {
            "h": "Concentrated 10:1",
            "b": "1,000 mg of extract per serving, made from 10,000 mg of raw material. A small capsule with serious strength."
          },
          {
            "h": "Energy without a crash",
            "b": "It supports your body's own energy and oxygen use. No jitters, no tolerance."
          }
        ]
      },
      evidence: [
        {
          "study": "Chen S. et al., Journal of Alternative Med. 2010",
          "finding": "Cordyceps for 6 weeks improved VO₂ max and ventilatory threshold in active adults.",
          "source": "PMID 20524422"
        }
      ],
      protocol: {
        "early": true,
        "eyebrow": "Daily stamina, made simple",
        "title": "Two capsules. Every morning.",
        "labels": [
          "When",
          "How much",
          "How",
          "How long"
        ],
        "when": "After breakfast.",
        "how": "2 capsules (1,000 mg).",
        "withWhat": "With a glass of water. On heavy training days, take them 30–60 minutes before training.",
        "cycle": "Daily. Best results with 8–12 weeks on, then 2 weeks off."
      },
      whoFor: [
        "Gym-goers who run out of steam",
        "Runners, cyclists and long-session athletes",
        "Trekkers and anyone who works at altitude",
        "Men who want energy without stimulants"
      ],
      whoNotFor: [
        "Under 18",
        "On immunosuppressant medication, without a doctor's advice",
        "Pregnant or breastfeeding"
      ],
      benefitsHeading: "What Cordyceps does for you.",
      benefits: [
        {
          "icon": "arm",
          "title": "Explosive Strength",
          "line": "More power when you push."
        },
        {
          "icon": "bolt",
          "title": "VO₂ Max & Efficiency",
          "line": "Use oxygen and energy better when you work hard."
        },
        {
          "icon": "flame",
          "title": "ATP Production",
          "line": "Supports the cellular fuel your muscles burn."
        },
        {
          "icon": "drop",
          "title": "Nutrient & Fat Use",
          "line": "Helps your body make more of what you eat."
        },
        {
          "icon": "dumbbell",
          "title": "Endurance",
          "line": "Stay strong late into a session."
        },
        {
          "icon": "leaf",
          "title": "Recovery",
          "line": "Bounce back faster between workouts."
        }
      ],
      timeline: [
        {
          "week": "Week 1",
          "icon": "bolt",
          "what": "Cleaner, steadier energy."
        },
        {
          "week": "Week 2",
          "icon": "dumbbell",
          "what": "You last longer in sessions."
        },
        {
          "week": "Week 3",
          "icon": "flame",
          "what": "Breathing feels easier on cardio."
        },
        {
          "week": "Week 4",
          "icon": "arm",
          "what": "Stamina and strength feel stronger."
        }
      ],
      faq: [
        {
          "q": "What is Cordyceps sinensis?",
          "a": "A rare medicinal fungus traditionally found at high altitude in the Himalayas and Tibet, known as keedajadi. It is not the fungus from the video game."
        },
        {
          "q": "Will it stimulate me like caffeine?",
          "a": "No. Cordyceps is not a stimulant. You feel it as steadier energy and better stamina, not a buzz."
        },
        {
          "q": "How do I take it?",
          "a": "2 capsules after breakfast with water, every day. On heavy training days you can take them 30–60 minutes before training."
        }
      ],
      stackWith: ['hydra-muscle', 'trex-ginseng'],
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
      '/products/tongkat-nature.jpg',
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
      heroClaim: 'The legendary root of the Malaysian rainforest. Wild-harvested Tongkat Ali, concentrated 100:1, for strength, drive and stamina. Two capsules a day.',
      metrics: [
        { label: 'Extract', value: '100:1' },
        { label: 'Per serving', value: '1,000 mg' },
        { label: 'Daily dose', value: '2 caps' },
        { label: 'Days per bottle', value: '30' },
        { label: 'Malaysian root', value: 'Wild-harvested' },
      ],
      problem: {
        title: 'Where did your fire go?',
        body: 'Same gym. Same effort. Less drive, less strength, less you. After 30, testosterone drops a little every year, and most men just call it getting older. Tongkat Ali is how the men of the Malaysian rainforest have fought back for centuries.',
      },
      mechanism: {
        eyebrow: 'The Primal difference',
        title: 'Why Tongkat Ali works',
        steps: [
          { h: '100:1 concentrated', b: '1,000 mg of extract, made from 1,00,000 mg of raw root. A small capsule with serious strength.' },
          { h: 'Wild-harvested root', b: 'Only mature rainforest roots, 5 to 7 years old, when their active compounds peak.' },
          { h: 'Frees up your testosterone', b: 'Tongkat Ali helps release testosterone your body already makes but cannot use.' },
        ],
      },
      evidence: [
        { study: 'Tambi M.I. et al., Andrologia 2012', finding: 'Tongkat Ali 200 mg/day × 30 days: significant serum testosterone uplift in hypogonadal men.', source: 'doi:10.1111/j.1439-0272.2011.01168.x' },
        { study: 'Henkel R.R. et al., Phytotherapy Research 2014', finding: 'Tongkat Ali in physically active seniors: T uplift + muscular force +20%.', source: 'doi:10.1002/ptr.5017' },
      ],
      protocol: {
        early: true,
        eyebrow: 'Daily strength, made simple',
        title: 'Two capsules. Every morning.',
        labels: ['When', 'How much', 'How', 'How long'],
        when: 'After breakfast.',
        how: '2 capsules (1,000 mg extract).',
        withWhat: 'Swallow with a glass of water.',
        cycle: 'Daily. Best results with 8 weeks on, then 2 weeks off.',
      },
      whoFor: [
        'Lifters who have stopped progressing',
        'Men over 30 who want their drive back',
        'Anyone already on T-REX looking for the next layer',
      ],
      whoNotFor: [
        'Under 18',
        'Men with hormone-sensitive cancers (history)',
        'Currently on TRT',
      ],
      benefitsHeading: 'What Tongkat Ali does for you.',
      benefits: [
        { icon: 'male', title: 'Healthy Testosterone', line: 'Supports your natural free-testosterone levels.' },
        { icon: 'arm', title: 'Strength & Power', line: 'Push harder in the gym and break through plateaus.' },
        { icon: 'flame', title: 'Drive & Libido', line: 'Bring back the desire and confidence you remember.' },
        { icon: 'bolt', title: 'Energy & Stamina', line: 'Steady energy through long days. No stimulants.' },
        { icon: 'leaf', title: 'Stress Balance', line: "Helps keep cortisol in check, so stress doesn't steal your edge." },
        { icon: 'dumbbell', title: 'Lean Muscle & Recovery', line: 'Recover faster between sessions.' },
      ],
      timeline: [
        { week: 'Week 1', icon: 'bolt', what: 'Steadier energy through the day.' },
        { week: 'Week 2', icon: 'moon', what: 'Better mood and focus.' },
        { week: 'Week 3', icon: 'flame', what: 'Your drive picks up.' },
        { week: 'Week 4', icon: 'arm', what: 'Strength and stamina feel stronger.' },
      ],
      stackWith: ['trex-liquid', 'trex-maca'],
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
    subtitle: "Muscle · Vigour",
    tagline: "Pure royal jelly",
    category: 'adaptogen',
    categoryLabel: 'Adaptogen',
    tier: 'SPECIALIST',
    accent: 'from-amber-light to-amber-dark',
    bottleType: 'capsule',
    description: "Pure royal jelly for lean muscle, vitality and recovery. Not vegan.",
    variants: [{ id: 'rj-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'Muscle-building athletes who can eat animal-source',
      pain: 'Slow recovery, lagging hypertrophy',
      proof: 'Morita 2012 androgen receptor markers',
      protocol: '1 cap AM',
      partner: 'T-Rex Liquid',
    },
    pdp: {
      heroClaim: "The food that turns a worker bee into a queen. 1,000 mg of pure royal jelly for lean muscle, vitality and recovery. Two capsules a day.",
      metrics: [
        {
          "label": "Per serving",
          "value": "1,000 mg"
        },
        {
          "label": "Daily dose",
          "value": "2 caps"
        },
        {
          "label": "Days per bottle",
          "value": "30"
        },
        {
          "label": "Pure royal jelly",
          "value": "Bee-made"
        },
        {
          "label": "Suitable for vegans",
          "value": "No"
        }
      ],
      problem: {
        "title": "Training hard. Recovering slow?",
        "body": "Muscle is built between sessions, not during them. Royal jelly is one of nature's richest foods, packed with protein, amino acids and B vitamins, and it is what bees feed their queen."
      },
      mechanism: {
        "eyebrow": "The Primal difference",
        "title": "Why Royal Jelly works",
        "steps": [
          {
            "h": "Made by bees, for a queen",
            "b": "Worker bees make royal jelly to feed one queen. It is rich in protein, amino acids and B vitamins."
          },
          {
            "h": "Built for recovery",
            "b": "Supports lean muscle growth and repair between workouts."
          },
          {
            "h": "Daily vigour",
            "b": "Many men notice more energy and drive within a few weeks."
          }
        ]
      },
      evidence: [
        {
          "study": "Morita H. et al., Endocrine Journal 2012",
          "finding": "A compound from royal jelly increased androgen-receptor activity in muscle cells in the lab.",
          "source": "PMID 22573102"
        }
      ],
      protocol: {
        "early": true,
        "eyebrow": "Daily recovery, made simple",
        "title": "Two capsules. Every morning.",
        "labels": [
          "When",
          "How much",
          "How",
          "How long"
        ],
        "when": "After breakfast.",
        "how": "2 capsules (1,000 mg).",
        "withWhat": "With a glass of water.",
        "cycle": "Daily. Best results with 8 weeks on, then 2 weeks off."
      },
      whoFor: [
        "Lifters building lean muscle",
        "Men in heavy training blocks",
        "Anyone who wants more daily vigour"
      ],
      whoNotFor: [
        "Under 18",
        "Strict vegans (royal jelly is made by bees)",
        "Bee, pollen or honey allergy",
        "Asthma, without a doctor's advice"
      ],
      benefitsHeading: "What Royal Jelly does for you.",
      benefits: [
        {
          "icon": "dumbbell",
          "title": "Lean Muscle Growth",
          "line": "Supports muscle building and repair."
        },
        {
          "icon": "flame",
          "title": "Vitality & Libido",
          "line": "Supports sexual vitality, desire and performance."
        },
        {
          "icon": "bolt",
          "title": "Cellular Energy",
          "line": "Supports energy at the cell level."
        },
        {
          "icon": "arm",
          "title": "Recovery",
          "line": "Helps you recover between sessions."
        },
        {
          "icon": "male",
          "title": "Daily Vigour",
          "line": "Feel stronger and more energetic day to day."
        },
        {
          "icon": "shield",
          "title": "Nutrient-Dense",
          "line": "Protein, amino acids and B vitamins in one."
        }
      ],
      timeline: [
        {
          "week": "Week 1",
          "icon": "bolt",
          "what": "More daily energy."
        },
        {
          "week": "Week 2",
          "icon": "leaf",
          "what": "Better recovery between workouts."
        },
        {
          "week": "Week 3",
          "icon": "arm",
          "what": "Strength starts to pick up."
        },
        {
          "week": "Week 4",
          "icon": "flame",
          "what": "Vigour and drive feel stronger."
        }
      ],
      faq: [
        {
          "q": "Is royal jelly vegan?",
          "a": "No. It is made by bees. If you are vegan, look at Tongkat Ali, Black Maca or Cordyceps instead."
        },
        {
          "q": "Who should avoid it?",
          "a": "Anyone with a bee, pollen or honey allergy, and people with asthma unless a doctor says it is fine."
        },
        {
          "q": "How do I take it?",
          "a": "2 capsules after breakfast with water, every day."
        }
      ],
      stackWith: ['trex-liquid', 'trex-tongkat', 'hydra-muscle'],
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
      '/products/maca-nature.jpg',
      '/products/maca-v2-02.png',
      '/products/maca-v2-03.png',
      '/products/maca-v2-04.jpeg',
      '/products/maca-v2-05.jpeg',
      '/products/maca-v2-06.jpeg',
      '/products/maca-v2-07.jpeg',
    ],
    name: 'Black Maca',
    subtitle: "Strength · Stamina · Drive",
    tagline: "Peruvian black maca root",
    category: 'adaptogen',
    categoryLabel: 'Adaptogen',
    tier: 'SPECIALIST',
    accent: 'from-ink-700 to-amber-dark',
    bottleType: 'capsule',
    description: "Black maca from the Peruvian Andes for strength, stamina and drive.",
    variants: [{ id: 'maca-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'Stamina + libido + mood',
      pain: 'Energy dips, mood volatility',
      proof: 'Gonzales GF — black maca specifically for male sexual desire',
      protocol: '1 cap AM',
      partner: 'Tongkat Ali',
    },
    pdp: {
      heroClaim: "The Andean root grown high on the Junín plateau in Peru. Black maca, concentrated 10:1, for strength, stamina and drive. Two capsules a day.",
      metrics: [
        {
          "label": "Extract strength",
          "value": "10:1"
        },
        {
          "label": "Per serving",
          "value": "1,000 mg"
        },
        {
          "label": "Daily dose",
          "value": "2 caps"
        },
        {
          "label": "Days per bottle",
          "value": "30"
        },
        {
          "label": "Grown at",
          "value": "4,100 m"
        }
      ],
      problem: {
        "title": "Low drive. Low energy. Low mood?",
        "body": "Stress and long days quietly drain your drive. Black maca, the rarest of the three maca colours, has been eaten in the Andes for strength and stamina for over 2,000 years."
      },
      mechanism: {
        "eyebrow": "The Primal difference",
        "title": "Why Black Maca works",
        "steps": [
          {
            "h": "Black, not yellow",
            "b": "Most maca sold is the common yellow kind. Black is the rarer root, the one prized for men."
          },
          {
            "h": "Grown at 4,100 metres",
            "b": "It grows on Peru's Junín plateau, where thin air and cold make the root potent."
          },
          {
            "h": "Balance, not a hormone",
            "b": "Black maca supports natural hormone balance. It is not a hormone and not a steroid."
          }
        ]
      },
      evidence: [
        {
          "study": "Gonzales G.F. et al., Andrologia 2002",
          "finding": "Maca for 12 weeks improved sexual desire in men, independent of mood or testosterone levels.",
          "source": "doi:10.1046/j.1439-0272.2002.00519.x"
        }
      ],
      protocol: {
        "early": true,
        "eyebrow": "Daily drive, made simple",
        "title": "Two capsules. Every morning.",
        "labels": [
          "When",
          "How much",
          "How",
          "How long"
        ],
        "when": "After breakfast.",
        "how": "2 capsules (1,000 mg).",
        "withWhat": "With a glass of water.",
        "cycle": "Daily. Best results with 8–12 weeks on, then 2 weeks off."
      },
      whoFor: [
        "Men whose drive and mood have dipped",
        "Lifters who want more intensity and faster repair",
        "Vegans (maca is plant-based)"
      ],
      whoNotFor: [
        "Under 18",
        "On thyroid medication, without a doctor's advice",
        "Pregnant or breastfeeding"
      ],
      benefitsHeading: "What Black Maca does for you.",
      benefits: [
        {
          "icon": "arm",
          "title": "Muscle Size & Strength",
          "line": "Supports muscle growth and strength."
        },
        {
          "icon": "bolt",
          "title": "Drive & Workout Intensity",
          "line": "Sharper mental drive and harder training."
        },
        {
          "icon": "scale",
          "title": "Natural Hormone Balance",
          "line": "Supports your body's own balance, naturally."
        },
        {
          "icon": "leaf",
          "title": "Stress & Repair",
          "line": "Helps reduce stress and speeds up post-training repair."
        },
        {
          "icon": "dumbbell",
          "title": "Stamina",
          "line": "Energy that lasts the whole day."
        },
        {
          "icon": "flame",
          "title": "Libido",
          "line": "Supports desire and sexual vitality."
        }
      ],
      timeline: [
        {
          "week": "Week 1",
          "icon": "leaf",
          "what": "Steadier mood."
        },
        {
          "week": "Week 2",
          "icon": "bolt",
          "what": "More energy through the day."
        },
        {
          "week": "Week 3",
          "icon": "flame",
          "what": "Your drive picks up."
        },
        {
          "week": "Week 4",
          "icon": "arm",
          "what": "Strength and stamina feel stronger."
        }
      ],
      faq: [
        {
          "q": "Black, red or yellow maca?",
          "a": "Black is the rarest and the one prized for men. Red is mostly for women and yellow is the common type. We only use black."
        },
        {
          "q": "Is it a hormone or a steroid?",
          "a": "No. Black maca is a plant root. It supports your natural hormone balance and does not contain hormones."
        },
        {
          "q": "How do I take it?",
          "a": "2 capsules after breakfast with water, every day."
        }
      ],
      stackWith: ['trex-tongkat', 'trex-cordyceps'],
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
    subtitle: "Liver · Digestion · Balance",
    tagline: "13 Ayurvedic herbs + milk thistle",
    category: 'adaptogen',
    categoryLabel: 'Recovery',
    tier: 'RECOVERY',
    accent: 'from-forest to-amber-dark',
    bottleType: 'capsule',
    description: "A 13-herb Ayurvedic formula to support your liver and digestion.",
    variants: [{ id: 'liver-60', label: '60 capsules', sub: '30 days', price: 1800 }],
    mckinsey: {
      who: 'Hard-living lifter',
      pain: 'Alcohol + processed food load on liver',
      proof: 'Silymarin 80% standardized; Abenavoli systematic review',
      protocol: 'Cycle 2 weeks/quarter',
      partner: 'T-Rex (mandatory if on cycle)',
    },
    pdp: {
      heroClaim: "A 13-herb Ayurvedic liver formula with milk thistle. For men who train hard, eat out and live fast. Two capsules a day.",
      metrics: [
        {
          "label": "Ayurvedic herbs",
          "value": "13"
        },
        {
          "label": "Hero herb",
          "value": "Milk thistle"
        },
        {
          "label": "Daily dose",
          "value": "2 caps"
        },
        {
          "label": "Days per bottle",
          "value": "30"
        },
        {
          "label": "Ayurvedic",
          "value": "Proprietary medicine"
        }
      ],
      problem: {
        "title": "Heavy food. Late nights. Tired liver.",
        "body": "Your liver handles everything you eat, drink and take, including your supplements. When it is overloaded, energy, digestion and recovery all suffer."
      },
      mechanism: {
        "eyebrow": "The Primal difference",
        "title": "Why Liver Detox works",
        "steps": [
          {
            "h": "Classic liver herbs",
            "b": "Kalmegh, Bhuiamla, Katki and Punarnava, used in Ayurveda for liver care for generations."
          },
          {
            "h": "Plus milk thistle",
            "b": "The best-known liver herb in the world, added to the classic blend at 100 mg."
          },
          {
            "h": "Better absorption",
            "b": "Pipul (long pepper) helps your body absorb the herbs and the protein you eat."
          }
        ]
      },
      evidence: [
        {
          "study": "Abenavoli L. et al., Phytotherapy Research 2018",
          "finding": "Milk thistle (silymarin) showed liver-protective effects across several clinical settings.",
          "source": "doi:10.1002/ptr.6171"
        }
      ],
      protocol: {
        "early": true,
        "eyebrow": "Daily liver care, made simple",
        "title": "Two capsules. Every morning.",
        "labels": [
          "When",
          "How much",
          "How",
          "How long"
        ],
        "when": "After breakfast.",
        "how": "2 capsules.",
        "withWhat": "With a glass of water.",
        "cycle": "Daily for 30 days. Repeat after any heavy period."
      },
      whoFor: [
        "Men who eat out often",
        "Anyone who drinks socially",
        "Lifters on long supplement stacks",
        "Anyone who wants lighter digestion"
      ],
      whoNotFor: [
        "Under 18",
        "Existing liver disease or on regular medication, without a doctor's advice",
        "Pregnant or breastfeeding",
        "Lactose intolerance (contains lactose)"
      ],
      benefitsHeading: "What Liver Detox does for you.",
      benefits: [
        {
          "icon": "leaf",
          "title": "Liver Function",
          "line": "Supports healthy liver function."
        },
        {
          "icon": "dumbbell",
          "title": "Protein Absorption",
          "line": "Helps you absorb and use the protein you eat."
        },
        {
          "icon": "bolt",
          "title": "Metabolism & Energy",
          "line": "Supports metabolism and daily energy."
        },
        {
          "icon": "drop",
          "title": "Clears Toxins",
          "line": "Supports your body's natural cleansing."
        },
        {
          "icon": "flame",
          "title": "Digestion",
          "line": "Bitter herbs that support appetite and digestion."
        },
        {
          "icon": "scale",
          "title": "Balance",
          "line": "Helps you feel lighter and more balanced."
        }
      ],
      timeline: [
        {
          "week": "Week 1",
          "icon": "leaf",
          "what": "Lighter digestion."
        },
        {
          "week": "Week 2",
          "icon": "bolt",
          "what": "More daily energy."
        },
        {
          "week": "Week 3",
          "icon": "dumbbell",
          "what": "Better appetite and absorption."
        },
        {
          "week": "Week 4",
          "icon": "scale",
          "what": "You feel cleaner and lighter."
        }
      ],
      faq: [
        {
          "q": "What is inside?",
          "a": "13 Ayurvedic herbs (Giloy, Rohitak, Mutha, Katki, Daruharidra, Kule khara, Khetpapra, Bhuiamla, Pipul, Kalmegh, Chirata, Punarnava) plus milk thistle. Every dose is on the bottle."
        },
        {
          "q": "Do I need this if I don't drink?",
          "a": "It is not only for drinkers. Heavy food, long hours and long supplement use also load the liver."
        },
        {
          "q": "Can I take it with T-REX?",
          "a": "Yes. They work well together. Take 2 capsules after breakfast with water."
        }
      ],
      stackWith: ['trex-liquid'],
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
    subtitle: "Creatine · Hydration",
    tagline: "Creatine + pink salt hydration",
    category: 'hydration',
    categoryLabel: 'Hydration',
    tier: 'PERFORMANCE',
    accent: 'from-amber-light to-amber',
    bottleType: 'tub',
    badge: 'New',
    description: "3 g creatine with Himalayan pink salt, coconut water and magnesium. Salted strawberry.",
    variants: [
      { id: 'hydra-1', label: '250g', sub: '25 servings · salted strawberry', price: 1200 },
      // Two tubs at the single-tub price. prepaidOnly because a BOGO shipped COD
      // costs two units plus round-trip freight if it comes back as an RTO.
      { id: 'hydra-2pk', label: 'Double Pack — 2 × 250g', sub: '50 servings · salted strawberry',
        price: 1200, compareAt: 2400, save: 'Save ₹1,200', prepaidOnly: true, popular: true },
    ],
    mckinsey: {
      who: 'Active training days',
      pain: 'Cramping, hydration, mid-set strength',
      proof: 'Creatine — most validated supplement in sports science',
      protocol: '1 scoop intra-workout',
      partner: 'Cordyceps',
    },
    pdp: {
      heroClaim: "3 g pure creatine with Himalayan pink salt, coconut water and magnesium. Strength and hydration in one scoop. Salted strawberry.",
      metrics: [
        {
          "label": "Creatine per scoop",
          "value": "3 g"
        },
        {
          "label": "Pure creatine",
          "value": "99.9%"
        },
        {
          "label": "Servings",
          "value": "25"
        },
        {
          "label": "Salted flavour",
          "value": "Strawberry"
        },
        {
          "label": "Sweetened with",
          "value": "Stevia"
        }
      ],
      problem: {
        "title": "Cramping mid-set? Flat by rep eight?",
        "body": "Indian heat drains water and salts fast. Creatine builds strength, and this one also brings the salts to keep you hydrated while you train."
      },
      mechanism: {
        "eyebrow": "The Primal difference",
        "title": "Why Hydra Muscle works",
        "steps": [
          {
            "h": "Creatine for strength",
            "b": "3 g of 99.9% pure creatine monohydrate, the most researched supplement in sport."
          },
          {
            "h": "Salts for hydration",
            "b": "Himalayan pink salt, coconut water and magnesium replace what you sweat out."
          },
          {
            "h": "Better together",
            "b": "Creatine pulls water into your muscles. The salts make sure there is water to pull."
          }
        ]
      },
      evidence: [
        {
          "study": "Kreider R.B. et al., JISSN 2017 position statement",
          "finding": "Creatine monohydrate is the gold-standard supplement for strength and lean mass, and the most-studied in history.",
          "source": "doi:10.1186/s12970-017-0173-z"
        }
      ],
      protocol: {
        "early": true,
        "eyebrow": "Daily strength, made simple",
        "title": "One scoop. Every day.",
        "labels": [
          "When",
          "How much",
          "How",
          "How long"
        ],
        "when": "Before or during your workout.",
        "how": "1 scoop (10 g).",
        "withWhat": "Mix in 300–500 ml of water and sip through the session. On rest days, take it in the morning.",
        "cycle": "Daily."
      },
      whoFor: [
        "Lifters and athletes who train in the heat",
        "Anyone chasing strength gains",
        "Gym-goers who cramp or tire early"
      ],
      whoNotFor: [
        "Under 18",
        "Kidney issues, without a doctor's advice",
        "Pregnant or breastfeeding"
      ],
      benefitsHeading: "What Hydra Muscle does for you.",
      benefits: [
        {
          "icon": "arm",
          "title": "Strength & Power",
          "line": "More force on your heaviest sets."
        },
        {
          "icon": "drop",
          "title": "Hydration",
          "line": "Replaces water and salts lost in sweat."
        },
        {
          "icon": "bolt",
          "title": "Fewer Cramps",
          "line": "Helps replace the salts you lose in hot sessions."
        },
        {
          "icon": "leaf",
          "title": "Recovery",
          "line": "Supports faster recovery between workouts."
        },
        {
          "icon": "dumbbell",
          "title": "Muscle Fullness",
          "line": "Creatine helps muscles hold more water and look fuller."
        },
        {
          "icon": "flame",
          "title": "Endurance",
          "line": "Keep your output up through the last set."
        }
      ],
      timeline: [
        {
          "week": "Week 1",
          "icon": "drop",
          "what": "Better hydration in workouts."
        },
        {
          "week": "Week 2",
          "icon": "bolt",
          "what": "Fewer cramps."
        },
        {
          "week": "Week 3",
          "icon": "dumbbell",
          "what": "A rep or two more per set."
        },
        {
          "week": "Week 4",
          "icon": "arm",
          "what": "Strength and fullness start to show."
        }
      ],
      faq: [
        {
          "q": "Do I need a loading phase?",
          "a": "No. Taking 1 scoop daily fills your muscles in about 4 weeks, with no stomach upset."
        },
        {
          "q": "Is creatine safe?",
          "a": "It is the most-studied supplement in sport and is safe for healthy adults at this dose. Check with a doctor if you have kidney issues."
        },
        {
          "q": "How do I take it?",
          "a": "Mix 1 scoop (10 g) in 300–500 ml of water. Take it before or during your workout, or in the morning on rest days."
        }
      ],
      stackWith: ['trex-cordyceps', 'trex-liquid'],
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
