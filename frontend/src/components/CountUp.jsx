import { useEffect, useState } from 'react'
import useReveal from '../hooks/useReveal.js'

export default function CountUp({
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ',',
}) {
  const [ref, shown] = useReveal({ threshold: 0.4, rootMargin: '0px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!shown) return
    let raf
    const start = performance.now()
    const ease = (t) => 1 - Math.pow(1 - t, 3.2)
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      setVal(end * ease(t))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [shown, end, duration])

  const fmt = (n) => {
    const fixed = n.toFixed(decimals)
    const [intp, decp] = fixed.split('.')
    const intFormatted = intp.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    return decp ? `${intFormatted}.${decp}` : intFormatted
  }

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {fmt(val)}
      {suffix}
    </span>
  )
}
