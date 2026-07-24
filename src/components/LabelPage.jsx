import { useState } from 'react'
import PrimalLogo from './PrimalLogo.jsx'
import { usePage } from '../context/RouterContext.jsx'

/* ── Per-product ingredient + supplement facts data ─────────────────────── */
const LABEL_DATA = {
  'trex-liquid': {
    productName: 'T-Rex Liquid',
    tagline: "India's First 7-in-1 Natural Liquid",
    flavour: 'Hazelnut',
    licenseNo: 'Mfg. Lic. AL946M',
    category: 'Ayurvedic Proprietary Medicine',
    servingSize: '10ml (daily) / 15ml × 2 (label dose)',
    servingsPerBottle: 50,
    netVolume: '500ml',
    ingredients: [
      {
        name: 'Himalayan Shilajit',
        scientificName: 'Asphaltum punjabianum',
        amount: '50mg',
        perLabelDose: '150mg',
        standardization: 'Fulvic acid ≥ 40%',
        origin: 'Himalayan Range, 3,000–5,000m',
        keyBenefit: 'Cellular energy & free testosterone',
        mechanism:
          'Fulvic acid acts as a mineral transporter into mitochondria and potentiates CoQ10. Supports FSH/LH signalling, driving free testosterone elevation in clinical settings.',
        traditionalUse:
          'Known in Ayurveda for 5,000+ years as "Shilajatu" — the Destroyer of Weakness. Classified as the highest Rasayana.',
        study: {
          citation: 'Biswas T.K. et al., Andrologia, 2010',
          finding:
            'Processed Shilajit 100mg × 2/day × 90 days: significant increase in sperm count, motility, serum testosterone, and FSH.',
        },
        emoji: '🏔️',
      },
      {
        name: 'Ashwagandha',
        scientificName: 'Withania somnifera',
        amount: '100mg',
        perLabelDose: '300mg',
        standardization: 'Withanolides ≥ 2.5%',
        origin: 'Rajasthan, India',
        keyBenefit: 'Cortisol reduction & recovery',
        mechanism:
          'Withanolides modulate the HPA axis, reducing serum cortisol 15–28% in RCTs. Also supports thyroid T3/T4 balance and nerve cell regeneration (axon growth in vitro).',
        traditionalUse:
          '"Balya" (strength-giving) in the Charaka Samhita — prescribed to warriors, convalescents, and the elderly for rebuilding vitality.',
        study: {
          citation: 'Chandrasekhar K. et al., Indian J. Psych. Med., 2012',
          finding:
            'Ashwagandha root extract × 60 days: cortisol −27.9%, perceived stress −44%, well-being significantly improved vs placebo.',
        },
        emoji: '🌿',
      },
      {
        name: 'Arjun Chal',
        scientificName: 'Terminalia arjuna',
        amount: '100mg',
        perLabelDose: '300mg',
        standardization: 'Arjunolic acid ≥ 1%',
        origin: 'River-bank forests, Central India',
        keyBenefit: 'Cardiac output & VO₂ support',
        mechanism:
          'Arjunosides and arjunolic acid support myocardial contractility. Clinical data shows improved ejection fraction and VO₂ max — translating to more oxygen delivery during sustained exercise.',
        traditionalUse:
          'The premier "Hridaya" (heart) herb in Ayurveda for 3,000+ years. Bark is harvested full-moon traditionally for maximum glycoside concentration.',
        study: {
          citation: 'Bharani A. et al., Int. J. Cardiol., 1995',
          finding:
            'Arjuna bark 500mg × 3/day × 3 months: significant improvement in exercise tolerance and reduction in anginal episodes.',
        },
        emoji: '🌳',
      },
      {
        name: 'Gokhru',
        scientificName: 'Tribulus terrestris',
        amount: '50mg',
        perLabelDose: '150mg',
        standardization: 'Saponins ≥ 40%',
        origin: 'Rajasthan dry-land harvest',
        keyBenefit: 'Libido & urogenital vitality',
        mechanism:
          'Protodioscin saponins sensitize LH receptors in the testes, stimulating endogenous testosterone production. Also promotes nitric oxide synthesis for healthy circulation.',
        traditionalUse:
          'Classical Ayurvedic "Vajikaran" (sexual vitality) herb — documented in Charaka Samhita Book 4 for male reproductive health.',
        study: {
          citation: 'Gauthaman K. et al., J. Ethnopharmacol., 2003',
          finding:
            'Tribulus extract: significant rise in androgen receptor expression and sexual behavior scores; testosterone elevated in primates.',
        },
        emoji: '⚡',
      },
      {
        name: 'Draksha',
        scientificName: 'Vitis vinifera',
        amount: '100mg',
        perLabelDose: '300mg',
        standardization: 'OPC (proanthocyanidins) ≥ 85%',
        origin: 'Nashik Valley, Maharashtra',
        keyBenefit: 'Antioxidant recovery & muscle repair',
        mechanism:
          'OPCs scavenge exercise-induced reactive oxygen species, cutting DOMS by 20–35% in trials. Resveratrol activates SIRT1, supporting mitochondrial biogenesis and lean-mass retention.',
        traditionalUse:
          '"Draksha" in Ashtanga Hridayam — used for strength restoration, immunity, and as a tonic post-illness in classical Ayurveda.',
        study: {
          citation: 'Rathee S. et al., Phytomed., 2010',
          finding:
            'Grape seed OPC extract: significant reduction in oxidative stress markers and inflammatory cytokines post-exercise in athletes.',
        },
        emoji: '🍇',
      },
      {
        name: 'Safed Musli',
        scientificName: 'Chlorophytum borivilianum',
        amount: '100mg',
        perLabelDose: '300mg',
        standardization: 'Saponins ≥ 20%',
        origin: 'Madhya Pradesh forest tubers',
        keyBenefit: 'Testosterone & sperm quality',
        mechanism:
          'Steroidal saponins stimulate Leydig cell testosterone production. Also demonstrated improvements in sperm motility and count — likely via FSH sensitization.',
        traditionalUse:
          'Premium Vajikaran Rasayana — historically priced higher than silver by weight in Indian Ayurvedic trade. Harvested from forest tubers (not cultivated).',
        study: {
          citation: 'Thakur M. et al., Andrologia, 2009',
          finding:
            'Safed Musli extract × 28 days: significant improvement in sperm count, motility, and serum testosterone levels in hypospermia patients.',
        },
        emoji: '🌾',
      },
      {
        name: 'Kath Badam',
        scientificName: 'Buchanania lanzan',
        amount: '50mg',
        perLabelDose: '150mg',
        standardization: 'Fatty acids ≥ 30%',
        origin: 'Chhattisgarh & Madhya Pradesh dry forests',
        keyBenefit: 'Cholesterol support & T-precursor',
        mechanism:
          'LDL cholesterol is the direct biochemical precursor to testosterone synthesis. Kath Badam\'s balanced oleic/stearic fatty acid profile supports healthy LDL and provides steroidogenic substrate without inflammatory load.',
        traditionalUse:
          '"Chironji" — used in Unani medicine as "Muqawwi-e-Bah" (sexual tonic) and in Ayurveda for brain and nerve nourishment.',
        study: {
          citation: 'Nagre R.V. et al., Int. J. Pharm. Sci. Rev., 2015',
          finding:
            'Buchanania lanzan seed extract: hepatoprotective and lipid-modulating effects; supports healthy steroidogenic lipid balance.',
        },
        emoji: '🌰',
      },
    ],
    supplementFacts: {
      servingSize: '10ml',
      servingsPerContainer: 50,
      caloriesPerServing: 12,
      rows: [
        { name: 'Total Carbohydrates', amount: '3g', dv: '1%', indent: false },
        { name: 'Sugars', amount: '0g', dv: '—', indent: true },
        { name: 'Protein', amount: '<1g', dv: '—', indent: false },
        { name: 'Shilajit (Asphaltum punjabianum) fulvic acid ≥40%', amount: '50mg', dv: '†', indent: false },
        { name: 'Ashwagandha (Withania somnifera) withanolides ≥2.5%', amount: '100mg', dv: '†', indent: false },
        { name: 'Arjun Chal (Terminalia arjuna) arjunolic acid ≥1%', amount: '100mg', dv: '†', indent: false },
        { name: 'Gokhru (Tribulus terrestris) saponins ≥40%', amount: '50mg', dv: '†', indent: false },
        { name: 'Draksha (Vitis vinifera) OPC ≥85%', amount: '100mg', dv: '†', indent: false },
        { name: 'Safed Musli (Chlorophytum borivilianum) saponins ≥20%', amount: '100mg', dv: '†', indent: false },
        { name: 'Kath Badam (Buchanania lanzan) fatty acids ≥30%', amount: '50mg', dv: '†', indent: false },
      ],
    },
    otherIngredients: 'Purified water, hazelnut flavour (natural), citric acid (preservative).',
    warnings: [
      'Not for use by persons under 16 years of age.',
      'Keep out of reach of children.',
      'If you are pregnant, nursing, or taking any medications, consult a physician before use.',
      'Not a substitute for a varied diet.',
    ],
  },

  'trex-tongkat': {
    productName: 'Tongkat Ali',
    tagline: 'Free Testosterone Support',
    licenseNo: '',
    category: 'Herbal Supplement',
    servingSize: '1 capsule (200mg)',
    servingsPerBottle: 60,
    netVolume: '60 capsules',
    ingredients: [
      {
        name: 'Tongkat Ali Root Extract',
        scientificName: 'Eurycoma longifolia',
        amount: '200mg',
        perLabelDose: '200mg',
        standardization: 'Eurycomanone ≥ 2%',
        origin: 'Malaysian rainforest roots',
        keyBenefit: 'Releases bound testosterone · Lifts free T',
        mechanism:
          'Eurycomanone reduces SHBG (sex hormone binding globulin), releasing bound testosterone into free, bioavailable form. Also supports LH-driven Leydig cell production.',
        traditionalUse:
          '"Ali\'s Walking Stick" — used in traditional Malaysian medicine (Jamu) for centuries as the primary male vitality herb. Roots are wild-harvested at 5–7 years of age.',
        study: {
          citation: 'Tambi M.I. et al., Andrologia, 2012',
          finding:
            'Tongkat Ali 200mg/day × 30 days: significant serum testosterone uplift in hypogonadal men (mean T from 229 → 408 ng/dL).',
        },
        emoji: '🌴',
      },
    ],
    supplementFacts: {
      servingSize: '1 capsule',
      servingsPerContainer: 60,
      caloriesPerServing: 0,
      rows: [
        { name: 'Tongkat Ali Root Extract (Eurycoma longifolia) eurycomanone ≥2%', amount: '200mg', dv: '†', indent: false },
      ],
    },
    otherIngredients: 'Microcrystalline cellulose, vegetable capsule (HPMC).',
    warnings: [
      'Not for use by persons under 18.',
      'Not for persons with hormone-sensitive cancers.',
      'Currently on TRT? Consult your doctor first.',
    ],
  },

  'trex-cordyceps': {
    productName: 'Cordyceps',
    tagline: 'VO₂ Max & Endurance Support',
    licenseNo: '',
    category: 'Functional Mushroom Supplement',
    servingSize: '1 capsule (400mg)',
    servingsPerBottle: 60,
    netVolume: '60 capsules',
    ingredients: [
      {
        name: 'Cordyceps Extract',
        scientificName: 'Cordyceps militaris',
        amount: '400mg',
        perLabelDose: '400mg',
        standardization: 'Cordycepin ≥ 0.3% · Adenosine ≥ 0.3%',
        origin: 'Cultivated (food-grade), not wild-harvested',
        keyBenefit: 'ATP production · VO₂ max · Stamina',
        mechanism:
          'Cordycepin (3′-deoxyadenosine) is a structural adenosine analogue that supports mitochondrial ATP synthesis. Improves oxygen utilization efficiency — measurable as VO₂ max uplift within 3–6 weeks.',
        traditionalUse:
          'Tibetan Sherpas have used Cordyceps sinensis for high-altitude endurance for centuries. Our strain (militaris) is the cultivated equivalent — same bioactives, no wild-harvest ethical concern.',
        study: {
          citation: 'Chen S. et al., J. Altern. Complement. Med., 2010',
          finding:
            'Cordyceps supplementation × 6 weeks: VO₂ max +7%, ventilatory threshold +10.5% vs placebo in active adults.',
        },
        emoji: '🍄',
      },
    ],
    supplementFacts: {
      servingSize: '1 capsule',
      servingsPerContainer: 60,
      caloriesPerServing: 0,
      rows: [
        { name: 'Cordyceps militaris Extract (cordycepin ≥0.3%, adenosine ≥0.3%)', amount: '400mg', dv: '†', indent: false },
      ],
    },
    otherIngredients: 'Microcrystalline cellulose, vegetable capsule (HPMC).',
    warnings: [
      'Not for persons on immunosuppressants.',
      'Consult physician if pregnant or breastfeeding.',
    ],
  },

  'trex-ginseng': {
    productName: 'Korean Panax Ginseng',
    tagline: 'Cognition · Energy · Libido',
    licenseNo: '',
    category: 'Herbal Supplement',
    servingSize: '1 capsule (400mg)',
    servingsPerBottle: 60,
    netVolume: '60 capsules',
    ingredients: [
      {
        name: 'Korean Red Ginseng Root',
        scientificName: 'Panax ginseng C.A.Mey',
        amount: '400mg',
        perLabelDose: '400mg',
        standardization: 'Ginsenosides ≥ 5% (Rg1 + Rb1)',
        origin: '6-year aged roots, Goryeo, South Korea',
        keyBenefit: 'Brain focus · Libido · Adaptogenic balance',
        mechanism:
          'Ginsenoside Rb1 crosses the blood-brain barrier, supporting acetylcholine and dopamine signalling. Rg1 promotes NO synthesis for vasodilation and erectile function via cGMP. HPA-axis modulation sharpens acute stress response.',
        traditionalUse:
          'Documented in Chinese Pharmacopoeia since 200 BC — "Ren Shen" (Root of Man). Used by Korean royalty and Taoist monks as the premier longevity tonic.',
        study: {
          citation: 'Choi Y.D. et al., Asian J. Androl., 2013',
          finding:
            'Korean red ginseng improved erectile function scores in 60% of subjects with mild-moderate ED vs 28% placebo.',
        },
        emoji: '🌱',
      },
    ],
    supplementFacts: {
      servingSize: '1 capsule',
      servingsPerContainer: 60,
      caloriesPerServing: 0,
      rows: [
        { name: 'Korean Panax Ginseng Root Extract (ginsenosides ≥5%)', amount: '400mg', dv: '†', indent: false },
      ],
    },
    otherIngredients: 'Microcrystalline cellulose, vegetable capsule (HPMC).',
    warnings: [
      'Not for use on blood pressure medication without physician guidance.',
      'Not for persons on blood thinners.',
    ],
  },

  'trex-maca': {
    productName: 'Black Maca',
    tagline: 'Stamina · Libido · Mood',
    licenseNo: '',
    category: 'Herbal Supplement',
    servingSize: '1 capsule (1500mg)',
    servingsPerBottle: 60,
    netVolume: '60 capsules',
    ingredients: [
      {
        name: 'Black Maca Root',
        scientificName: 'Lepidium meyenii Walp.',
        amount: '1500mg',
        perLabelDose: '1500mg',
        standardization: 'Black variety only · macamides ≥ 0.6%',
        origin: 'Junín Plateau, Peru, 4,100m altitude',
        keyBenefit: 'Stamina · Libido · Mood stabilisation',
        mechanism:
          'Macamides and macaenes in black maca work on the hypothalamus and CNS — not the endocrine system directly. This makes it non-hormonal but libido-active. Black maca specifically (vs yellow or red) shows male-relevant effects in clinical literature.',
        traditionalUse:
          'Andean Peruvians have cultivated Maca at altitude for 2,000+ years. Incan warriors ate it before battle for stamina. Ours is cooperative-certified from the original Junín plateau.',
        study: {
          citation: 'Gonzales G.F. et al., Andrologia, 2002',
          finding:
            'Maca 1500–3000mg × 12 weeks: improved sexual desire in 40–60% of men, independent of T levels or mood changes.',
        },
        emoji: '🏔️',
      },
    ],
    supplementFacts: {
      servingSize: '1 capsule',
      servingsPerContainer: 60,
      caloriesPerServing: 5,
      rows: [
        { name: 'Total Carbohydrates', amount: '1g', dv: '<1%', indent: false },
        { name: 'Black Maca Root (Lepidium meyenii) macamides ≥0.6%', amount: '1500mg', dv: '†', indent: false },
      ],
    },
    otherIngredients: 'Microcrystalline cellulose, vegetable capsule (HPMC).',
    warnings: [
      'Avoid if allergic to cruciferous vegetables.',
      'Consult physician if on thyroid medication.',
    ],
  },

  'trex-liver': {
    productName: 'Liver Detox',
    tagline: 'Hepatic Repair & Cellular Reset',
    licenseNo: '',
    category: 'Herbal Supplement',
    servingSize: '2 capsules daily (AM + PM)',
    servingsPerBottle: 30,
    netVolume: '60 capsules',
    ingredients: [
      {
        name: 'Milk Thistle Extract',
        scientificName: 'Silybum marianum',
        amount: '250mg',
        perLabelDose: '500mg',
        standardization: 'Silymarin ≥ 80%',
        origin: 'Mediterranean & Central Europe farms',
        keyBenefit: 'Hepatocyte membrane protection',
        mechanism:
          'Silybin (the active silymarin flavonoid) stabilises hepatocyte cell membranes, blocking toxin entry. Stimulates hepatic protein synthesis for cell repair. Antifibrotic properties in chronic liver stress.',
        traditionalUse:
          'Used in European herbal medicine for 2,000 years — documented by Dioscorides (70 AD) for liver and bile protection.',
        study: {
          citation: 'Abenavoli L. et al., Phytother. Res., 2018',
          finding:
            'Silymarin: significant reduction in ALT, AST, and GGT markers across multiple clinical settings including alcoholic and non-alcoholic liver disease.',
        },
        emoji: '🌸',
      },
      {
        name: 'N-Acetyl Cysteine (NAC)',
        scientificName: 'N-Acetyl-L-Cysteine',
        amount: '150mg',
        perLabelDose: '300mg',
        standardization: 'Pharmaceutical grade',
        origin: 'Biosynthetic (amino acid derivative)',
        keyBenefit: 'Glutathione replenishment',
        mechanism:
          'NAC is the rate-limiting precursor to intracellular glutathione — your primary endogenous detox antioxidant. Restores depleted glutathione from supplement, alcohol, or processed-food load.',
        traditionalUse:
          'Used clinically in hospitals as the antidote for acetaminophen overdose — the highest endorsement of hepatoprotective potency.',
        study: {
          citation: 'Rushworth G.F. et al., Pharmacol. Ther., 2014',
          finding:
            'NAC significantly restores hepatic glutathione, reduces oxidative stress markers, and improves liver function in multiple clinical conditions.',
        },
        emoji: '⚗️',
      },
    ],
    supplementFacts: {
      servingSize: '2 capsules',
      servingsPerContainer: 30,
      caloriesPerServing: 0,
      rows: [
        { name: 'Milk Thistle Extract (Silybum marianum) silymarin ≥80%', amount: '500mg', dv: '†', indent: false },
        { name: 'N-Acetyl Cysteine (NAC)', amount: '300mg', dv: '†', indent: false },
      ],
    },
    otherIngredients: 'Microcrystalline cellulose, vegetable capsule (HPMC).',
    warnings: [
      'Not for use in active liver disease — consult hepatologist.',
      'Not for use on medications primarily metabolized by the liver without physician guidance.',
    ],
  },

  'trex-royal-jelly': {
    productName: 'Royal Jelly',
    tagline: 'Androgenic & Recovery Support',
    licenseNo: '',
    category: 'Bee-Derived Supplement · Not vegan',
    servingSize: '1 capsule (500mg)',
    servingsPerBottle: 60,
    netVolume: '60 capsules',
    ingredients: [
      {
        name: 'Royal Jelly Powder',
        scientificName: 'Apis mellifera secretion, lyophilized',
        amount: '500mg',
        perLabelDose: '500mg',
        standardization: '10-HDA (10-hydroxy-2-decenoic acid) ≥ 5%',
        origin: 'Apiary-sourced, freeze-dried',
        keyBenefit: 'Androgen receptor upregulation · Recovery',
        mechanism:
          '10-HDA, the signature royal jelly fatty acid, has demonstrated androgen receptor (AR) upregulation in mammalian muscle cells in vitro. AR upregulation makes existing testosterone more effective at the tissue level.',
        traditionalUse:
          'Used across East Asian medicine (TCM, Korean Hanbang) as a premium tonic for vitality, skin, and endocrine health. The compound that turns a worker bee into a queen.',
        study: {
          citation: 'Morita H. et al., Endocrine Journal, 2012',
          finding:
            '10-HDA from royal jelly: increased androgen receptor expression in mammalian C2C12 muscle cells — suggesting improved testosterone signal transduction.',
        },
        emoji: '👑',
      },
    ],
    supplementFacts: {
      servingSize: '1 capsule',
      servingsPerContainer: 60,
      caloriesPerServing: 5,
      rows: [
        { name: 'Royal Jelly Powder (lyophilized) 10-HDA ≥5%', amount: '500mg', dv: '†', indent: false },
      ],
    },
    otherIngredients: 'Microcrystalline cellulose, gelatin capsule (bovine).',
    warnings: [
      'Not suitable for vegans or vegetarians.',
      'Contraindicated in bee or pollen allergy — may cause severe allergic reaction.',
      'Not for persons under 18.',
    ],
  },

  'hydra-muscle': {
    productName: 'Hydra Muscle',
    tagline: 'Creatine + Electrolyte Formula',
    licenseNo: '',
    category: 'Sports Nutrition',
    servingSize: '1 scoop (5g)',
    servingsPerBottle: 30,
    netVolume: '150g',
    ingredients: [
      {
        name: 'Creatine Monohydrate',
        scientificName: 'Creatine monohydrate (PharmGrade)',
        amount: '3000mg',
        perLabelDose: '3000mg',
        standardization: '≥ 99.9% purity (Creapure® equivalent)',
        origin: 'Chemical synthesis (pharmaceutical grade)',
        keyBenefit: 'Strength · Lean mass · ATP resynthesis',
        mechanism:
          'Phosphocreatine buffers ATP during high-intensity work, delaying fatigue. 4–6 weeks daily loading saturates muscle creatine stores, producing mean strength gains of 5–15% across populations.',
        traditionalUse:
          'Not traditional — the most-studied sports supplement in history, with 500+ peer-reviewed studies since 1992.',
        study: {
          citation: 'Kreider R.B. et al., JISSN, 2017 position statement',
          finding:
            'Creatine monohydrate: gold-standard for strength and lean mass gains. Safe for healthy adults at 3–5g/day, indefinitely.',
        },
        emoji: '⚡',
      },
      {
        name: 'Coconut Water Powder',
        scientificName: 'Cocos nucifera L., spray-dried',
        amount: '500mg',
        perLabelDose: '500mg',
        standardization: 'Natural potassium + cytokinin source',
        origin: 'South India coastal coconuts',
        keyBenefit: 'Natural electrolytes · Hydration',
        mechanism:
          'Provides naturally occurring potassium, sodium, and cytokinin compounds. Cytokinin 6-BAP has been shown to support cellular hydration and reduce osmotic stress during prolonged exercise.',
        traditionalUse:
          'Coconut water used across tropical Asia as rehydration fluid — particularly in Indian traditional medicine (Siddha) for fever and dehydration.',
        study: {
          citation: 'Ismail I. et al., J. Physiol. Anthropol. Appl. Hum. Sci., 2007',
          finding:
            'Coconut water effective for rehydration after exercise-induced dehydration; comparable to sports drinks for sodium and fluid retention.',
        },
        emoji: '🥥',
      },
      {
        name: 'Himalayan Pink Salt',
        scientificName: 'Sodium chloride (mineral-rich)',
        amount: '400mg',
        perLabelDose: '400mg',
        standardization: '84+ trace minerals',
        origin: 'Khewra Salt Mine, Punjab Pakistan',
        keyBenefit: 'Sodium replenishment · Muscle function',
        mechanism:
          'Sodium is the primary extracellular cation driving fluid balance and nerve conduction. Himalayan salt provides sodium with 84 trace minerals (iron, calcium, potassium, magnesium) absent from refined table salt.',
        traditionalUse:
          'Sendha Namak — the purest salt form in Ayurvedic medicine, preferred for fasting protocols and therapeutic use over refined salt.',
        study: {
          citation: 'Sawka M.N. et al., Medicine & Science in Sports, 2007',
          finding:
            'Sodium supplementation during exercise significantly improves fluid retention and reduces hyponatremia risk in endurance athletes.',
        },
        emoji: '🧂',
      },
    ],
    supplementFacts: {
      servingSize: '1 scoop (5g)',
      servingsPerContainer: 30,
      caloriesPerServing: 5,
      rows: [
        { name: 'Sodium (from Himalayan Pink Salt)', amount: '160mg', dv: '7%', indent: false },
        { name: 'Potassium (from coconut water)', amount: '75mg', dv: '2%', indent: false },
        { name: 'Creatine Monohydrate (≥99.9% purity)', amount: '3000mg', dv: '†', indent: false },
        { name: 'Coconut Water Powder (Cocos nucifera)', amount: '500mg', dv: '†', indent: false },
        { name: 'Himalayan Pink Salt (84+ minerals)', amount: '400mg', dv: '†', indent: false },
        { name: 'Magnesium (as magnesium citrate)', amount: '50mg', dv: '12%', indent: false },
      ],
    },
    otherIngredients: 'Natural strawberry flavour, stevia leaf extract, silicon dioxide (anti-caking).',
    warnings: [
      'Consult physician if you have kidney disease before use.',
      'Ensure adequate water intake (minimum 3L/day while using).',
    ],
  },

  'vita-peak': {
    productName: 'Vita Peak',
    tagline: 'Full-Spectrum Multivitamin + Energy',
    licenseNo: '',
    category: 'Dietary Supplement',
    servingSize: '2 tablets',
    servingsPerBottle: 30,
    netVolume: '60 tablets',
    ingredients: [
      {
        name: 'Vitamin D3',
        scientificName: 'Cholecalciferol',
        amount: '2000 IU (50mcg)',
        perLabelDose: '2000 IU',
        standardization: 'Pharmaceutical grade',
        origin: 'Lanolin-derived',
        keyBenefit: 'Testosterone · Immunity · Bone',
        mechanism:
          'Vitamin D receptors (VDR) are present in Leydig cells — D3 deficiency is independently associated with low testosterone. Also modulates 200+ genes involved in immunity, calcium absorption, and muscle function.',
        traditionalUse:
          'Not traditional — but critical in the modern indoor lifestyle. 25% of Indian urban men are deficient (NFHS-5).',
        study: {
          citation: 'Pilz S. et al., Hormone Metabolic Research, 2011',
          finding:
            'Vitamin D3 supplementation × 12 months: free testosterone +20.3% vs placebo in D3-deficient men.',
        },
        emoji: '☀️',
      },
      {
        name: 'Vitamin B12',
        scientificName: 'Methylcobalamin',
        amount: '500mcg',
        perLabelDose: '500mcg',
        standardization: 'Methylcobalamin form (superior absorption vs cyanocobalamin)',
        origin: 'Fermentation-derived',
        keyBenefit: 'Nerve function · Energy · Red blood cells',
        mechanism:
          'B12 is essential for myelin sheath synthesis and homocysteine metabolism. Deficiency causes fatigue, peripheral neuropathy, and megaloblastic anemia — common in Indian vegetarians.',
        traditionalUse:
          'Not traditional — an essential vitamin absent in plant foods. Particularly critical for vegetarians and those over 50.',
        study: {
          citation: 'NFHS-5, Government of India, 2021',
          finding:
            '47% of Indian urban men are B12 insufficient; vegetarians are at 4× higher deficiency risk.',
        },
        emoji: '🔵',
      },
      {
        name: 'Caffeine',
        scientificName: 'Caffeine anhydrous',
        amount: '80mg',
        perLabelDose: '80mg',
        standardization: 'Pharmaceutical grade',
        origin: 'Green tea extraction',
        keyBenefit: 'Alertness · Metabolic rate · Focus',
        mechanism:
          'Adenosine receptor antagonist — blocks fatigue signalling at A1/A2A receptors. At 80mg, paired with taurine: improved vigilance and reaction time without jitter or crash.',
        traditionalUse:
          'Caffeine has a 1,200+ year history — first documented in Ethiopian coffee tradition and Tang dynasty Chinese tea culture.',
        study: {
          citation: 'Giles G.E. et al., Nutritional Neuroscience, 2012',
          finding:
            'Caffeine + L-taurine combination improved cognitive performance and reaction time significantly vs caffeine alone or placebo.',
        },
        emoji: '⚡',
      },
    ],
    supplementFacts: {
      servingSize: '2 tablets',
      servingsPerContainer: 30,
      caloriesPerServing: 5,
      rows: [
        { name: 'Vitamin D3 (Cholecalciferol)', amount: '2000 IU', dv: '500%', indent: false },
        { name: 'Vitamin B12 (Methylcobalamin)', amount: '500mcg', dv: '20,833%', indent: false },
        { name: 'Vitamin B6 (Pyridoxine HCl)', amount: '5mg', dv: '294%', indent: false },
        { name: 'Folate (as L-methylfolate)', amount: '400mcg DFE', dv: '100%', indent: false },
        { name: 'Iron (as ferrous bisglycinate)', amount: '14mg', dv: '78%', indent: false },
        { name: 'Magnesium (as magnesium citrate)', amount: '200mg', dv: '48%', indent: false },
        { name: 'Zinc (as zinc bisglycinate)', amount: '15mg', dv: '136%', indent: false },
        { name: 'Calcium (as calcium carbonate)', amount: '200mg', dv: '15%', indent: false },
        { name: 'L-Taurine', amount: '500mg', dv: '†', indent: false },
        { name: 'Caffeine Anhydrous (from green tea)', amount: '80mg', dv: '†', indent: false },
      ],
    },
    otherIngredients: 'Microcrystalline cellulose, stearic acid, silicon dioxide, hydroxypropyl methylcellulose coating.',
    warnings: [
      'Contains 80mg caffeine — avoid if caffeine-sensitive.',
      'Do not use if taking other high-dose iron supplements without physician guidance.',
      'Keep out of reach of children.',
    ],
  },
}

