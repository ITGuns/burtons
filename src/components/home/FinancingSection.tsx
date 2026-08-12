import { Link } from 'react-router-dom'
import { CreditCard, PhoneCall, FileCheck, Sparkles } from 'lucide-react'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { BUSINESS } from '../../lib/constants'

export default function FinancingSection() {
  return (
    <section className="relative py-20" aria-label="Financing">
      <div className="max-w-6xl mx-auto px-6">
        {/* Gradient panel, reference style */}
        <div className="hero-panel relative overflow-hidden rounded-[28px] p-8 sm:p-14 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="font-display text-xs tracking-[0.18em] uppercase text-white/70 mb-5 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Financing
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight leading-[1.1] text-white">
              Comfort now.
              <span className="block">Pay over time.</span>
            </h2>
            <p className="mt-6 text-white/75 leading-relaxed max-w-lg">
              A new HVAC system is a major investment. Financing options are available so you don&apos;t have to
              choose between comfort and budget. Contact us for current terms and options for your project.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/financing">
                <Button size="lg" variant="white">Explore Financing</Button>
              </Link>
              <a href={BUSINESS.phoneHref}>
                <Button size="lg" variant="outline">
                  <PhoneCall className="w-4 h-4" /> {BUSINESS.phone}
                </Button>
              </a>
            </div>
          </Reveal>

          <div className="grid gap-3.5">
            {[
              { icon: FileCheck, title: 'Free estimate first', body: 'Every financing conversation starts with a free, transparent estimate.' },
              { icon: CreditCard, title: 'Options for your budget', body: 'Ask about available financing for installations and major repairs.' },
              { icon: PhoneCall, title: 'Straight answers', body: `Call ${BUSINESS.phone}, we'll walk you through what's available.` },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.1}>
                <div className="glass-dark rounded-2xl p-5 flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-white" />
                  </span>
                  <div>
                    <h3 className="font-display font-medium text-white">{c.title}</h3>
                    <p className="mt-1 text-sm text-white/65 leading-relaxed">{c.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
