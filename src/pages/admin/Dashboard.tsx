import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList, CalendarCheck, CheckCircle2, XCircle,
  MessageSquare, UserPlus, ArrowRight, Sun,
} from 'lucide-react'
import { listBookings, listConversations, listLeads, subscribe } from '../../lib/db'
import type { Booking, Conversation, Lead } from '../../lib/types'
import { Card, EmptyState, StatusBadge } from './adminUi'
import { useAdminSession } from './AdminLayout'
import { formatDate, timeAgo } from '../../lib/utils'

export default function Dashboard() {
  const session = useAdminSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [convos, setConvos] = useState<Conversation[]>([])

  useEffect(() => {
    const load = () => {
      listBookings().then(setBookings).catch(() => {})
      listLeads().then(setLeads).catch(() => {})
      listConversations().then(setConvos).catch(() => {})
    }
    load()
    const subs = [
      subscribe('bookings', load),
      subscribe('leads', load),
      subscribe('conversations', load),
    ]
    return () => subs.forEach((u) => u())
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const stats = [
    {
      icon: Sun, label: "Today's appointments",
      value: bookings.filter((b) => b.preferred_date === today && !['CANCELLED', 'COMPLETED'].includes(b.status)).length,
      to: '/admin/calendar',
    },
    { icon: ClipboardList, label: 'Pending requests', value: bookings.filter((b) => b.status === 'NEW').length, to: '/admin/bookings' },
    { icon: CalendarCheck, label: 'Confirmed bookings', value: bookings.filter((b) => ['CONFIRMED', 'SCHEDULED'].includes(b.status)).length, to: '/admin/bookings' },
    { icon: CheckCircle2, label: 'Completed jobs', value: bookings.filter((b) => b.status === 'COMPLETED').length, to: '/admin/bookings' },
    { icon: XCircle, label: 'Cancelled', value: bookings.filter((b) => b.status === 'CANCELLED').length, to: '/admin/bookings' },
    { icon: MessageSquare, label: 'Unread conversations', value: convos.filter((c) => c.unread_admin || c.needs_human).length, to: '/admin/conversations' },
    { icon: UserPlus, label: 'New leads', value: leads.filter((l) => l.status === 'NEW').length, to: '/admin/leads' },
  ]

  const recent = bookings.slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Welcome back, {session.name}
        </h2>
        <p className="text-sm text-slate-500 mt-1">Here&apos;s what&apos;s happening at Burton&apos;s Reliable.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="p-5 hover:shadow-md hover:-translate-y-0.5 transition-all h-full">
              <s.icon className="w-5 h-5 text-royal-600 mb-3" />
              <p className="font-display text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-display font-bold text-slate-800">Recent requests</h3>
          <Link to="/admin/bookings" className="text-xs text-royal-600 font-semibold inline-flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState title="No bookings yet" body="New service requests from the website will appear here." />
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map((b) => (
              <Link
                key={b.id}
                to={`/admin/bookings/${b.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{b.customer_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {b.service} · {formatDate(b.preferred_date)} · {b.booking_ref}
                  </p>
                </div>
                <StatusBadge status={b.urgency} />
                <StatusBadge status={b.status} />
                <span className="text-xs text-slate-400 hidden sm:block w-16 text-right">{timeAgo(b.created_at)}</span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
