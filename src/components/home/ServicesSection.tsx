import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Building2, Wrench, Snowflake, Flame, ThermometerSun,
  ShieldCheck, CloudSnow, Siren, Gauge, Settings2, ArrowRight,
  Wind, Leaf, Droplets,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import { SERVICES } from '../../data/services'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2, Wrench, Snowflake, Flame, ThermometerSun,
  ShieldCheck, CloudSnow, Siren, Gauge, Settings2,
  Wind, Leaf, Droplets,
}

export default function ServicesSection() {
  const [active, setActive] = useState(0)
  const openBooking = useStore((s) => s.openBooking)
  const featured = SERVICES.slice(0, 5)
  const rest = SERVICES.slice(5)

  return (
    <section className="relative bg-navy-900 py-28 overflow-hidden" id="services" aria-label="Services">
      <div className="absolute inset-0 tech-grid opacity-20" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="What we do"
          title={'COMPLETE HVAC.\nONE RELIABLE TEAM.'}
          description="Installation, repair, maintenance and emergency service for residential and commercial systems across Baton Rouge."
        />

        {/* Interactive expanding panels (desktop) */}
        <div className="hidden lg:flex gap-3 h-[460px]">
          {featured.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Wrench
            const isActive = active === i
            return (
              <motion.article
                key={s.slug}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                animate={{ flex: isActive ? 3.2 : 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'relative overflow-hidden rounded-2xl border cursor-pointer group',
                  isActive
                    ? 'border-electric-400/40 bg-gradient-to-br from-royal-700/40 via-navy-800 to-navy-900'
                    : 'border-white/8 bg-navy-800/50 hover:border-white/20',
                )}
              >
                <div className="absolute inset-0 flex flex-col justify-between p-7">
                  <Icon
                    className={cn(
                      'w-8 h-8 transition-colors duration-500',
                      isActive ? 'text-electric-400' : 'text-white/40',
                    )}
                  />
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="space-y-4"
                    >
                      <h3 className="font-display text-2xl font-bold text-white">{s.title}</h3>
                      <p className="font-display text-xs tracking-[0.25em] uppercase text-electric-400">
                        {s.headline}
                      </p>
                      <p className="text-sm text-white/60 leading-relaxed max-w-md">{s.short}</p>
                      <ul className="flex flex-wrap gap-2">
                        {s.bullets.map((b) => (
                          <li key={b} className="text-[11px] font-display tracking-wide uppercase text-white/70 glass px-3 py-1.5 rounded-full">
                            {b}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-4 pt-2">
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); openBooking(s.title) }}>
                          Request {s.title.split(' ')[0]}
                        </Button>
                        <Link
                          to={`/services/${s.slug}`}
                          className="text-xs font-display tracking-widest uppercase text-white/60 hover:text-electric-400 inline-flex items-center gap-1.5 transition-colors"
                        >
                          Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <h3
                      className="font-display text-sm font-semibold tracking-widest uppercase text-white/70 group-hover:text-white transition-colors"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {s.title}
                    </h3>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Mobile / tablet stack */}
        <div className="lg:hidden space-y-4">
          {featured.map((s) => {
            const Icon = ICONS[s.icon] ?? Wrench
            return (
              <Reveal key={s.slug}>
                <Link
                  to={`/services/${s.slug}`}
                  className="glass rounded-2xl p-6 flex items-start gap-4 hover:border-electric-400/40 transition-colors block"
                >
                  <Icon className="w-7 h-7 text-electric-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-display font-bold text-white">{s.title}</h3>
                    <p className="text-sm text-white/60 mt-1">{s.short}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/30 ml-auto shrink-0 mt-1" />
                </Link>
              </Reveal>
            )
          })}
        </div>

        {/* Secondary services */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {rest.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Wrench
            return (
              <Reveal key={s.slug} delay={i * 0.06}>
                <Link
                  to={`/services/${s.slug}`}
                  className="glass rounded-xl p-5 block h-full hover:border-electric-400/40 hover:bg-white/[0.06] transition-all group"
                >
                  <Icon className="w-6 h-6 text-electric-400 mb-3" />
                  <h3 className="font-display text-sm font-semibold text-white group-hover:text-electric-300 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{s.short}</p>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
