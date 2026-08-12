import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'
import Logo from './Logo'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import { BUSINESS } from '../../lib/constants'
import { useStore } from '../../store/useStore'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8.6v3H11v7h2.5z" />
    </svg>
  )
}

const LINKS = [
  ['Home', '/'],
  ['Services', '/services'],
  ['About', '/about'],
  ['Service Area', '/service-area'],
  ['Financing', '/financing'],
  ['Contact', '/contact'],
] as const

/** Reference-style minimal footer preceded by a huge centered CTA. */
export default function Footer() {
  const openBooking = useStore((s) => s.openBooking)
  return (
    <footer className="relative">
      {/* Final CTA */}
      <Reveal className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-navy-900 leading-[1.1]">
          Ready to keep your
          <span className="block">
            comfort <span className="text-royal-600">running?</span>
          </span>
        </h2>
        <p className="mt-5 text-navy-900/55 max-w-lg mx-auto">
          Free estimates. Transparent pricing. {BUSINESS.yearsExperience} years of experience serving Baton Rouge.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={() => openBooking()}>Request Service</Button>
          <a
            href={BUSINESS.phoneHref}
            className="flex items-center gap-2 text-navy-900/70 hover:text-royal-600 font-display text-sm transition-colors"
          >
            <Phone className="w-4 h-4" /> {BUSINESS.phone}
          </a>
        </div>
      </Reveal>

      {/* Minimal footer bar */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="border-t border-navy-900/10 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <Logo />
            <nav className="flex flex-wrap gap-x-6 gap-y-2 lg:ml-auto" aria-label="Footer navigation">
              {LINKS.map(([label, href]) => (
                <Link
                  key={href}
                  to={href}
                  className="font-display text-xs tracking-wide uppercase text-navy-900/55 hover:text-royal-600 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-6 md:items-end">
            <div className="text-xs text-navy-900/45 leading-relaxed max-w-sm space-y-1.5">
              <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {BUSINESS.address}</p>
              <p className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{BUSINESS.hours.map((h) => `${h.days}: ${h.hours}`).join(' · ')}</span>
              </p>
            </div>
            <p className="text-xs text-navy-900/40 md:ml-auto">
              Copyright © {new Date().getFullYear()} {BUSINESS.name}.<br className="hidden md:block" /> All rights reserved.
            </p>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-navy-900/45 font-display mr-1">Follow us</span>
              <a
                href={BUSINESS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Burton's Reliable on Facebook"
                className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center hover:bg-royal-600 transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
