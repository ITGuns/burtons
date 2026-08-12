import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, User } from 'lucide-react'
import { listBookings, subscribe } from '../../lib/db'
import type { Booking } from '../../lib/types'
import { Card, EmptyState, StatusBadge, adminInput } from './adminUi'
import { formatDate, cn } from '../../lib/utils'

interface Customer {
  key: string
  name: string
  phone: string
  email: string
  address: string
  bookings: Booking[]
}

/** Customers derived from booking history, grouped by phone/email. */
export default function Customers() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [query, setQuery] = useState('')
  const [openKey, setOpenKey] = useState<string | null>(null)

  useEffect(() => {
    const load = () => listBookings().then(setBookings).catch(() => {})
    load()
    return subscribe('bookings', load)
  }, [])

  const customers = useMemo(() => {
    const map = new Map<string, Customer>()
    for (const b of bookings) {
      const key = (b.phone.replace(/\D/g, '') || b.email).toLowerCase()
      if (!map.has(key)) {
        map.set(key, {
          key, name: b.customer_name, phone: b.phone, email: b.email,
          address: b.address, bookings: [],
        })
      }
      map.get(key)!.bookings.push(b)
    }
    return [...map.values()].sort((a, b) => b.bookings.length - a.bookings.length)
  }, [bookings])

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase()
    return !q || [c.name, c.phone, c.email, c.address].some((f) => f.toLowerCase().includes(q))
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl font-bold text-slate-900 mr-auto">Customers</h2>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className={cn(adminInput, 'pl-9 w-56')}
            placeholder="Search customers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search customers"
          />
        </div>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState title="No customers yet" body="Customers are built automatically from booking history." />
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((c) => (
              <div key={c.key}>
                <button
                  onClick={() => setOpenKey(openKey === c.key ? null : c.key)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <span className="w-10 h-10 rounded-full bg-royal-600/10 text-royal-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-400 truncate">{c.phone} · {c.email} · {c.address}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-3 py-1">
                    {c.bookings.length} job{c.bookings.length !== 1 && 's'}
                  </span>
                </button>
                {openKey === c.key && (
                  <div className="px-6 pb-4 space-y-2">
                    {c.bookings.map((b) => (
                      <Link
                        key={b.id}
                        to={`/admin/bookings/${b.id}`}
                        className="flex items-center gap-3 rounded-lg border border-slate-100 px-4 py-3 hover:border-royal-500/40 transition-colors"
                      >
                        <p className="text-sm text-slate-700 flex-1">{b.service}</p>
                        <p className="text-xs text-slate-400">{formatDate(b.preferred_date)}</p>
                        <StatusBadge status={b.status} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
