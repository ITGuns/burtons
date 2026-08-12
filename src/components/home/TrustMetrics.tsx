import Reveal from '../ui/Reveal'
import AnimatedCounter from '../ui/AnimatedCounter'
import { BUSINESS } from '../../lib/constants'

const METRICS = [
  { value: '13+', label: 'Years Experience' },
  { value: '100%', label: 'Customer Focused' },
  { value: 'FREE', label: 'Estimates & Consultations' },
  { value: 'LOCAL', label: `${BUSINESS.city} HVAC Experts` },
]

export default function TrustMetrics() {
  return (
    <section className="relative py-16" aria-label="Why customers trust us">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.08}>
            <div className="tile rounded-3xl px-6 py-8 text-center h-full hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(30,21,170,0.35)] transition-all duration-300">
              <p className="font-display text-4xl md:text-5xl font-light text-navy-900">
                <AnimatedCounter value={m.value} />
              </p>
              <p className="mt-3 font-display text-[11px] tracking-[0.22em] uppercase text-royal-600">
                {m.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
