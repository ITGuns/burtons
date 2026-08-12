import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { FAQS } from '../../data/faqs'
import { cn } from '../../lib/utils'

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="relative py-24" aria-label="Frequently asked questions">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading eyebrow="Questions" title={'Straight\nAnswers'} />
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div
                  className={cn(
                    'rounded-2xl overflow-hidden transition-all bg-white border',
                    isOpen ? 'border-royal-500/30 shadow-[0_16px_40px_-24px_rgba(30,21,170,0.35)]' : 'border-navy-900/8',
                  )}
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-medium text-navy-900 text-[15px]">{f.q}</span>
                    <span className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                      isOpen ? 'bg-royal-600 text-white rotate-45' : 'bg-frost-100 text-royal-600',
                    )}>
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-6 text-sm text-navy-900/60 leading-relaxed">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
