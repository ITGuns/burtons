import { MapPin } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { BUSINESS } from '../../lib/constants'
import { useStore } from '../../store/useStore'

/** Real Google Maps embed (keyless iframe) centered on the shop's address. */
export default function ServiceAreaSection() {
  const openBooking = useStore((s) => s.openBooking)
  return (
    <section className="relative py-24 sm:py-32" aria-label="Service area">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Where we work"
            title={'Baton Rouge.\nCovered.'}
            description={`${BUSINESS.shortName} proudly serves ${BUSINESS.city}, ${BUSINESS.state} and the surrounding area, residential and commercial, from ${BUSINESS.address.split(',')[0]}.`}
          />
          <Reveal delay={0.15}>
            <div className="flex flex-wrap gap-3 mb-10 -mt-4">
              {['Baton Rouge', 'Surrounding areas'].map((area) => (
                <span
                  key={area}
                  className="bg-white border border-navy-900/10 rounded-full px-5 py-2.5 font-display text-xs text-navy-900/75 flex items-center gap-2 shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-red-500" /> {area}
                </span>
              ))}
            </div>
            <p className="text-sm text-navy-900/50 mb-8">
              Not sure if we reach you? Send a request, we&apos;ll confirm availability at your address.
            </p>
            <Button size="lg" onClick={() => openBooking()}>
              Check Service Availability
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-square max-w-lg mx-auto rounded-[28px] overflow-hidden bg-frost-100 shadow-[0_30px_70px_-32px_rgba(23,16,130,0.4)]">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.address)}&z=12&output=embed`}
              title={`Google map, ${BUSINESS.shortName}, ${BUSINESS.address}`}
              className="absolute inset-0 w-full h-full border-0"
              style={{ filter: 'saturate(0.85)' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span
              className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur rounded-full px-4 py-1.5 font-display text-[10px] tracking-[0.2em] uppercase text-navy-900 whitespace-nowrap shadow-sm"
              aria-hidden="true"
            >
              Baton Rouge, LA
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
