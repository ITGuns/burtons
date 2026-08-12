import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { SYSTEM_PARTS } from '../three/systemParts'
import { prefersReducedMotion, cn } from '../../lib/utils'

const SystemExplorer = lazy(() => import('../three/SystemExplorer'))

export default function SystemSection() {
  const [activePart, setActivePart] = useState<string | null>('compressor')
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const mobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { rootMargin: '400px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const active = SYSTEM_PARTS.find((p) => p.id === activePart)

  return (
    <section ref={ref} className="relative py-24 sm:py-32" aria-label="Explore your HVAC system">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="System intelligence"
          title={'Know Your\nSystem'}
          description="Tap the glowing points to explore how a complete HVAC system keeps your home comfortable — the same components our technicians install, maintain and repair every day."
        />

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-stretch">
          <div className="relative h-[400px] md:h-[500px] rounded-[28px] overflow-hidden bg-gradient-to-br from-[#141157] via-[#171082] to-[#3629d1] shadow-[0_30px_70px_-30px_rgba(23,16,130,0.5)]">
            {inView && (
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center text-white/40 font-display text-xs tracking-[0.3em] uppercase">
                    Loading system…
                  </div>
                }
              >
                <SystemExplorer
                  activePart={activePart}
                  onSelect={setActivePart}
                  reduced={reduced}
                  mobile={mobile}
                />
              </Suspense>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap lg:flex-col gap-2">
              {SYSTEM_PARTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePart(p.id)}
                  className={cn(
                    'text-left font-display text-[13px] px-4 py-3 rounded-full border transition-all cursor-pointer',
                    activePart === p.id
                      ? 'border-royal-500/50 bg-royal-500/10 text-royal-700'
                      : 'border-navy-900/10 text-navy-900/55 hover:text-navy-900 hover:border-navy-900/25 bg-white',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="tile rounded-3xl p-6 mt-auto"
                >
                  <p className="font-display text-[10px] tracking-[0.3em] uppercase text-brand-red-500 mb-2">
                    Component
                  </p>
                  <h3 className="font-display text-lg font-medium text-navy-900">{active.title}</h3>
                  <p className="mt-2.5 text-sm text-navy-900/60 leading-relaxed">{active.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
