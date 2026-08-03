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
    theme: 'TREX + Cordyceps',
    promise: 'The two-product floor for serious training output.',
    pitch: 'T-Rex (hormonal base) + Cordyceps (VO₂ + endurance). The complete daily performance protocol.',
    items: [
      { productId: 'trex-liquid', variantId: 'trex-1' },
      { productId: 'trex-cordyceps', variantId: 'cord-60' },
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
  const save = stackSave(stack)
  return { mrp: totalFull, price: totalFull - save, save }
}

function variantPrice(variantId) {
  for (const p of products) {
    const v = p.variants.find((x) => x.id === variantId)
    if (v) return v.price
  }
  return 0
}

function stackSave(stack) {
  const setPrice = stack.items.reduce((s, it) => s + variantPrice(it.variantId), 0)
  return Math.round(setPrice * stack.discount)
}

/**
 * Cart-level bundle discount — MUST stay in lockstep with the server's
 * api/src/data/stacks.js (same greedy highest-discount-first matcher, same
 * rounding), since the server version is what actually prices the order.
 *
 * @param {Array<{ variantId: string, qty: number }>} cartItems
 * @returns {{ discount: number, applied: Array<{ id: string, name: string, sets: number, amount: number }> }}
 */
export function computeStackDiscount(cartItems) {
  const avail = new Map()
  for (const it of cartItems) avail.set(it.variantId, (avail.get(it.variantId) || 0) + it.qty)

  let discount = 0
  const applied = []
  const ordered = [...stacks].sort((a, b) => b.discount - a.discount)
  for (const stack of ordered) {
    const sets = Math.min(...stack.items.map((it) => avail.get(it.variantId) || 0))
    if (!sets) continue
    const amount = stackSave(stack) * sets
    if (amount <= 0) continue
    discount += amount
    applied.push({ id: stack.id, name: stack.name, sets, amount })
    stack.items.forEach((it) => avail.set(it.variantId, avail.get(it.variantId) - sets))
  }
  return { discount, applied }
}
