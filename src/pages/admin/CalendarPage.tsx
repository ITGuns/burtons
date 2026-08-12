import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { listBookings, subscribe, updateBooking } from '../../lib/db'
import type { Booking } from '../../lib/types'
import { Card, StatusBadge } from './adminUi'
import { cn } from '../../lib/utils'
import { useStore } from '../../store/useStore'

type View = 'DAY' | 'WEEK' | 'MONTH'

const dayKey = (d: Date) => d.toISOString().split('T')[0]

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [view, setView] = useState<View>('WEEK')
  const [cursor, setCursor] = useState(() => new Date())
  const toast = useStore((s) => s.toast)

  useEffect(() => {
    const load = () => listBookings().then(setBookings).catch(() => {})
    load()
    return subscribe('bookings', load)
  }, [])

  const active = useMemo(
    () => bookings.filter((b) => b.status !== 'CANCELLED'),
    [bookings],
  )

  const days: Date[] = useMemo(() => {
    if (view === 'DAY') return [cursor]
    if (view === 'WEEK') {
      const start = addDays(cursor, -cursor.getDay())
      return Array.from({ length: 7 }, (_, i) => addDays(start, i))
    }
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const start = addDays(first, -first.getDay())
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  }, [view, cursor])

  const step = view === 'DAY' ? 1 : view === 'WEEK' ? 7 : 30
  const todayKey = dayKey(new Date())

  const onDrop = async (e: React.DragEvent, day: Date) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('booking-id')
    if (!id) return
    await updateBooking(id, { preferred_date: dayKey(day), status: 'SCHEDULED' })
    toast({ title: 'Booking rescheduled', body: day.toLocaleDateString(), tone: 'success' })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl font-bold text-slate-900 mr-auto">Calendar</h2>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {(['DAY', 'WEEK', 'MONTH'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-4 py-2 text-xs font-semibold transition-colors cursor-pointer',
                view === v ? 'bg-navy-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50',
              )}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCursor((c) => addDays(c, -step))} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer" aria-label="Previous">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCursor(new Date())} className="px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer">
            Today
          </button>
          <button onClick={() => setCursor((c) => addDays(c, step))} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer" aria-label="Next">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm font-semibold text-slate-600 w-40 text-right">
          {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <p className="text-xs text-slate-400">Tip: drag a booking card onto another day to reschedule it.</p>

      <Card className="overflow-hidden">
        <div
          className={cn(
            'grid',
            view === 'DAY' ? 'grid-cols-1' : 'grid-cols-7',
          )}
        >
          {view !== 'DAY' &&
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <p key={d} className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                {d}
              </p>
            ))}
          {days.map((day) => {
            const key = dayKey(day)
            const dayBookings = active.filter((b) => b.preferred_date === key)
            const inMonth = day.getMonth() === cursor.getMonth()
            return (
              <div
                key={key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, day)}
                className={cn(
                  'border-b border-r border-slate-100 p-2 align-top',
                  view === 'MONTH' ? 'min-h-24' : 'min-h-40',
                  !inMonth && view === 'MONTH' && 'bg-slate-50/70',
                )}
              >
                <p
                  className={cn(
                    'text-xs font-semibold mb-1.5 w-6 h-6 flex items-center justify-center rounded-full',
                    key === todayKey ? 'bg-royal-600 text-white' : 'text-slate-500',
                  )}
                >
                  {day.getDate()}
                </p>
                <div className="space-y-1.5">
                  {dayBookings.map((b) => (
                    <Link
                      key={b.id}
                      to={`/admin/bookings/${b.id}`}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('booking-id', b.id)}
                      className="block rounded-lg border border-slate-200 bg-white px-2.5 py-2 hover:shadow-sm hover:border-royal-500/50 transition-all cursor-grab active:cursor-grabbing"
                    >
                      <p className="text-[11px] font-semibold text-slate-800 truncate">{b.customer_name}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {b.service}{b.preferred_time && ` · ${b.preferred_time}`}
                      </p>
                      {view !== 'MONTH' && (
                        <div className="mt-1 flex items-center gap-1 flex-wrap">
                          <StatusBadge status={b.status} />
                          {b.technician && <span className="text-[9px] text-slate-400">{b.technician}</span>}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
