import { useRef, useState, useCallback } from 'react'
import { MoveHorizontal } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'

interface Comparison {
  id: string
  label: string
  before: { title: string; visual: React.ReactNode }
  after: { title: string; visual: React.ReactNode }
}

/** Stylized SVG "system state" visuals — replaced by real job photos when available. */
function SystemVisual({ good }: { good: boolean }) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="260" fill={good ? '#e0e0fa' : '#e8e2d8'} />
      <rect x="140" y="70" width="120" height="120" rx="10" fill={good ? '#ffffff' : '#b8ad9c'} />
      <circle cx="200" cy="130" r="42" fill={good ? '#cbcaf6' : '#8f8574'} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <rect
          key={a}
          x="196" y="94" width="8" height="34" rx="3"
          fill={good ? '#1e15aa' : '#6b6252'}
          transform={`rotate(${a} 200 130)`}
        />
      ))}
      <circle cx="200" cy="130" r="8" fill={good ? '#3629d1' : '#a3492e'} />
      {good
        ? [0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M ${90 + i * 8} ${60 + i * 45} q 40 -12 80 0 t 80 0 t 80 0`}
              stroke="#3629d1" strokeWidth="2.5" fill="none" opacity={0.55 - i * 0.1} strokeLinecap="round"
            />
          ))
        : [0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M ${110 + i * 30} ${70 + i * 55} q 15 18 -8 30 q -20 12 -6 28`}
              stroke="#8c7c5f" strokeWidth="2" fill="none" opacity={0.6} strokeLinecap="round" strokeDasharray="4 7"
            />
          ))}
      <circle cx="252" cy="82" r="4" fill={good ? '#34d399' : '#d1121d'} />
    </svg>
  )
}

function FilterVisual({ good }: { good: boolean }) {
  return (
    <svg viewBox="0 0 400 260" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="260" fill={good ? '#ebecfa' : '#dcd6cb'} />
      <rect x="110" y="40" width="180" height="180" rx="10" fill={good ? '#ffffff' : '#a89d8b'} />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={i}
          x={122 + i * 19} y="52" width="9" height="156" rx="3"
          fill={good ? '#dbdcf6' : '#7d7361'}
        />
      ))}
      {!good &&
        Array.from({ length: 26 }).map((_, i) => (
          <circle
            key={i}
            cx={125 + ((i * 61) % 155)}
            cy={58 + ((i * 37) % 145)}
            r={2 + (i % 3)}
            fill="#57503f"
            opacity="0.8"
          />
        ))}
      {good && <path d="M 60 130 q 60 -18 120 0 t 160 0" stroke="#3629d1" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />}
    </svg>
  )
}

const COMPARISONS: Comparison[] = [
  {
    id: 'system',
    label: 'System modernization',
    before: { title: 'AGING SYSTEM', visual: <SystemVisual good={false} /> },
    after: { title: 'MODERN SYSTEM', visual: <SystemVisual good /> },
  },
  {
    id: 'filter',
    label: 'Filter & airflow care',
    before: { title: 'DIRTY FILTER', visual: <FilterVisual good={false} /> },
    after: { title: 'CLEAN FILTER', visual: <FilterVisual good /> },
  },
]

function Slider({ c }: { c: Comparison }) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = useCallback((clientX: number) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)))
  }, [])

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] rounded-[24px] overflow-hidden shadow-[0_24px_56px_-28px_rgba(14,12,61,0.35)] select-none touch-pan-y"
      onPointerDown={(e) => { dragging.current = true; update(e.clientX); (e.target as Element).setPointerCapture?.(e.pointerId) }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => { dragging.current = false }}
      onPointerCancel={() => { dragging.current = false }}
      role="slider"
      aria-label={`${c.label} before/after comparison`}
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPos((p) => Math.max(4, p - 5))
        if (e.key === 'ArrowRight') setPos((p) => Math.min(96, p + 5))
      }}
    >
      <div className="absolute inset-0">{c.after.visual}</div>
      <span className="absolute top-4 right-4 font-display text-[10px] tracking-[0.25em] uppercase text-royal-700 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full">
        {c.after.title}
      </span>

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {c.before.visual}
        <span className="absolute top-4 left-4 font-display text-[10px] tracking-[0.25em] uppercase text-navy-900/70 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full">
          {c.before.title}
        </span>
      </div>

      <div className="absolute inset-y-0 ba-handle" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -translate-x-1/2 w-0.5 bg-white/90" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-[0_10px_28px_-8px_rgba(14,12,61,0.4)] flex items-center justify-center cursor-ew-resize">
          <MoveHorizontal className="w-4 h-4 text-royal-600" />
        </div>
      </div>
    </div>
  )
}

export default function BeforeAfter() {
  return (
    <section className="relative py-24" aria-label="Before and after">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="The difference"
          title={'Before. After.\nBurton’s.'}
          description="Drag the sliders to see what professional service does for a system — cleaner equipment, better airflow, lower bills."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {COMPARISONS.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.1}>
              <Slider c={c} />
              <p className="mt-4 font-display text-xs tracking-[0.2em] uppercase text-navy-900/45 text-center">
                {c.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
