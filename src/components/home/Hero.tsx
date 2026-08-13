import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ChevronDown, Phone } from 'lucide-react'
import Button from '../ui/Button'
import { BUSINESS } from '../../lib/constants'
import { useStore } from '../../store/useStore'
import { prefersReducedMotion } from '../../lib/utils'
import type { SiteContent } from '../../lib/types'

/**
 * Photo hero: the real Burton's Reliable fleet on the job, brand-graded with
 * indigo scrims and a slow Ken Burns drift. The gradient panel shows through
 * until the photo fades in, so there is no flash and no boot screen.
 */
export default function Hero({ content }: { content: SiteContent }) {
  const openBooking = useStore((s) => s.openBooking)
  const navigate = useNavigate()
  const root = useRef<HTMLElement>(null)
  const [photoReady, setPhotoReady] = useState(false)

  const reduced = useMemo(() => prefersReducedMotion(), [])

  useEffect(() => {
    if (!root.current) return
    // Hidden/background tab: rAF (and therefore GSAP) is suspended, show content directly.
    if (document.hidden || reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero-line', { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.2)
        .fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.hero-cta', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
        .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.2')
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={root} className="relative p-2 sm:p-3" aria-label="Hero">
      {/* Rounded gradient hero panel (reference style) */}
      <div className="hero-panel relative overflow-hidden rounded-[24px] sm:rounded-[28px] min-h-[94svh] flex flex-col">
        {/* Fleet photo, brand-graded */}
        <div className="absolute inset-0">
          <img
            ref={(el) => { if (el?.complete) setPhotoReady(true) }}
            src="/images/hero-fleet.jpg"
            alt="Burton's Reliable wrapped service truck and equipment trailer"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setPhotoReady(true)}
            className={`hero-kenburns absolute inset-0 w-full h-full object-cover object-[52%_62%] [filter:saturate(1.06)_contrast(1.04)] transition-opacity duration-1000 ${
              photoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Brand grade: indigo wash, left text scrim, top nav scrim, bottom scrim */}
          <div className="absolute inset-0 bg-[#1e15aa]/[0.08] mix-blend-multiply" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0c3d]/65 via-[#171082]/20 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0e0c3d]/55 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#0e0c3d]/80 via-[#0e0c3d]/35 to-transparent" aria-hidden="true" />
          {/* Faint flame glow echoing the logo */}
          <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-brand-red-600/20 blur-[130px]" aria-hidden="true" />
        </div>

        {/* Copy anchored bottom-left */}
        <div className="relative z-10 mt-auto p-7 sm:p-12 lg:p-14 flex flex-col lg:flex-row lg:items-end gap-8 pointer-events-none">
          <div className="pointer-events-auto max-w-3xl">
            <h1 className="font-logo font-semibold text-white tracking-[-0.015em] leading-[1.1] text-[34px] sm:text-5xl lg:text-[58px] [text-shadow:0_2px_30px_rgba(14,12,61,0.55)]">
              <span className="hero-line block">Engineered Comfort</span>
              <span className="hero-line block">For Baton Rouge</span>
            </h1>
            <span className="hero-sub mt-5 inline-flex items-center border border-white/50 rounded-full px-5 sm:px-7 py-1.5 font-display text-sm sm:text-base text-white glass-dark">
              HVAC Experts
            </span>
            <p className="hero-sub mt-5 text-white/75 text-base sm:text-lg max-w-xl leading-relaxed">
              {content.hero_description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="hero-cta">
                <Button size="lg" variant="white" onClick={() => openBooking()}>
                  {content.cta_text || 'Request Service'}
                </Button>
              </span>
              <span className="hero-cta">
                <Button size="lg" variant="outline" onClick={() => navigate('/services')}>
                  Explore Services
                </Button>
              </span>
            </div>
          </div>

          {/* Right: phone chip */}
          <a
            href={BUSINESS.phoneHref}
            className="hero-cta pointer-events-auto lg:ml-auto glass-dark rounded-full px-5 py-3 inline-flex items-center gap-3 text-white hover:bg-white/20 transition-colors self-start lg:self-auto"
          >
            <span className="w-8 h-8 rounded-full bg-brand-red-500/30 flex items-center justify-center">
              <Phone className="w-3.5 h-3.5 text-[#ffc2c5]" />
            </span>
            <span className="leading-tight">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/60 font-display">24/7 emergencies</span>
              <span className="font-display text-sm font-medium">{BUSINESS.phone}</span>
            </span>
          </a>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1.5 text-white/50">
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
