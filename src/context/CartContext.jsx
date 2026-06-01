import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { products } from '../data/products.js'
import { track } from '../lib/metaPixel.js'

const CartContext = createContext(null)
const STORAGE_KEY = 'primal-cart-v1'

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return { items: action.items || [] }
    case 'add': {
      const idx = state.items.findIndex(
        (i) => i.productId === action.productId && i.variantId === action.variantId
      )
      if (idx >= 0) {
        const items = state.items.slice()
        items[idx] = { ...items[idx], qty: items[idx].qty + (action.qty || 1) }
        return { items }
      }
      return {
        items: [
          ...state.items,
          { productId: action.productId, variantId: action.variantId, qty: action.qty || 1 },
        ],
      }
    }
    case 'remove':
      return { items: state.items.filter((_, i) => i !== action.index) }
    case 'updateQty':
      return {
        items: state.items.map((it, i) =>
          i === action.index ? { ...it, qty: Math.max(1, action.qty) } : it
        ),
      }
    case 'clear':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const [isOpen, setOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed?.items)) dispatch({ type: 'hydrate', items: parsed.items })
      }
    } catch {}
    setHydrated(true)
  }, [])

  // Persist
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }))
    } catch {}
  }, [state.items, hydrated])

  const showToast = useCallback((text) => {
    const id = Date.now() + Math.random()
    setToast({ id, text })
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2600)
  }, [])

  const addToCart = useCallback(
    (productId, variantId, qty = 1, openDrawer = false) => {
      dispatch({ type: 'add', productId, variantId, qty })
      const product = products.find((p) => p.id === productId)
      const variant = product?.variants.find((v) => v.id === variantId)
      showToast(`${product?.name || 'Item'}${variant ? ' — ' + variant.label : ''} added`)
      if (openDrawer) setOpen(true)
      if (product && variant) {
        track('AddToCart', {
          content_ids: [variantId || productId],
          content_name: product.name,
          content_type: 'product',
          value: variant.price * qty,
          currency: 'INR',
          num_items: qty,
        })
      }
    },
    [showToast]
  )

  const lineItems = state.items
    .map((it) => {
      const product = products.find((p) => p.id === it.productId)
      const variant = product?.variants.find((v) => v.id === it.variantId)
      if (!product || !variant) return null
      return { ...it, product, variant }
    })
    .filter(Boolean)

  const subtotal = lineItems.reduce((s, l) => s + l.variant.price * l.qty, 0)
  const compareSubtotal = lineItems.reduce(
    (s, l) => s + (l.variant.compareAt || l.variant.price) * l.qty,
    0
  )
  const count = lineItems.reduce((s, l) => s + l.qty, 0)

  const value = {
    lineItems,
    subtotal,
    compareSubtotal,
    count,
    isOpen,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    addToCart,
    removeItem: (i) => dispatch({ type: 'remove', index: i }),
    updateQty: (i, qty) => dispatch({ type: 'updateQty', index: i, qty }),
    clearCart: () => dispatch({ type: 'clear' }),
    toast,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
