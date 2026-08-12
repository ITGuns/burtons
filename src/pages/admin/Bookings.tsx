import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { listBookings, subscribe } from '../../lib/db'
import type { Booking, BookingStatus } from '../../lib/types'
import { BOOKING_STATUSES, Card, EmptyState, StatusBadge, adminInput } from './adminUi'
import { BOOKING_SERVICES } from '../../lib/constants'
import { formatDate, cn } from '../../lib/utils'

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<BookingStatus | 'ALL'>('ALL')
  const [service, setService] = useState('ALL')
  const [date, setDate] = useState('')

  useEffect(() => {
    const load = () => listBookings().then(setBookings).catch(() => {})
    load()
    return subscribe('bookings', load)
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return bookings.filter((b) => {
      if (status !== 'ALL' && b.status !== status) return false
      if (service !== 'ALL' && b.service !== service) return false
      if (date && b.preferred_date !== date) return false
      if (q && ![b.customer_name, b.phone, b.email, b.booking_ref, b.address]
        .some((f) => f.toLowerCase().includes(q))) return false
      return true
    })
  }, [bookings, query, status, service, date])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl font-bold text-slate-900 mr-auto">Bookings</h2>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className={cn(adminInput, 'pl-9 w-56')}
            placeholder="Search name, ref, phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search bookings"
          />
        </div>
        <select className={cn(adminInput, 'w-auto')} value={service} onChange={(e) => setService(e.target.value)} aria-label="Filter by service">
          <option value="ALL">All services</option>
          {BOOKING_SERVICES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input type="date" className={cn(adminInput, 'w-auto')} value={date} onChange={(e) => setDate(e.target.value)} aria-label="Filter by date" />
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', ...BOOKING_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors cursor-pointer',
              status === s
                ? 'bg-navy-900 text-white border-navy-900'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300',
            )}
          >
            {s.replace('_', ' ')}
            <span className="ml-1.5 text-[10px] opacity-60">
              {s === 'ALL' ? bookings.length : bookings.filter((b) => b.status === s).length}
            </span>
          </button>
        ))}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState title="No bookings match" body="Adjust filters, or wait for new website requests." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Urgency</th>
                  <th className="px-4 py-3 font-semibold">Technician</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-800">{b.customer_name}</p>
                      <p className="text-xs text-slate-400">{b.booking_ref} · {b.phone}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{b.service}</td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {formatDate(b.preferred_date)}
                      {b.preferred_time && <p className="text-xs text-slate-400">{b.preferred_time}</p>}
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={b.urgency} /></td>
                    <td className="px-4 py-3.5 text-slate-600">{b.technician || '—'}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        to={`/admin/bookings/${b.id}`}
                        className="text-xs font-semibold text-royal-600 hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
