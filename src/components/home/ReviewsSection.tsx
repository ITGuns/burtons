import { Quote, ThumbsUp } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { BUSINESS } from '../../lib/constants'

/** Verified customer reviews from the Burton's Reliable Facebook page. */
const REVIEWS = [
  {
    name: 'Michael Laphand Sr.',
    service: 'Repair',
    text: 'Antywne was very knowledgeable and professional. He explained all what he needed to do before performing the job. I would highly recommend him to anyone.',
  },
  {
    name: 'DeAnna Perry',
    service: 'Service call',
    text: 'All around great service! Very prompt arrival, easy scheduling, knowledgeable and communicate issues very well.',
  },
  {
    name: 'Kidimi Simmons',
    service: 'Members club',
    text: 'All services available. Honest and reliable staff. Great pricing and beneficial membership benefits when you sign up for the members club.',
  },
  {
    name: 'Paul Barron',
    service: 'Maintenance plan',
    text: 'Antwyne was very nice and efficient. I signed up for the maintenance contract as well.',
  },
  {
    name: 'Shanta McZeal',
    service: 'Service call',
    text: 'Punctual with time. Not to mention professional with a pleasant attitude.',
  },
  {
    name: 'Michelle Thomas Guillory',
    service: 'Service',
    text: 'Reliable, efficient and honest.',
  },
]

export default function ReviewsSection() {
  return (
    <section className="relative py-24" aria-label="Customer reviews">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Word of mouth"
          title={'Trusted By\nBaton Rouge'}
          description="Real reviews from our customers on Facebook, where Burton's Reliable is 100% recommended across 71 reviews."
        />
        <div className="grid md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1}>
              <figure className="tile rounded-3xl p-7 h-full flex flex-col hover:bg-white hover:shadow-[0_24px_48px_-24px_rgba(14,12,61,0.25)] hover:-translate-y-1 transition-all duration-300">
                <Quote className="w-7 h-7 text-royal-500/40 mb-4" aria-hidden="true" />
                <p className="flex items-center gap-1.5 mb-4 text-xs font-display font-medium text-royal-600">
                  <ThumbsUp className="w-3.5 h-3.5 fill-royal-500/20" aria-hidden="true" />
                  Recommends on Facebook
                </p>
                <blockquote className="text-sm text-navy-900/60 leading-relaxed flex-1">{r.text}</blockquote>
                <figcaption className="mt-6 pt-5 border-t border-navy-900/8">
                  <p className="font-display text-sm font-medium text-navy-900/80">{r.name}</p>
                  <p className="text-xs text-brand-red-600 mt-1 font-display tracking-widest uppercase">{r.service}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal className="text-center mt-10">
          <a
            href={`${BUSINESS.facebook}reviews`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-display text-sm text-royal-600 hover:text-royal-500 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" aria-hidden="true" />
            Read all 71 reviews on Facebook
          </a>
        </Reveal>
      </div>
    </section>
  )
}
