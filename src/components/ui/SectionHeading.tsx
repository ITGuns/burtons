import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import Reveal from './Reveal'
import { cn } from '../../lib/utils'

interface Props {
  eyebrow?: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
  onDark?: boolean
}

/** Reference-style heading: small ✦ eyebrow, large light Poppins title. */
export default function SectionHeading({ eyebrow, title, description, align = 'center', onDark }: Props) {
  return (
    <Reveal className={cn('max-w-3xl mb-14', align === 'center' ? 'mx-auto text-center' : '')}>
      {eyebrow && (
        <p
          className={cn(
            'font-display text-xs tracking-[0.18em] uppercase mb-5 flex items-center gap-2',
            align === 'center' && 'justify-center',
            onDark ? 'text-white/80' : 'text-brand-red-600',
          )}
        >
          <Sparkles className={cn('w-3.5 h-3.5', onDark && 'text-[#fa8e94]')} aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'font-display text-4xl md:text-5xl font-light tracking-tight leading-[1.12] whitespace-pre-line',
          onDark ? 'text-white' : 'text-navy-900',
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn('mt-6 text-base md:text-lg leading-relaxed', onDark ? 'text-white/70' : 'text-navy-900/60')}>
          {description}
        </p>
      )}
    </Reveal>
  )
}