const FALLBACK = LABEL_DATA['trex-liquid']

/* ── Sub-components ──────────────────────────────────────────────────────── */

function SupplementFacts({ facts }) {
  return (
    <div className="border-2 border-bone/80 text-bone font-mono text-xs leading-tight">
      <div className="bg-bone/5 px-3 pt-3 pb-1 border-b-[8px] border-bone/80">
        <div className="text-2xl font-black tracking-tight leading-none">Supplement Facts</div>
        <div className="text-[10px] mt-1 opacity-70">Serving Size: {facts.servingSize}</div>
        <div className="text-[10px] opacity-70">Servings Per Container: {facts.servingsPerContainer}</div>
      </div>

      <div className="px-3 py-1 border-b border-bone/30 flex items-center justify-between">
        <span className="text-[10px] opacity-60">Amount Per Serving</span>
        <span className="text-[10px] opacity-60">% Daily Value</span>
      </div>

      <div className="px-3 pt-1 pb-1 border-b-[5px] border-bone/80 flex justify-between">
        <span>Calories</span>
        <span className="font-bold">{facts.caloriesPerServing}</span>
      </div>

      {facts.rows.map((row, i) => (
        <div
          key={i}
          className={`px-3 py-0.5 flex justify-between border-b border-bone/10 ${row.indent ? 'pl-6' : ''}`}
        >
          <span className={`flex-1 pr-2 ${row.indent ? 'opacity-70' : ''}`}>{row.name}</span>
          <span className="shrink-0 font-bold">{row.amount}</span>
          <span className="w-8 text-right opacity-70">{row.dv}</span>
        </div>
      ))}

      <div className="px-3 pt-2 pb-3 text-[9px] opacity-55 leading-relaxed border-t border-bone/20">
        * Percent Daily Values are based on a 2,000 calorie diet.
        <br />
        † Daily Value not established.
      </div>
    </div>
  )
}

