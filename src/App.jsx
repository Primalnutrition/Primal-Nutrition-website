import { useEffect, lazy, Suspense } from 'react'
import { CartProvider } from './context/CartContext.jsx'
import { RouterProvider, usePage } from './context/RouterContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import TrustStrip from './components/TrustStrip.jsx'
import Problem from './components/Problem.jsx'
import ProductDeepDive from './components/ProductDeepDive.jsx'
import Ingredients from './components/Ingredients.jsx'
import LabTested from './components/LabTested.jsx'
import Comparison from './components/Comparison.jsx'
import Results from './components/Results.jsx'
import Founder from './components/Founder.jsx'
import Reviews from './components/Reviews.jsx'
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

function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <TrustStrip />
        <Problem />
        <ProductDeepDive />
        <Ingredients />
        <LabTested />
        <Results />
        <Comparison />
        <Founder />
        <Reviews />
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

    document
      .querySelectorAll('[data-reveal], [data-reveal-stagger]')
      .forEach((el) => obs.observe(el))

    return () => obs.disconnect()
  }, [page, productId])

  const fallback = <div className="min-h-screen" />
  if (page === 'product') return <Suspense fallback={fallback}><ProductDetail productId={productId} /></Suspense>
  if (page === 'shop') return <Suspense fallback={fallback}><ShopPage /></Suspense>
  if (page === 'stacks') return <Suspense fallback={fallback}><StacksPage /></Suspense>
  if (page === 'dealer') return <Suspense fallback={fallback}><DealerPage /></Suspense>
  if (page === 'shilajit-guide') return <Suspense fallback={fallback}><ShilajitGuide /></Suspense>
  return <HomePage />
}

function AppShell() {
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
