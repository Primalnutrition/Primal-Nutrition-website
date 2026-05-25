import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'primal-theme-v1'

export const THEMES = [
  {
    id: 'a',
    label: 'A',
    name: 'Primal Brand',
    sub: 'Black · Red · Blue (official)',
    reads: 'Aligned to Primal Nutrition brand guide',
    swatch: ['#0A0A0A', '#C8101F', '#1F4788', '#F5F1E8'],
  },
  {
    id: 'b',
    label: 'B',
    name: 'Clinical Premium',
    sub: 'Charcoal + Deep Teal',
    reads: 'AG1 × Thorne × Hims',
    swatch: ['#0C1116', '#467A82', '#134E4A', '#506478'],
  },
  {
    id: 'c',
    label: 'C',
    name: 'Heritage Gold',
    sub: 'Black + Amber + Forest',
    reads: 'Onnit × Banyan hybrid',
    swatch: ['#0A0A0A', '#C8923D', '#1F3A2B', '#A0421C'],
  },
]

const VALID = new Set(THEMES.map((t) => t.id))

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)
      if (stored && VALID.has(stored)) return stored
    } catch {}
    return 'a' // default: official Primal Brand
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch {}
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
