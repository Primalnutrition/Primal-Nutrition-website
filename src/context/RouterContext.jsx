import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { track } from '../lib/metaPixel.js'

const RouterContext = createContext(null)

const PAGES = new Set(['home', 'shop', 'stacks', 'dealer', 'shilajit-guide', 'label', 'product-info'])

function readRoute() {
  if (typeof window === 'undefined') return { page: 'home' }
  const segments = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [head, sub] = segments
  if (head === 'product' && sub) return { page: 'product', productId: sub }
  if (head === 'label') return { page: 'label', productId: sub || 'trex-liquid' }
  if (head === 'product-info') return { page: 'product-info', productId: sub || null }
  if (PAGES.has(head)) return { page: head }
  // No hash: fall back to ?p= / ?page=. Ad platforms append their own tracking
  // params (fbclid, utm_id, utm_term) to the end of the click URL, which lands
  // them after the "#" and destroys the fragment — so a hash-only deep link
  // silently drops every paid visitor on the homepage. A query param survives
  // that, because appending to a query string is exactly what they expect.
  if (segments.length === 0) {
    const params = new URLSearchParams(window.location.search)
    const productId = params.get('p')
    if (productId) return { page: 'product', productId }
    const page = params.get('page')
    if (page && PAGES.has(page)) return { page }
  }
  return { page: 'home' }
}

function buildHash(route) {
  if (route.page === 'product' && route.productId) return `#/product/${route.productId}`
  if ((route.page === 'label' || route.page === 'product-info') && route.productId) return `#/${route.page}/${route.productId}`
  if (route.page === 'home') return ''
  if (PAGES.has(route.page)) return `#/${route.page}`
  return ''
}

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(readRoute)
  // Initial PageView is fired by the inline pixel snippet in index.html.
  // Skip the first effect run so we don't double-count.
  const firstRun = useRef(true)

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Rewrite a ?p= / ?page= entry to its canonical hash form once, on mount.
  // Without this the param stays in location.search, and because navigate()
  // preserves the search string, going Home would leave "?p=…" with an empty
  // hash — so the next hashchange or reload would bounce the visitor back to
  // the product page. Runs after attribution.js has already read the UTMs, and
  // only deletes p/page, so the attribution parameters are left untouched.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('p') && !params.has('page')) return
    params.delete('p')
    params.delete('page')
    const search = params.toString()
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${search ? `?${search}` : ''}${buildHash(readRoute())}`,
    )
  }, [])

  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return }
    track('PageView')
  }, [route])

  const navigate = useCallback((next, params = {}, { scroll = true } = {}) => {
    let route
    if (next === 'product' && params.id) {
      route = { page: 'product', productId: params.id }
    } else if ((next === 'label' || next === 'product-info') && params.id) {
      route = { page: next, productId: params.id }
    } else if (PAGES.has(next)) {
      route = { page: next }
    } else {
      route = { page: 'home' }
    }

    const hash = buildHash(route)
    const url = `${window.location.pathname}${window.location.search}${hash}`
    window.history.pushState(null, '', url)
    setRoute(route)
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <RouterContext.Provider value={{ ...route, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

export function usePage() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('usePage must be used inside <RouterProvider>')
  return ctx
}
