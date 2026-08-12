import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, MapPin, Camera, Send } from 'lucide-react'
import {
  addBookingNote, listBookings, pushNotification, subscribe, updateBooking,
} from '../../lib/db'
import type { Booking, BookingStatus } from '../../lib/types'
import { BOOKING_STATUSES, Card, StatusBadge, adminInput } from './adminUi'
import { useAdminSession } from './AdminLayout'
import { formatDate, formatDateTime, cn } from '../../lib/utils'
import { useStore } from '../../store/useStore'

export default function BookingDetail() {
  const { id } = useParams()
  const session = useAdminSession()
  const toast = useStore((s) => s.toast)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [note, setNote] = useState('')
  const [tech, setTech] = useState('')
  const [reschedule, setReschedule] = useState({ date: '', time: '' })

  useEffect(() => {
    const load = () =>
      listBookings().then((all) => {
        const b = all.find((x) => x.id === id) ?? null
        setBooking(b)
        if (b) setTech(b.technician ?? '')
      }).catch(() => {})
    load()
    return subscribe('bookings', load)
  }, [id])

  if (!booking) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Booking not found.</p>
        <Link to="/admin/bookings" className="text-royal-600 text-sm font-semibold hover:underline">Back to bookings</Link>
      </div>
    )
  }

  const setStatus = async (status: BookingStatus) => {
    await updateBooking(booking.id, { status })
    await pushNotification({
      title: `Booking ${status.toLowerCase().replace('_', ' ')}`,
      body: `${booking.booking_ref}, ${booking.customer_name} (${booking.service})`,
      link: `/admin/bookings/${booking.id}`,
    })
    toast({ title: `Status updated to ${status.replace('_', ' ')}`, tone: 'success' })
  }

  const saveTech = async () => {
    await updateBooking(booking.id, { technician: tech })
    toast({ title: tech ? `Assigned to ${tech}` : 'Technician cleared', tone: 'success' })
  }

  const saveReschedule = async () => {
    if (!reschedule.date) return
    await updateBooking(booking.id, {
      preferred_date: reschedule.date,
      preferred_time: reschedule.time || booking.preferred_time,
      status: 'SCHEDULED',
    })
    toast({ title: 'Booking rescheduled', body: formatDate(reschedule.date), tone: 'success' })
    setReschedule({ date: '', time: '' })
  }

  const addNote = async () => {
    if (!note.trim()) return
    await addBookingNote(booking, { text: note.trim(), author: session.name, at: new Date().toISOString() })
    setNote('')
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <Link to="/admin/bookings" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All bookings
      </Link>

      <div className="flex flex-wrap items-start gap-4">
        <div className="mr-auto">
          <h2 className="font-display text-2xl font-bold text-slate-900">{booking.customer_name}</h2>
          <p className="text-sm text-slate-500 mt-1">
            {booking.booking_ref} · Created {formatDateTime(booking.created_at)}
          </p>
        </div>
        <StatusBadge status={booking.urgency} />
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          <Card className="p-6 space-y-4">
            <h3 className="font-display font-bold text-slate-800">Request details</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-1">Service</p>
                <p className="font-semibold text-slate-800">{booking.service}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Property</p>
                <p className="font-semibold text-slate-800">{booking.property_type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Preferred date</p>
                <p className="font-semibold text-slate-800">
                  {formatDate(booking.preferred_date)} {booking.preferred_time && `· ${booking.preferred_time}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Urgency</p>
                <p className="font-semibold text-slate-800">{booking.urgency}</p>
              </div>
            </div>
            {booking.description && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Problem description</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-4">{booking.description}</p>
              </div>
            )}
            {booking.notes && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Customer notes</p>
                <p className="text-sm text-slate-700">{booking.notes}</p>
              </div>
            )}
            {booking.photo_name && (
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <Camera className="w-4 h-4" /> Photo attached: {booking.photo_name}
              </p>
            )}
          </Card>

          {/* Internal notes */}
          <Card className="p-6">
            <h3 className="font-display font-bold text-slate-800 mb-4">Internal notes</h3>
            <div className="space-y-3 mb-4">
              {booking.internal_notes.length === 0 && (
                <p className="text-sm text-slate-400">No notes yet.</p>
              )}
              {booking.internal_notes.map((n, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-3.5">
                  <p className="text-sm text-slate-700">{n.text}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5">{n.author} · {formatDateTime(n.at)}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={adminInput}
                placeholder="Add an internal note…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                aria-label="Internal note"
              />
              <button
                onClick={addNote}
                className="shrink-0 rounded-lg bg-navy-900 text-white px-4 hover:bg-navy-800 transition-colors cursor-pointer"
                aria-label="Save note"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>

        {/* Side actions */}
        <div className="space-y-5">
          <Card className="p-6 space-y-3">
            <h3 className="font-display font-bold text-slate-800">Contact customer</h3>
            <a href={`tel:${booking.phone.replace(/\D/g, '')}`} className="flex items-center gap-3 text-sm text-slate-700 hover:text-royal-600 transition-colors">
              <Phone className="w-4 h-4 text-slate-400" /> {booking.phone}
            </a>
            <a href={`mailto:${booking.email}`} className="flex items-center gap-3 text-sm text-slate-700 hover:text-royal-600 transition-colors break-all">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" /> {booking.email}
            </a>
            <p className="flex items-start gap-3 text-sm text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /> {booking.address}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold text-slate-800 mb-3">Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {BOOKING_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer',
                    booking.status === s
                      ? 'bg-navy-900 text-white border-navy-900'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400',
                  )}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="font-display font-bold text-slate-800">Technician</h3>
            <input
              className={adminInput}
              placeholder="Technician name"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              aria-label="Assign technician"
            />
            <button onClick={saveTech} className="w-full rounded-lg bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold py-2.5 transition-colors cursor-pointer">
              Save assignment
            </button>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="font-display font-bold text-slate-800">Reschedule</h3>
            <input type="date" className={adminInput} value={reschedule.date}
              onChange={(e) => setReschedule((r) => ({ ...r, date: e.target.value }))} aria-label="New date" />
            <input className={adminInput} placeholder="Time window (optional)" value={reschedule.time}
              onChange={(e) => setReschedule((r) => ({ ...r, time: e.target.value }))} aria-label="New time" />
            <button
              onClick={saveReschedule}
              disabled={!reschedule.date}
              className="w-full rounded-lg border border-royal-600 text-royal-600 hover:bg-royal-600 hover:text-white disabled:opacity-40 text-sm font-semibold py-2.5 transition-colors cursor-pointer"
            >
              Reschedule
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
