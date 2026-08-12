import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn, prefersReducedMotion } from '../../lib/utils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'red' | 'white' | 'outline'
  size?: 'md' | 'lg' | 'sm'
  children: ReactNode
  magnetic?: boolean
}

/** Pill button (reference style) with an optional magnetic hover effect. */
export default function Button({
  variant = 'primary',
  size = 'md',
  magnetic = true,
  className,
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)

  const onMove = (e: React.MouseEvent) => {
    if (!magnetic || prefersReducedMotion() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * 0.18
    const y = (e.clientY - r.top - r.height / 2) * 0.18
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 font-display font-medium transition-all duration-300 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none',
        size === 'lg' && 'px-8 py-4 text-sm',
        size === 'md' && 'px-6 py-3 text-sm',
        size === 'sm' && 'px-4 py-2 text-xs',
        variant === 'primary' &&
          'bg-royal-600 text-white shadow-[0_10px_28px_-10px_rgba(30,21,170,0.55)] hover:bg-royal-500 hover:shadow-[0_14px_34px_-10px_rgba(54,41,209,0.6)]',
        variant === 'red' &&
          'bg-brand-red-500 text-white shadow-[0_10px_28px_-10px_rgba(209,18,29,0.5)] hover:bg-brand-red-600',
        variant === 'ghost' &&
          'border border-navy-900/15 text-navy-900 hover:border-royal-500/50 hover:text-royal-600 bg-white/60',
        variant === 'outline' &&
          'border border-white/50 text-white hover:bg-white/10',
        variant === 'white' &&
          'bg-white text-navy-900 shadow-[0_10px_28px_-12px_rgba(14,12,61,0.35)] hover:bg-frost-100',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
