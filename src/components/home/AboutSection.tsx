import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fan, Snowflake, Flame, Gauge } from 'lucide-react'
import { prefersReducedMotion } from '../../lib/utils'
import Logo from '../layout/Logo'

gsap.registerPlugin(ScrollTrigger)

const PARAGRAPH =
  "We at Burton's Reliable Heating and Air Conditioning aim to prove that honest HVAC companies still exist. It's an honor to be trusted and invited into your home, and we'll do everything we can to impress you."

const CHIPS = [
  { icon: Snowflake, cls: 'left-[4%] top-[18%] from-electric-300/60 to-royal-500/50 rotate-[-8deg]' },
  { icon: Flame, cls: 'right-[6%] top-[30%] from-brand-red-500/40 to-orange-300/50 rotate-[7deg]' },
  { icon: Fan, cls: 'left-[10%] bottom-[16%] from-royal-500/40 to-electric-300/50 rotate-[5deg]' },
  { icon: Gauge, cls: 'right-[12%] bottom-[10%] from-frost-200 to-electric-300/40 rotate-[-6deg]' },
]

/** Reference-style about: centered badge, eyebrow, word-by-word reveal paragraph, floating chips. */
export default function AboutSection() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-word',
        { color: 'rgba(14,12,61,0.18)' },
        {
          color: 'rgba(14,12,61,1)',
          stagger: 0.04,
          scrollTrigger: {
            trigger: '.about-copy',
            start: 'top 78%',
            end: 'bottom 45%',
            scrub: 0.8,
          },
        },
      )
      gsap.utils.toArray<HTMLElement>('.about-chip').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: root.current, start: 'top 70%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative py-28 sm:py-36 overflow-hidden rings" aria-label="About Burton's Reliable">
      {/* Floating icon chips */}
      {CHIPS.map((c, i) => (
        <div
          key={i}
          className={`about-chip hidden md:flex absolute w-16 h-16 rounded-2xl bg-gradient-to-br ${c.cls} items-center justify-center shadow-[0_16px_40px_-16px_rgba(14,12,61,0.3)]`}
          aria-hidden="true"
        >
          <c.icon className="w-7 h-7 text-white drop-shadow" />
        </div>
      ))}

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-white shadow-[0_16px_40px_-16px_rgba(14,12,61,0.25)] flex items-center justify-center mb-5">
          <Logo compact />
        </div>
        <p className="font-display text-xs tracking-[0.2em] uppercase text-navy-900/50 mb-8">About Us</p>
        <p className="about-copy font-display text-2xl sm:text-3xl md:text-[34px] font-light leading-[1.45] text-navy-900">
          {PARAGRAPH.split(' ').map((w, i) => (
            <span key={i} className="about-word" style={{ color: 'rgba(14,12,61,0.18)' }}>
              {w}{' '}
            </span>
          ))}
        </p>
        <p className="mt-8 text-sm text-navy-900/50 max-w-xl mx-auto leading-relaxed">
          Transparent pricing means you&apos;ll never be surprised by your bill. With competitive rates and no
          hidden fees, you can be confident you&apos;ve chosen the best option for your comfort and your wallet.
        </p>
      </div>
    </section>
  )
}