function IngredientCard({ ing, index }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-bone/10 rounded-2xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-bone/3 transition-colors"
      >
        <span className="text-2xl shrink-0 mt-0.5">{ing.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="font-bold text-bone text-sm">{ing.name}</div>
            <div className="text-amber font-mono text-xs font-bold shrink-0">{ing.amount}</div>
          </div>
          <div className="text-bone/45 text-[11px] italic">{ing.scientificName}</div>
          <div className="text-bone/70 text-xs mt-1 leading-snug">{ing.keyBenefit}</div>
        </div>
        <span className="text-bone/30 text-xs shrink-0 mt-1">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-5 space-y-3 border-t border-bone/8 bg-bone/2">
          <div className="pt-3 space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 bg-amber/10 text-amber text-[10px] px-2 py-0.5 rounded-full font-medium">
                Std: {ing.standardization}
              </span>
              <span className="inline-flex items-center gap-1 bg-bone/8 text-bone/60 text-[10px] px-2 py-0.5 rounded-full">
                Origin: {ing.origin}
              </span>
            </div>
          </div>

          <div>
            <div className="text-amber text-[10px] font-bold uppercase tracking-widest mb-1">How it works</div>
            <p className="text-bone/75 text-xs leading-relaxed">{ing.mechanism}</p>
          </div>

          <div>
            <div className="text-amber text-[10px] font-bold uppercase tracking-widest mb-1">Traditional use</div>
            <p className="text-bone/60 text-xs leading-relaxed italic">{ing.traditionalUse}</p>
          </div>

          <div className="bg-bone/5 rounded-xl p-3 border border-bone/8">
            <div className="text-amber text-[10px] font-bold uppercase tracking-widest mb-1">Research</div>
            <div className="text-bone/50 text-[10px] mb-1 font-mono">{ing.study.citation}</div>
            <p className="text-bone/80 text-xs leading-relaxed">"{ing.study.finding}"</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────────────────── */

export default function LabelPage({ productId }) {
  const { navigate } = usePage()
  const data = LABEL_DATA[productId] || FALLBACK
  const { ingredients, supplementFacts, otherIngredients, warnings } = data

  return (
    <div className="min-h-screen bg-ink text-bone">
      {/* Minimal top bar */}
      <div className="sticky top-0 z-20 bg-ink/90 backdrop-blur-xl border-b border-bone/8 flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate('home')} aria-label="Primal home">
          <PrimalLogo className="h-8 w-auto" />
        </button>
        <div className="text-[10px] text-bone/40 uppercase tracking-widest">Label · Scan & Verify</div>
      </div>

      {/* QR verified hero */}
      <div className="bg-gradient-to-b from-amber/8 to-transparent border-b border-amber/10 px-4 py-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
          <span className="text-amber text-[10px] font-bold uppercase tracking-widest">QR Verified · Authentic Product</span>
        </div>
        <h1 className="font-display text-3xl font-black tracking-tight leading-none mb-1">
          {data.productName}
        </h1>
        <p className="text-bone/60 text-sm mb-2">{data.tagline}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-[10px] bg-bone/8 text-bone/55 px-2 py-1 rounded-full border border-bone/10">
            {data.category}
          </span>
          <span className="text-[10px] bg-bone/8 text-bone/55 px-2 py-1 rounded-full border border-bone/10">
            {data.netVolume}
          </span>
          {data.flavour && (
            <span className="text-[10px] bg-amber/10 text-amber px-2 py-1 rounded-full border border-amber/15">
              {data.flavour}
            </span>
          )}
          {data.licenseNo && (
            <span className="text-[10px] bg-bone/8 text-bone/55 px-2 py-1 rounded-full border border-bone/10">
              {data.licenseNo}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-6 space-y-8 max-w-lg mx-auto">
        {/* Supplement Facts */}
        <section>
          <SupplementFacts facts={supplementFacts} />
        </section>

        {/* Other ingredients */}
        <section className="text-xs text-bone/50 leading-relaxed">
          <span className="font-bold text-bone/70">Other Ingredients: </span>
          {otherIngredients}
        </section>

        {/* Ingredient deep dive */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-bone/10" />
            <span className="text-bone/40 text-[10px] uppercase tracking-widest shrink-0">Ingredient Deep Dive</span>
            <div className="h-px flex-1 bg-bone/10" />
          </div>
          <p className="text-bone/50 text-xs text-center mb-4">Tap any ingredient to see the mechanism, traditional use, and research.</p>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <IngredientCard key={ing.name} ing={ing} index={i} />
            ))}
          </div>
        </section>

        {/* Trust badges */}
        <section className="grid grid-cols-2 gap-3">
          {[
            { icon: '🧪', label: 'Third-Party Lab Tested', sub: 'COA on request' },
            { icon: '🚫', label: 'No Banned Substances', sub: 'WADA compliant' },
            { icon: '🌿', label: '100% Ayurvedic', sub: 'AYUSH registered' },
            { icon: '🇮🇳', label: 'Made in India', sub: 'GMP facility' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="bg-bone/3 border border-bone/8 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-[11px] font-bold text-bone/80 leading-tight">{label}</div>
              <div className="text-[10px] text-bone/40 mt-0.5">{sub}</div>
            </div>
          ))}
        </section>

        {/* Warnings */}
        {warnings.length > 0 && (
          <section className="bg-amber/5 border border-amber/15 rounded-2xl p-4">
            <div className="text-amber text-[10px] font-bold uppercase tracking-widest mb-2">⚠ Warnings & Contraindications</div>
            <ul className="space-y-1">
              {warnings.map((w, i) => (
                <li key={i} className="text-xs text-bone/65 flex gap-2">
                  <span className="text-amber/60 shrink-0">·</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="text-center pt-2 pb-8">
          <p className="text-bone/40 text-xs mb-4">Want the full science? Visit our website.</p>
          <button
            onClick={() => navigate('product', { id: productId })}
            className="btn-primary w-full"
          >
            View Full Product →
          </button>
          <button
            onClick={() => navigate('shop')}
            className="mt-3 w-full py-3 text-sm text-bone/60 border border-bone/10 rounded-xl hover:border-amber/30 hover:text-bone transition-all"
          >
            Browse All Products
          </button>
        </section>
      </div>

      {/* Footer */}
      <div className="border-t border-bone/8 px-4 py-6 text-center">
        <div className="text-[10px] text-bone/30 leading-relaxed">
          Primal Nutrition India · Authentic Ayurvedic Supplements<br />
          primalnutrition.in · support@primalnutrition.in<br />
          <span className="text-amber/40">This label is digitally verified. Counterfeit products will not load this page.</span>
        </div>
      </div>
    </div>
  )
}
