import type { BookingStatus, LeadStatus, ConversationStatus } from '../../lib/types'
import { cn } from '../../lib/utils'

export const BOOKING_STATUSES: BookingStatus[] = [
  'NEW', 'CONFIRMED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED',
]
export const LEAD_STATUSES: LeadStatus[] = [
  'NEW', 'CONTACTED', 'QUALIFIED', 'BOOKED', 'COMPLETED', 'LOST',
]

const STATUS_STYLES: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700 border-blue-200',
  CONFIRMED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  SCHEDULED: 'bg-violet-100 text-violet-700 border-violet-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-200',
  COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-slate-100 text-slate-500 border-slate-200',
  CONTACTED: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  QUALIFIED: 'bg-violet-100 text-violet-700 border-violet-200',
  BOOKED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  LOST: 'bg-rose-100 text-rose-600 border-rose-200',
  OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
  RESOLVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ROUTINE: 'bg-slate-100 text-slate-600 border-slate-200',
  SOON: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  URGENT: 'bg-amber-100 text-amber-700 border-amber-200',
  EMERGENCY: 'bg-rose-100 text-rose-700 border-rose-200',
}

export function StatusBadge({ status }: { status: BookingStatus | LeadStatus | ConversationStatus | string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600 border-slate-200',
      )}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200 shadow-sm', className)}>
      {children}
    </div>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-16 text-center">
      <p className="font-display font-semibold text-slate-600">{title}</p>
      <p className="text-sm text-slate-400 mt-1">{body}</p>
    </div>
  )
}

export const adminInput =
  'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-500/15 transition'
