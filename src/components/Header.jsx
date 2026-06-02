import { useEffect, useState } from 'react'
import CartButton from './CartButton.jsx'
import PrimalLogo from './PrimalLogo.jsx'
import { usePage } from '../context/RouterContext.jsx'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { page, navigate } = usePage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (p) => { navigate(p); setMenuOpen(false) }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-ink/85 backdrop-blur-xl border-b border-bone/5' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex items-center justify-between h-16 lg:h-20">
        <button onClick={() => go('home')} className="flex items-center group" aria-label="Primal Nutrition home">
          <PrimalLogo className="h-12 w-auto" />
        </button>

        <nav className="hidden lg:flex items-center gap-1 text-sm bg-ink-800/60 border border-bone/10 rounded-full p-1 backdrop-blur-sm">
          <Tab active={page === 'home'} onClick={() => go('home')}>Home</Tab>
          <Tab active={page === 'shop'} onClick={() => go('shop')}>Shop</Tab>
          <Tab active={page === 'stacks'} onClick={() => go('stacks')}>Stacks</Tab>
          <Tab active={page === 'shilajit-guide'} onClick={() => go('shilajit-guide')}>Shilajit</Tab>
          <Tab active={page === 'dealer'} onClick={() => go('dealer')}>Dealer</Tab>
        </nav>

        <div className="flex items-center gap-3">
          <CartButton />
          <button
            onClick={() => go('shop')}
            className="btn-primary !py-2.5 !px-5 text-sm hidden sm:inline-flex"
          >
            Shop
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-bone/15 hover:border-amber hover:text-amber transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-ink/95 backdrop-blur-xl border-t border-bone/10 px-6 py-4 flex flex-col gap-1">
          {[
            ['home', 'Home'],
            ['shop', 'Shop'],
            ['stacks', 'Stacks'],
            ['shilajit-guide', 'Shilajit Purity Guide'],
            ['dealer', 'Become a Dealer'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                page === id ? 'bg-amber/15 text-amber' : 'text-bone/70 hover:text-bone hover:bg-bone/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-1.5 rounded-full font-medium text-sm transition-colors ${
        active ? 'bg-gradient-primal text-bone shadow-[0_4px_18px_-4px_rgb(var(--c-grad-3)/0.55)]' : 'text-bone/65 hover:text-bone'
      }`}
    >
      {children}
    </button>
  )
}
