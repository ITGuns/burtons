import PageHeader from '../components/layout/PageHeader'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import { BUSINESS } from '../lib/constants'
import { useSEO } from '../lib/useSEO'
import { useStore } from '../store/useStore'

export default function About() {
  const openBooking = useStore((s) => s.openBooking)
  useSEO({
    title: "About Burton's Reliable | Baton Rouge HVAC Company with 13+ Years Experience",
    description:
      "Burton's Reliable Heating and Air Conditioning LLC is a local Baton Rouge HVAC company with 13+ years of experience, transparent pricing and customer-first service.",
  })

  return (
    <div>
      <PageHeader
        eyebrow="About us"
        title={'Built on\nreliability.'}
        description={`${BUSINESS.name}, a local ${BUSINESS.city} heating and cooling team with more than 13 years of hands-on industry experience.`}
      />
      <div className="max-w-6xl mx-auto px-6 py-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <div className="space-y-6 text-navy-900/70 leading-relaxed text-lg">
              <p>
                We believe HVAC service should be straightforward, transparent and dependable. That philosophy
                is in our name, and it shapes every install, repair and maintenance visit we make.
              </p>
              <p>
                From our home base at {BUSINESS.address.split(',')[0]} in {BUSINESS.city}, we serve homeowners
                and businesses across the area with complete heating and air conditioning services: installations,
                preventive maintenance, winterization, diagnostics, repairs and emergency response.
              </p>
              <p>
                Every job starts with a free estimate and honest, plain-language advice. No hidden fees.
                No pressure. Just reliable comfort, done right.
              </p>
            </div>
            <div className="mt-10">
              <Button size="lg" onClick={() => openBooking()}>Request Service</Button>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4">
            {[
              { v: '13+', l: 'Years of industry experience' },
              { v: '100%', l: 'Customer-focused approach' },
              { v: 'FREE', l: 'Estimates & consultations' },
              { v: '2', l: 'Markets: residential & commercial' },
            ].map((m, i) => (
              <Reveal key={m.l} delay={i * 0.08}>
                <div className="tile rounded-[24px] p-7 h-full">
                  <p className="font-display text-4xl md:text-5xl font-light text-navy-900">
                    <AnimatedCounter value={m.v} />
                  </p>
                  <p className="mt-3 text-xs font-display tracking-[0.18em] uppercase text-royal-600">{m.l}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.3} className="col-span-2">
              <div className="rounded-[24px] p-7 bg-gradient-to-b from-[#e0e0fa] to-[#cbcaf6] border-l-2 border-l-brand-red-500">
                <p className="font-display text-lg text-navy-900 leading-relaxed font-light">
                  “Reliable. Honest. Friendly. That&apos;s not a slogan, it&apos;s the standard for every visit.”
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}
