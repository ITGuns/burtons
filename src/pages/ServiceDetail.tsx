import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Phone } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import { getService, SERVICES } from '../data/services'
import { BUSINESS } from '../lib/constants'
import { useSEO } from '../lib/useSEO'
import { serviceSchema } from '../lib/schema'
import { useStore } from '../store/useStore'

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = getService(slug ?? '')
  const openBooking = useStore((s) => s.openBooking)

  useSEO({
    title: service
      ? `${service.title} Baton Rouge | Burton's Reliable Heating and Air Conditioning`
      : "Service | Burton's Reliable",
    description: service?.description.slice(0, 158) ?? '',
    jsonLd: service ? serviceSchema(service.title, service.description) : undefined,
  })

  if (!service) return <Navigate to="/services" replace />

  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3)

  return (
    <div>
      <PageHeader eyebrow="Service" title={service.title} description={service.headline} />
      <div className="max-w-6xl mx-auto px-6 py-16 pb-24 grid lg:grid-cols-[1fr_340px] gap-10">
        <div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-display tracking-wide uppercase text-navy-900/50 hover:text-royal-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> All services
          </Link>
          <Reveal>
            <p className="text-lg text-navy-900/70 leading-relaxed">{service.description}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-10 grid sm:grid-cols-2 gap-3.5">
              {service.bullets.map((b) => (
                <li key={b} className="tile rounded-2xl px-5 py-4 flex items-center gap-3 text-sm text-navy-900/75">
                  <span className="w-6 h-6 rounded-full bg-royal-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-royal-600" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => openBooking(service.title)}>Request This Service</Button>
              <a href={BUSINESS.phoneHref}>
                <Button size="lg" variant="ghost">
                  <Phone className="w-4 h-4" /> {BUSINESS.phone}
                </Button>
              </a>
            </div>
          </Reveal>
        </div>

        <aside className="space-y-3.5">
          <h2 className="font-display text-xs tracking-[0.25em] uppercase text-navy-900/40">Related services</h2>
          {others.map((o) => (
            <Link
              key={o.slug}
              to={`/services/${o.slug}`}
              className="tile rounded-2xl p-5 block hover:bg-white hover:shadow-md transition-all"
            >
              <h3 className="font-display font-medium text-navy-900 text-sm">{o.title}</h3>
              <p className="text-xs text-navy-900/55 mt-1.5">{o.short}</p>
            </Link>
          ))}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-[#fbe7e8] to-[#f8d0d2]">
            <p className="font-display text-xs tracking-[0.2em] uppercase text-brand-red-600 mb-2">Emergency?</p>
            <p className="text-sm text-navy-900/70 mb-4">System down? Don&apos;t wait, call now.</p>
            <a href={BUSINESS.phoneHref} className="font-display font-semibold text-navy-900 text-lg hover:text-brand-red-600 transition-colors">
              {BUSINESS.phone}
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}
