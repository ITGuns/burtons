import { Star, Quote } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

/**
 * PLACEHOLDER testimonials, clearly marked for replacement.
 * Swap these with verified customer reviews (Google/Facebook/Angi) before launch.
 */
const PLACEHOLDER_REVIEWS = [
  {
    name: 'Placeholder, replace with verified review',
    service: 'AC Repair',
    text: 'Example testimonial layout. Replace this card with a real, verified customer review from Google, Facebook or Angi before launch.',
  },
  {
    name: 'Placeholder, replace with verified review',
    service: 'HVAC Installation',
    text: 'Example testimonial layout. Replace this card with a real, verified customer review from Google, Facebook or Angi before launch.',
  },
  {
    name: 'Placeholder, replace with verified review',
    service: 'Maintenance',
    text: 'Example testimonial layout. Replace this card with a real, verified customer review from Google, Facebook or Angi before launch.',
  },
]

export default function ReviewsSection() {
  return (
    <section className="relative py-24" aria-label="Customer reviews">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Word of mouth"
          title={'Trusted By\nBaton Rouge'}
          description="Real reviews from real customers. (Placeholder cards below, connect verified reviews before launch.)"
        />
        <div className="grid md:grid-cols-3 gap-5">
          {PLACEHOLDER_REVIEWS.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <figure className="tile rounded-3xl p-7 h-full flex flex-col hover:bg-white hover:shadow-[0_24px_48px_-24px_rgba(14,12,61,0.25)] hover:-translate-y-1 transition-all duration-300">
                <Quote className="w-7 h-7 text-royal-500/40 mb-4" aria-hidden="true" />
                <div className="flex gap-1 mb-4" aria-label="Placeholder star rating">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-sm text-navy-900/60 leading-relaxed flex-1">{r.text}</blockquote>
                <figcaption className="mt-6 pt-5 border-t border-navy-900/8">
                  <p className="font-display text-sm font-medium text-navy-900/80">{r.name}</p>
                  <p className="text-xs text-royal-600 mt-1 font-display tracking-widest uppercase">{r.service}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
