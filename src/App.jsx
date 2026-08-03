import React, { useEffect, lazy, Suspense } from 'react'
import { CartProvider } from './context/CartContext.jsx'
import { RouterProvider, usePage } from './context/RouterContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import BannerCarousel from './components/BannerCarousel.jsx'
import TrustStrip from './components/TrustStrip.jsx'
import Problem from './components/Problem.jsx'
import ProductDeepDive from './components/ProductDeepDive.jsx'
import Ingredients from './components/Ingredients.jsx'
import LabTested from './components/LabTested.jsx'
import Comparison from './components/Comparison.jsx'
import Results from './components/Results.jsx'
import Founder from './components/Founder.jsx'
import Reviews from './components/Reviews.jsx'
import RareHerbBanner from './components/RareHerbBanner.jsx'
import PromoBanner from './components/PromoBanner.jsx'
import Bundle from './components/Bundle.jsx'
import FAQ from './components/FAQ.jsx'
import StickyCTA from './components/StickyCTA.jsx'
import Footer from './components/Footer.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import CursorOrb from './components/CursorOrb.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Toast from './components/Toast.jsx'

const ShopPage = lazy(() => import('./components/ShopPage.jsx'))
const ProductDetail = lazy(() => import('./components/ProductDetail.jsx'))
const StacksPage = lazy(() => import('./components/StacksPage.jsx'))
const DealerPage = lazy(() => import('./components/DealerPage.jsx'))
const ShilajitGuide = lazy(() => import('./components/ShilajitGuide.jsx'))
const LabelPage = lazy(() => import('./components/LabelPage.jsx'))
const ProductInfoPage = lazy(() => import('./components/ProductInfoPage.jsx'))

function HomePage() {
  return (
    <>
      <main>
        <BannerCarousel />
        <Hero />
        <TrustStrip />
        <PromoBanner
          base="/brand/promo-hero"
          href="#bundle"
          ariaLabel="Buy T-Rex — India's first 7-in-1 natural liquid"
          alt="T-Rex — India's First 7-in-1 Natural Liquid. Himalayan Shilajit + 6 Ayurvedic herbs. Buy now — ₹1,999."
        />
        <Problem />
        <PromoBanner
          base="/brand/promo-dangerous"
          href="#/shop"
          ariaLabel="Shop T-Rex — for men who choose to be dangerous"
          alt="T-Rex — 7-in-1 Natural Liquid. For men who choose to be dangerous. 12,400+ verified buyers."
        />
        <ProductDeepDive />
        <Ingredients />
        <PromoBanner
          base="/brand/promo-sourcing"
          href="#/shilajit-guide"
          ariaLabel="Read the Shilajit Purity Guide — sourced from the rarest corners of the earth"
          alt="T-Rex — Sourced from the rarest corners of the earth."
        />
        <LabTested />
        <Results />
        <Comparison />
        <Founder />
        <Reviews />
        <PromoBanner
          base="/brand/promo-androgens"
          href="#/shop"
          ariaLabel="Explore the Rare Herb Series — Royal Jelly, Tongkat Ali, Black Maca"
          alt="Nature's Most Potent Androgens — Royal Jelly, Tongkat Ali, Black Maca. Explore the Rare Herb Series."
        />
        <RareHerbBanner />
        <Bundle />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}

function PageBody() {
  const { page, productId } = usePage()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const sections = document.querySelectorAll('main > section, body > section')
    sections.forEach((s, i) => {
      if (page === 'home' && i === 0) return
      if (!s.hasAttribute('data-reveal')) s.setAttribute('data-reveal', '')
    })

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-revealed', '')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -80px 0px' }
    )

    const observeAll = () =>
      document
        .querySelectorAll('[data-reveal], [data-reveal-stagger]')
        .forEach((el) => obs.observe(el))

    // Immediate pass — catches synchronously-rendered content
    observeAll()

    // Delayed pass — catches content rendered after lazy-import resolves
    const t1 = setTimeout(observeAll, 150)
    const t2 = setTimeout(observeAll, 600)

    return () => { obs.disconnect(); clearTimeout(t1); clearTimeout(t2) }
  }, [page, productId])

  // Visible fallback — bare divs hide both normal lazy-load delays AND the
  // failure case where a stale index.html references a chunk hash that no
  // longer exists on the CDN (post-deploy). Without something on screen,
  // users see a fully blank page with no console error.
  const fallback = (
    <div className="min-h-screen flex items-center justify-center text-bone/60 text-sm">
      <span className="inline-block w-3 h-3 mr-3 rounded-full bg-amber animate-pulse" />
      Loading…
    </div>
  )
  const guarded = (node) => (
    <ChunkLoadBoundary>
      <Suspense fallback={fallback}>{node}</Suspense>
    </ChunkLoadBoundary>
  )
  if (page === 'product') return guarded(<ProductDetail productId={productId} />)
  if (page === 'shop') return guarded(<ShopPage />)
  if (page === 'stacks') return guarded(<StacksPage />)
  if (page === 'dealer') return guarded(<DealerPage />)
  if (page === 'shilajit-guide') return guarded(<ShilajitGuide />)
  if (page === 'label') return guarded(<LabelPage productId={productId} />)
  if (page === 'product-info') return guarded(<ProductInfoPage productId={productId} />)
  return <HomePage />
}

// Catches chunk-load failures (typical after a deploy: cached index.html
// references chunk hashes the CDN no longer serves, fetch 404s, React
// throws an unhandled rejection that the bare Suspense fallback hides).
// Surfaces a refresh prompt instead of a blank page.
class ChunkLoadBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { err: null }
  }
  static getDerivedStateFromError(err) {
    return { err }
  }
  componentDidCatch(err) {
    // eslint-disable-next-line no-console
    console.error('[ChunkLoadBoundary] caught:', err)
  }
  render() {
    if (!this.state.err) return this.props.children
    const msg = String(this.state.err?.message || this.state.err || '')
    const isChunk = /Loading chunk|Failed to fetch dynamically imported module|ChunkLoadError/i.test(msg)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="font-display text-2xl text-bone mb-3">
            {isChunk ? 'This page just updated.' : 'Something broke.'}
          </div>
          <p className="text-bone/65 text-sm mb-6">
            {isChunk
              ? 'Refresh to load the latest version.'
              : msg || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }
}

function AppShell() {
  const { page } = usePage()
  const isLabel = page === 'label' || page === 'product-info'

  if (isLabel) {
    return (
      <div className="min-h-screen bg-ink text-bone">
        <PageBody />
        <Toast />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink text-bone overflow-hidden relative">
      <ScrollProgress />
      <CursorOrb />
      <Header />
      <PageBody />
      <StickyCTA />
      <CartDrawer />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </RouterProvider>
    </ThemeProvider>
  )
}
