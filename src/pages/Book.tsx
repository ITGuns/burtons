import { useEffect } from 'react'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import { BUSINESS } from '../lib/constants'
import { useSEO } from '../lib/useSEO'
import { useStore } from '../store/useStore'

/** /book — opens the booking modal immediately and offers a fallback CTA. */
export default function Book() {
  const openBooking = useStore((s) => s.openBooking)
  useSEO({
    title: "Request HVAC Service | Book Online | Burton's Reliable | Baton Rouge",
    description:
      'Request HVAC service online with Burton\'s Reliable Heating and Air Conditioning in Baton Rouge. Free estimates — or call (225) 603-2253.',
  })

  useEffect(() => {
    const t = setTimeout(() => openBooking(), 350)
    return () => clearTimeout(t)
  }, [openBooking])

  return (
    <div className="min-h-[60vh]">
      <PageHeader
        eyebrow="Booking"
        title={'Request\nservice.'}
        description="Tell us what's going on and we'll contact you shortly to confirm your appointment. Free estimates, transparent pricing."
      />
      <Reveal className="max-w-6xl mx-auto px-6 py-14 flex flex-col sm:flex-row gap-4">
        <Button size="lg" onClick={() => openBooking()}>Open Booking Form</Button>
        <a href={BUSINESS.phoneHref}>
          <Button size="lg" variant="ghost">Or call {BUSINESS.phone}</Button>
        </a>
      </Reveal>
    </div>
  )
}
