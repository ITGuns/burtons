import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BadgeCheck, HandCoins, Home, MapPin, Users, Clock } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { prefersReducedMotion } from '../../lib/utils'

gsap.registerPlugin(ScrollTrigger)

const WORDS = ['Reliable.', 'Honest.', 'Friendly.']

const POINTS = [
  { icon: Clock, title: '13+ years industry experience', body: 'Over a decade of hands-on HVAC work across Baton Rouge homes and businesses.' },
  { icon: HandCoins, title: 'Transparent pricing', body: 'Clear pricing before work begins. No hidden fees, no surprises.' },
  { icon: BadgeCheck, title: 'Free estimates & consultations', body: 'Honest assessments and free estimates for every project.' },
  { icon: Users, title: 'Customer-first service', body: 'Straightforward communication and service built around your schedule.' },
  { icon: Home, title: 'Residential & commercial', body: 'One team for houses, offices, retail and light commercial systems.' },
  { icon: MapPin, title: 'Local Baton Rouge service', body: 'A local company that knows Louisiana heat — and Louisiana humidity.' },
]

export default function WhySection() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.why-word').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0.1, x: i % 2 ? 48 : -48 },
          {
            opacity: 1, x: 0,
            scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 55%', scrub: 1 },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative py-24 sm:py-32" aria-label="Why Burton's Reliable">
      <div className="max-w-6xl mx-auto px-6">
        <p className="font-display text-xs tracking-[0.2em] uppercase text-navy-900/50 mb-8">
          Why Burton&apos;s Reliable
        </p>

        <div className="mb-14">
          {WORDS.map((w, i) => (
            <h2
              key={w}
              className={`why-word font-display font-light tracking-tight leading-[1.02] text-5xl sm:text-7xl lg:text-[92px] ${
                i === 1 ? 'text-royal-600' : 'text-navy-900'
              }`}
            >
              {w}
            </h2>
          ))}
        </div>

        <Reveal>
          <blockquote className="max-w-2xl font-display text-xl md:text-2xl font-light text-navy-900/70 leading-relaxed border-l-2 border-brand-red-500 pl-6 mb-16">
            “We believe HVAC service should be straightforward, transparent and dependable.”
          </blockquote>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <div className="group h-full rounded-3xl tile p-7 hover:bg-white hover:shadow-[0_24px_48px_-24px_rgba(14,12,61,0.25)] hover:-translate-y-1 transition-all duration-300">
                <span className="inline-flex w-11 h-11 rounded-full bg-white shadow-sm items-center justify-center mb-4">
                  <p.icon className="w-5 h-5 text-royal-600 group-hover:text-brand-red-500 transition-colors" />
                </span>
                <h3 className="font-display font-medium text-navy-900">{p.title}</h3>
                <p className="mt-2 text-sm text-navy-900/55 leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
