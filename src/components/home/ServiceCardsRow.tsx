import { Link } from 'react-router-dom'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { SERVICES } from '../../data/services'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

/** Alternating soft tints, red reserved as the accent (reference card row). */
const CARD_TINTS = [
  { card: 'bg-[#f4f4fe]', chip: 'bg-[#d9d9f6] text-navy-800' },
  { card: 'bg-gradient-to-b from-[#e0e0fa] to-[#cbcaf6]', chip: 'bg-white/60 text-navy-800' },
  { card: 'bg-gradient-to-b from-[#fbe7e8] to-[#f8d0d2]', chip: 'bg-white/60 text-brand-red-600' },
  { card: 'bg-gradient-to-b from-[#e9eafa] to-[#dbdcf6]', chip: 'bg-white/70 text-navy-800' },
]

/**
 * Card photos live in /public/images/<slug>.jpg (Unsplash-licensed stock —
 * swap for real company job photos when available).
 */
export default function ServiceCardsRow() {
  const openBooking = useStore((s) => s.openBooking)
  return (
    <section className="relative py-20" aria-label="Book a service">
      <Reveal className="max-w-2xl mx-auto px-6 text-center mb-10">
        <p className="text-navy-900/60 leading-relaxed">
          At Burton&apos;s Reliable, we offer a full range of professional HVAC services to keep your home
          comfortable and efficient. Explore our services and find the right solution for your comfort needs.
        </p>
        <div className="mt-6">
          <Button size="md" onClick={() => openBooking()}>Get Started</Button>
        </div>
      </Reveal>

      <div className="overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-5 px-6 w-max mx-auto">
          {SERVICES.slice(0, 6).map((s, i) => {
            const tint = CARD_TINTS[i % CARD_TINTS.length]
            return (
              <Reveal key={s.slug} delay={i * 0.06}>
                <div
                  className={cn(
                    'w-[250px] rounded-3xl p-3 shadow-[0_20px_44px_-24px_rgba(14,12,61,0.25)] hover:-translate-y-1.5 transition-all duration-300 group',
                    tint.card,
                  )}
                >
                  <Link to={`/services/${s.slug}`} className="block">
                    <div className="rounded-2xl h-44 overflow-hidden bg-white/55">
                      <img
                        src={`/images/${s.slug}.jpg`}
                        alt={s.title}
                        loading="lazy"
                        width={800}
                        height={533}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className={cn('mt-3 rounded-xl px-4 py-3 text-xs font-display leading-snug', tint.chip)}>
                      {s.short}
                    </div>
                    <div className="flex items-center justify-between gap-2 px-2 pt-3 pb-1">
                      <span className="text-[11px] text-navy-900/50 font-display shrink-0">Free estimate</span>
                      <span className="font-display text-sm font-medium text-navy-900 text-right leading-tight">
                        {s.title.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
