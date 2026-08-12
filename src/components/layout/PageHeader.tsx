import { Sparkles } from 'lucide-react'
import Reveal from '../ui/Reveal'

interface Props {
  eyebrow: string
  title: string
  description?: string
}

/** Shared gradient header band for interior pages (reference hero-panel style). */
export default function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <div className="p-2 sm:p-3">
      <div className="hero-panel relative overflow-hidden rounded-[24px] sm:rounded-[28px] pt-36 pb-16 px-7 sm:px-12">
        <Reveal className="relative max-w-6xl mx-auto">
          <p className="font-display text-xs tracking-[0.2em] uppercase text-white/75 mb-5 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight text-white whitespace-pre-line leading-[1.08]">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-white/75 max-w-2xl leading-relaxed">{description}</p>
          )}
        </Reveal>
      </div>
    </div>
  )
}
