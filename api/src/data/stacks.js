/**
 * Server-side stack (bundle) definitions — mirror of src/data/stacks.js on the
 * storefront. The discount advertised on the Stacks page / PDP upsell is
 * applied here, against DB-authoritative prices, so what the customer sees is
 * what Razorpay charges.
 *
 * Keep ids/discounts in sync with the frontend file.
 */
const STACKS = [
  { id: 'apex', discount: 0.05, variantIds: ['trex-1', 'rj-60'] },
  { id: 'testosterone', discount: 0.08, variantIds: ['trex-1', 'tong-60'] },
  { id: 'recovery', discount: 0.07, variantIds: ['trex-1', 'liver-60'] },
  { id: 'strength', discount: 0.10, variantIds: ['trex-1', 'hydra-1'] },
  { id: 'vitality', discount: 0.08, variantIds: ['trex-1', 'gin-60'] },
  { id: 'elite-athlete', discount: 0.10, variantIds: ['trex-1', 'cord-60', 'vp-60'] },
]

/**
 * Greedy bundle matcher: highest-discount stacks claim their items first, and
 * each unit of quantity is consumed by at most one stack (every stack contains
 * the T-Rex 500ml, so overlaps are real).
 *
 * @param {Array<{ variant_id: string, qty: number, unit_price: number }>} lineItems
 * @returns {{ discount: number, applied: Array<{ stackId: string, sets: number, amount: number }> }}
 */
export function computeStackDiscount(lineItems) {
  const avail = new Map()
  const price = new Map()
  for (const li of lineItems) {
    avail.set(li.variant_id, (avail.get(li.variant_id) || 0) + li.qty)
    price.set(li.variant_id, Number(li.unit_price))
  }

  let discount = 0
  const applied = []
  const ordered = [...STACKS].sort((a, b) => b.discount - a.discount)
  for (const stack of ordered) {
    const sets = Math.min(...stack.variantIds.map((v) => avail.get(v) || 0))
    if (!sets) continue
    const setPrice = stack.variantIds.reduce((sum, v) => sum + (price.get(v) || 0), 0)
    const amount = Math.round(setPrice * stack.discount) * sets
    if (amount <= 0) continue
    discount += amount
    applied.push({ stackId: stack.id, sets, amount })
    stack.variantIds.forEach((v) => avail.set(v, avail.get(v) - sets))
  }
  return { discount, applied }
}
