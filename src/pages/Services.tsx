import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import { SERVICES } from '../data/services'
import { useSEO } from '../lib/useSEO'
import { useStore } from '../store/useStore'

export default function Services() {
  const openBooking = useStore((s) => s.openBooking)
  useSEO({
    title: "HVAC Services Baton Rouge | AC Repair, Installation & Maintenance | Burton's Reliable",
    description:
      'Complete HVAC services in Baton Rouge: AC installation, heating repair, preventive maintenance, winterization, diagnostics and emergency service. Free estimates.',
  })

  return (
    <div>
      <PageHeader
        eyebrow="Services"
        title={'Every system.\nEvery season.'}
        description="Installation, repair, maintenance and emergency HVAC service for residential and commercial properties across Baton Rouge."
      />
      <div className="max-w-6xl mx-auto px-6 py-16 pb-24 grid md:grid-cols-2 gap-5">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 2) * 0.08}>
            <article className="group tile rounded-[28px] p-8 h-full flex flex-col hover:bg-white hover:shadow-[0_28px_56px_-28px_rgba(14,12,61,0.28)] hover:-translate-y-1 transition-all duration-300">
              <p className="font-display text-[10px] tracking-[0.35em] uppercase text-brand-red-500 mb-3">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="font-display text-2xl font-medium text-navy-900 group-hover:text-royal-600 transition-colors">
                {s.title}
              </h2>
              <p className="mt-1.5 font-display text-xs tracking-[0.15em] uppercase text-royal-600/80">
                {s.headline}
              </p>
              <p className="mt-4 text-sm text-navy-900/60 leading-relaxed flex-1">{s.description}</p>
              <div className="mt-6 flex items-center gap-4">
                <Button size="sm" onClick={() => openBooking(s.title)}>Request Service</Button>
                <Link
                  to={`/services/${s.slug}`}
                  className="text-xs font-display text-navy-900/50 hover:text-royal-600 inline-flex items-center gap-1.5 transition-colors"
                >
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
