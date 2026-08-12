import { useEffect, useMemo, useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { listBookings, listConversations, listLeads, subscribe } from '../../lib/db'
import type { Booking, Conversation, Lead } from '../../lib/types'
import { Card, EmptyState } from './adminUi'

const COLORS = ['#1e15aa', '#3629d1', '#5a52e8', '#918df3', '#171082', '#d1121d', '#94a3b8']

export default function Analytics() {
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
    const subs = [subscribe('bookings', load), subscribe('leads', load), subscribe('conversations', load)]
    return () => subs.forEach((u) => u())
  }, [])

  const completed = bookings.filter((b) => b.status === 'COMPLETED').length
  const conversion = leads.length
    ? Math.round((leads.filter((l) => ['BOOKED', 'COMPLETED'].includes(l.status)).length / leads.length) * 100)
    : 0

  const byService = useMemo(() => {
    const m = new Map<string, number>()
    bookings.forEach((b) => m.set(b.service, (m.get(b.service) ?? 0) + 1))
    return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [bookings])

  const bySource = useMemo(() => {
    const m = new Map<string, number>()
    leads.forEach((l) => m.set(l.source, (m.get(l.source) ?? 0) + 1))
    return [...m.entries()].map(([name, value]) => ({ name, value }))
  }, [leads])

  const trend = useMemo(() => {
    const days: { day: string; bookings: number; leads: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      days.push({
        day: d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
        bookings: bookings.filter((b) => b.created_at.startsWith(key)).length,
        leads: leads.filter((l) => l.created_at.startsWith(key)).length,
      })
    }
    return days
  }, [bookings, leads])

  const hasData = bookings.length > 0 || leads.length > 0

  const stats = [
    { label: 'New leads', value: leads.filter((l) => l.status === 'NEW').length },
    { label: 'Total bookings', value: bookings.length },
    { label: 'Completed jobs', value: completed },
    { label: 'Lead → booking conversion', value: `${conversion}%` },
    { label: 'Chat conversations', value: convos.length },
    { label: 'Most requested', value: byService[0]?.name ?? '—' },
  ]

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-slate-900">Analytics</h2>
      <p className="text-sm text-slate-500 -mt-3">
        All metrics are computed from real stored data — nothing simulated.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="font-display text-2xl font-bold text-slate-900 truncate">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {!hasData ? (
        <Card>
          <EmptyState
            title="No data yet"
            body="Charts appear as bookings and leads come in from the website."
          />
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="p-6">
            <h3 className="font-display font-bold text-slate-800 mb-4">14-day booking trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} width={28} />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#1e15aa" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="leads" stroke="#d1121d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold text-slate-800 mb-4">Bookings by service</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byService} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={110} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {byService.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="font-display font-bold text-slate-800 mb-4">Lead sources</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={bySource} dataKey="value" nameKey="name"
                  innerRadius={60} outerRadius={90} paddingAngle={3}
                  label={(entry) => `${entry.name} (${entry.value})`}
                >
                  {bySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  )
}
