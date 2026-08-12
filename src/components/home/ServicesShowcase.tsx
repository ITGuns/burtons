import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2, Wrench, Snowflake, Flame, ThermometerSun,
  ShieldCheck, CloudSnow, Siren, Gauge, Settings2,
  ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, Sparkles,
} from 'lucide-react'
import Button from '../ui/Button'
import { SERVICES } from '../../data/services'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2, Wrench, Snowflake, Flame, ThermometerSun,
  ShieldCheck, CloudSnow, Siren, Gauge, Settings2,
}

/** Soft gradient palettes cycled across the circular showcase items. */
const TINTS = [
  'from-[#e0e0fa] via-[#cbcaf6] to-[#a9a6f2]',
  'from-[#ebecfa] via-[#dbdcf6] to-[#b7b4f6]',
  'from-[#fbe7e8] via-[#f8d0d2] to-[#f2a6aa]',
  'from-[#e3e3fb] via-[#cdccf7] to-[#aeabf3]',
  'from-[#f2f2fc] via-[#e5e5f8] to-[#d3d4f0]',
]

const mod = (n: number, m: number) => ((n % m) + m) % m

/**
 * Reference-style services carousel: focused circle center, blurred neighbors,
 * copy below, tab pills underneath.
 */
export default function ServicesShowcase() {
  const [index, setIndex] = useState(0)
  const openBooking = useStore((s) => s.openBooking)

  const next = useCallback(() => setIndex((i) => mod(i + 1, SERVICES.length)), [])
  const prev = useCallback(() => setIndex((i) => mod(i - 1, SERVICES.length)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const active = SERVICES[index]
  const offsets = [-2, -1, 0, 1, 2]

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" id="services" aria-label="Services">
      {/* Wavy ornament lines */}
      <svg
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-72 opacity-60 pointer-events-none"
        viewBox="0 0 1400 300" preserveAspectRatio="none" aria-hidden="true"
      >
        <path d="M0 150 C 200 40, 380 260, 620 150 S 1050 60, 1400 170" stroke="#b7b4f6" strokeWidth="1.5" fill="none" />
        <path d="M0 200 C 260 120, 480 240, 760 170 S 1150 90, 1400 210" stroke="#f2a6aa" strokeWidth="1" fill="none" opacity="0.7" />
      </svg>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header row */}
        <div className="grid grid-cols-3 items-start mb-10">
          <p className="font-display text-xs tracking-[0.18em] uppercase text-navy-900/50 flex items-center gap-2 pt-3">
            <Sparkles className="w-3.5 h-3.5 text-royal-600" /> Services
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-[44px] font-light text-navy-900 text-center leading-[1.15] col-span-3 sm:col-span-1">
            Our{' '}
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-electric-300 to-royal-500 align-middle mx-1">
              <Sparkles className="w-4 h-4 text-white" />
            </span>{' '}
            Popular
            <span className="block">Services</span>
          </h2>
          <Link
            to="/services"
            className="hidden sm:inline-flex items-center gap-1.5 justify-self-end pt-3 font-display text-xs tracking-wide text-navy-900/60 hover:text-royal-600 transition-colors"
          >
            See All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Circle carousel */}
        <div className="relative flex items-center justify-center h-[260px] sm:h-[320px]">
          {offsets.map((off) => {
            const s = SERVICES[mod(index + off, SERVICES.length)]
            const Icon = ICONS[s.icon] ?? Wrench
            const isCenter = off === 0
            const abs = Math.abs(off)
            return (
              <motion.button
                key={s.slug}
                onClick={() => setIndex(mod(index + off, SERVICES.length))}
                animate={{
                  x: off * (typeof window !== 'undefined' && window.innerWidth < 640 ? 110 : 210),
                  scale: isCenter ? 1 : abs === 1 ? 0.72 : 0.55,
                  filter: isCenter ? 'blur(0px)' : abs === 1 ? 'blur(7px)' : 'blur(12px)',
                  opacity: abs === 2 ? 0.55 : 1,
                  zIndex: 10 - abs,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute cursor-pointer"
                aria-label={s.title}
                tabIndex={isCenter ? -1 : 0}
              >
                <span
                  className={cn(
                    'flex items-center justify-center rounded-full bg-gradient-to-b shadow-[0_30px_60px_-24px_rgba(30,21,170,0.45)]',
                    TINTS[mod(index + off, TINTS.length)],
                    'w-[190px] h-[190px] sm:w-[250px] sm:h-[250px]',
                  )}
                >
                  <Icon className={cn('text-navy-900/80', isCenter ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-12 h-12')} />
                </span>
              </motion.button>
            )
          })}

          {/* Arrows */}
          <button
            onClick={prev}
            aria-label="Previous service"
            className="absolute left-0 sm:left-24 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy-900/50 hover:text-royal-600 hover:shadow-lg transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next service"
            className="absolute right-0 sm:right-24 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy-900/50 hover:text-royal-600 hover:shadow-lg transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Copy under focused item */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="text-center max-w-xl mx-auto mt-8"
          >
            <h3 className="font-display text-2xl sm:text-[28px] font-normal text-navy-900 leading-snug">
              {active.title}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-navy-900/55 leading-relaxed">{active.short} {active.bullets.slice(0, 2).join(' · ')}.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button size="sm" onClick={() => openBooking(active.title)}>Request Service</Button>
              <Link
                to={`/services/${active.slug}`}
                className="font-display text-xs text-navy-900/55 hover:text-royal-600 inline-flex items-center gap-1 transition-colors"
              >
                Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tab pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          {SERVICES.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => setIndex(i)}
              className={cn(
                'font-display text-[13px] transition-all cursor-pointer',
                i === index
                  ? 'border border-navy-900/25 rounded-full px-4 py-1.5 text-navy-900 inline-flex items-center gap-2'
                  : 'text-navy-900/40 hover:text-navy-900/70',
              )}
            >
              {i === index && <ArrowRight className="w-3 h-3" />}
              {s.title}
              {i === index && <ArrowLeft className="w-3 h-3" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
