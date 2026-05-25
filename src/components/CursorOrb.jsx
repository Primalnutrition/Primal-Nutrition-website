import { useEffect, useRef } from 'react'

export default function CursorOrb() {
  const ref = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const node = ref.current
    if (!node) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let x = tx
    let y = ty
    let raf

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
    }
    const tick = () => {
      x += (tx - x) * 0.09
      y += (ty - y) * 0.09
      node.style.transform = `translate3d(${x - 220}px, ${y - 220}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[1] hidden lg:block"
      style={{ mixBlendMode: 'plus-lighter' }}
    >
      <div className="w-[440px] h-[440px] rounded-full bg-amber/30 blur-[130px] opacity-30" />
    </div>
  )
}
