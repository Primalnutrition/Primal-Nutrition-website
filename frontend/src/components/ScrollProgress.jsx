import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setP(h > 0 ? (window.scrollY / h) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-50 h-[2px] bg-bone/[0.04] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-amber-dark via-amber to-amber-light shadow-[0_0_12px_rgba(228,183,101,0.6)]"
        style={{ width: `${p}%`, transition: 'width 0.12s linear' }}
      />
    </div>
  )
}
