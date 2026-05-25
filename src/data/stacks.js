/* Curated bundles per directive 10.1–10.3.
   Each stack: name, theme, included products (with variant), bundle price
   computed from sum of variants × (1 - discount). */
import { products } from './products.js'

export const stacks = [
  {
    id: 'apex',
    name: 'The Apex Stack',
    theme: 'TREX + Royal Jelly',
    promise: 'For the man chasing more T, more lean mass, and faster recovery.',
    pitch: 'Foundational adaptogen base from T-Rex stacked with bee-derived androgenic support from Royal Jelly. Recovery and muscle synthesis layered on top of the 7-in-1.',
    items: [
      { productId: 'trex-liquid', variantId: 'trex-1' },
      { productId: 'trex-royal-jelly', variantId: 'rj-60' },
    ],
    discount: 0.05,
    badge: 'Signature',
    accent: 'from-amber to-rust',
  },
  {
    id: 'testosterone',
    name: 'Testosterone Stack',
    theme: 'TREX + Tongkat Ali',
    promise: 'Maximum natural T-support for the plateaued lifter.',
    pitch: 'T-Rex provides the adaptogenic foundation. Standalone Tongkat Ali (2% eurycomanone std.) adds direct free-testosterone release on top.',
    items: [
      { productId: 'trex-liquid', variantId: 'trex-1' },
      { productId: 'trex-tongkat', variantId: 'tong-60' },
    ],
    discount: 0.08,
    badge: 'Best for Strength',
    accent: 'from-amber to-rust',
  },
  {
    id: 'recovery',
    name: 'Recovery Stack',
    theme: 'TREX + Liver Detox',
    promise: 'For the man who lifts hard and lives hard.',
    pitch: 'T-Rex builds the daily floor. Liver Detox runs a quarterly 14-day cleanse to repair what training, alcohol, and processed food cost you.',
    items: [
      { productId: 'trex-liquid', variantId: 'trex-1' },
      { productId: 'trex-liver', variantId: 'liver-60' },
    ],
    discount: 0.07,
    badge: 'Hard Living',
    accent: 'from-forest to-amber-dark',
  },
  {
    id: 'strength',
    name: 'Strength Stack',
    theme: 'TREX + Hydra Muscle',
    promise: 'Hormonal foundation + workout-day fuel.',
    pitch: 'T-Rex compounds testosterone and recovery across 30 days. Hydra Muscle adds 5g creatine + electrolytes for the training session itself.',
    items: [
      { productId: 'trex-liquid', variantId: 'trex-1' },
      { productId: 'hydra-muscle', variantId: 'hydra-1' },
    ],
    discount: 0.10,
    badge: 'Best Value',
    accent: 'from-amber-light to-amber',
  },
  {
    id: 'vitality',
    name: 'Vitality Stack',
    theme: 'TREX + Korean Panax Ginseng',
    promise: 'Drive, cognition, and libido — the executive performance pack.',
    pitch: 'T-Rex regulates cortisol and lifts free T. Korean Panax adds focused energy and libido support through ginsenoside Rg1/Rb1.',
    items: [
      { productId: 'trex-liquid', variantId: 'trex-1' },
      { productId: 'trex-ginseng', variantId: 'gin-60' },
    ],
    discount: 0.08,
    badge: 'Executive Pack',
    accent: 'from-rust to-amber',
  },
  {
    id: 'elite-athlete',
    name: 'Elite Athlete Stack',
    theme: 'TREX + Cordyceps + Vita Peak',
    promise: 'The three-product floor for serious training output.',
    pitch: 'T-Rex (hormonal base) + Cordyceps (VO₂ + endurance) + Vita Peak (daily micronutrient floor + clean AM caffeine). The complete daily protocol.',
    items: [
      { productId: 'trex-liquid', variantId: 'trex-1' },
      { productId: 'trex-cordyceps', variantId: 'cord-60' },
      { productId: 'vita-peak', variantId: 'vp-60' },
    ],
    discount: 0.10,
    badge: 'Performance Pro',
    accent: 'from-amber-dark to-forest',
  },
]

/* Helper: compute stack pricing from real product variants */
export function pricingFor(stack) {
  const totalFull = stack.items.reduce((sum, it) => {
    const p = products.find((x) => x.id === it.productId)
    const v = p?.variants.find((x) => x.id === it.variantId)
    return sum + (v?.price || 0)
  }, 0)
  const bundlePrice = Math.round(totalFull * (1 - stack.discount))
  return { mrp: totalFull, price: bundlePrice, save: totalFull - bundlePrice }
}
