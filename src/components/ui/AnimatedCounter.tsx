import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../lib/utils'

interface Props {
  value: string // e.g. "13+", "100%", "FREE"
  className?: string
  duration?: number
}

/** Counts up numeric values when scrolled into view; renders text values directly. */
export default function AnimatedCounter({ value, className, duration = 1600 }: Props) {
  const match = value.match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : null
  const suffix = match ? match[2] : ''
  const [display, setDisplay] = useState(target === null ? value : '0')
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (target === null) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        if (prefersReducedMotion()) {
          setDisplay(`${target}${suffix}`)
          return
        }
        const t0 = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay(`${Math.round(target * eased)}${p === 1 ? suffix : ''}`)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, suffix, duration])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
