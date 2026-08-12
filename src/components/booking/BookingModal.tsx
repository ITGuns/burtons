import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle2, Upload, Loader2 } from 'lucide-react'
import Button from '../ui/Button'
import { BOOKING_SERVICES, BUSINESS } from '../../lib/constants'
import { createBooking } from '../../lib/db'
import { isValidEmail, isValidPhone } from '../../lib/utils'
import { useStore } from '../../store/useStore'
import type { PropertyType, Urgency } from '../../lib/types'

const URGENCIES: { value: Urgency; label: string; hint: string }[] = [
  { value: 'ROUTINE', label: 'Routine', hint: 'Within a week or two' },
  { value: 'SOON', label: 'Soon', hint: 'In the next few days' },
  { value: 'URGENT', label: 'Urgent', hint: 'As soon as possible' },
  { value: 'EMERGENCY', label: 'Emergency', hint: 'System down? Call us too!' },
]

const TIME_SLOTS = ['Morning (8–11 AM)', 'Midday (11 AM–2 PM)', 'Afternoon (2–6 PM)', 'Saturday morning', 'Flexible']

const initialForm = {
  customer_name: '', phone: '', email: '', address: '',
  service: '', description: '', preferred_date: '', preferred_time: '',
  urgency: 'ROUTINE' as Urgency, property_type: 'RESIDENTIAL' as PropertyType,
  notes: '', photo_name: undefined as string | undefined,
}

export default function BookingModal() {
  const { bookingOpen, bookingService, closeBooking, toast } = useStore()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null)

  useEffect(() => {
    if (bookingOpen) {
      setForm((f) => ({ ...initialForm, service: bookingService || f.service }))
      setErrors({})
      setConfirmedRef(null)
    }
  }, [bookingOpen, bookingService])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeBooking()
    if (bookingOpen) {
      window.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [bookingOpen, closeBooking])

  const set = (key: keyof typeof initialForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (form.customer_name.trim().length < 2) e.customer_name = 'Please enter your name'
    if (!isValidPhone(form.phone)) e.phone = 'Please enter a valid phone number'
    if (!isValidEmail(form.email)) e.email = 'Please enter a valid email'
    if (form.address.trim().length < 5) e.address = 'Please enter your service address'
    if (!form.service) e.service = 'Please choose a service'
    if (!form.preferred_date) e.preferred_date = 'Please pick a preferred date'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const booking = await createBooking(form)
      setConfirmedRef(booking.booking_ref)
      toast({ title: 'Request received', body: `Reference ${booking.booking_ref}`, tone: 'success' })
    } catch (err) {
      toast({
        title: 'Something went wrong',
        body: err instanceof Error ? err.message : 'Please try again or call us.',
        tone: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = (key: string) =>
    `w-full rounded-xl bg-frost-50 border px-4 py-3 text-sm text-navy-900 placeholder:text-navy-900/35 focus:outline-none focus:border-royal-500 focus:bg-white transition-colors ${
      errors[key] ? 'border-brand-red-500/70' : 'border-navy-900/10'
    }`

  const label = 'font-display text-[10px] tracking-[0.25em] uppercase text-navy-900/50 mb-2 block'

  return (
    <AnimatePresence>
      {bookingOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-navy-900/40 backdrop-blur-md"
          onClick={closeBooking}
          role="dialog"
          aria-modal="true"
          aria-label="Request service"
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-2xl max-h-[92svh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-[28px] shadow-2xl"
          >
            {confirmedRef ? (
              <div className="p-10 sm:p-14 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                </motion.div>
                <h2 className="font-display text-3xl font-medium text-navy-900">Request received</h2>
                <p className="mt-4 text-navy-900/60 leading-relaxed max-w-md mx-auto">
                  We&apos;ve received your service request. {BUSINESS.shortName} will contact you shortly to confirm
                  your appointment.
                </p>
                <p className="mt-6 font-display text-sm tracking-[0.2em] text-royal-600">
                  REFERENCE: {confirmedRef}
                </p>
                <p className="mt-2 text-xs text-navy-900/45">
                  Need us faster? Call {BUSINESS.phone}
                </p>
                <Button className="mt-8" onClick={closeBooking}>Done</Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-navy-900/8 bg-white/95 backdrop-blur-xl rounded-t-3xl">
                  <div>
                    <h2 className="font-display text-xl font-medium text-navy-900">Request Service</h2>
                    <p className="text-xs text-navy-900/50 mt-0.5">
                      Free estimates · Transparent pricing · {BUSINESS.phone}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeBooking}
                    className="text-navy-900/40 hover:text-navy-900 p-2 cursor-pointer"
                    aria-label="Close booking form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 sm:p-8 grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={label} htmlFor="bk-name">Full name *</label>
                    <input id="bk-name" className={inputCls('customer_name')} value={form.customer_name}
                      onChange={(e) => set('customer_name', e.target.value)} placeholder="Your name" autoComplete="name" />
                    {errors.customer_name && <p className="text-xs text-brand-red-500 mt-1">{errors.customer_name}</p>}
                  </div>
                  <div>
                    <label className={label} htmlFor="bk-phone">Phone *</label>
                    <input id="bk-phone" type="tel" className={inputCls('phone')} value={form.phone}
                      onChange={(e) => set('phone', e.target.value)} placeholder="(225) 555-0100" autoComplete="tel" />
                    {errors.phone && <p className="text-xs text-brand-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className={label} htmlFor="bk-email">Email *</label>
                    <input id="bk-email" type="email" className={inputCls('email')} value={form.email}
                      onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" autoComplete="email" />
                    {errors.email && <p className="text-xs text-brand-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={label} htmlFor="bk-address">Service address *</label>
                    <input id="bk-address" className={inputCls('address')} value={form.address}
                      onChange={(e) => set('address', e.target.value)} placeholder="Street, city, ZIP" autoComplete="street-address" />
                    {errors.address && <p className="text-xs text-brand-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className={label} htmlFor="bk-service">Service needed *</label>
                    <select id="bk-service" className={inputCls('service')} value={form.service}
                      onChange={(e) => set('service', e.target.value)}>
                      <option value="">Select a service…</option>
                      {BOOKING_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.service && <p className="text-xs text-brand-red-500 mt-1">{errors.service}</p>}
                  </div>
                  <div>
                    <label className={label}>Property type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['RESIDENTIAL', 'COMMERCIAL'] as PropertyType[]).map((p) => (
                        <button
                          key={p} type="button"
                          onClick={() => set('property_type', p)}
                          className={`rounded-xl border px-3 py-3 font-display text-[11px] tracking-widest uppercase transition-all cursor-pointer ${
                            form.property_type === p
                              ? 'border-royal-500/60 bg-royal-500/10 text-royal-700'
                              : 'border-navy-900/10 text-navy-900/50 hover:border-navy-900/25'
                          }`}
                        >
                          {p.toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={label} htmlFor="bk-date">Preferred date *</label>
                    <input id="bk-date" type="date" className={inputCls('preferred_date')} value={form.preferred_date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => set('preferred_date', e.target.value)} />
                    {errors.preferred_date && <p className="text-xs text-brand-red-500 mt-1">{errors.preferred_date}</p>}
                  </div>
                  <div>
                    <label className={label} htmlFor="bk-time">Preferred time</label>
                    <select id="bk-time" className={inputCls('preferred_time')} value={form.preferred_time}
                      onChange={(e) => set('preferred_time', e.target.value)}>
                      <option value="">Any time</option>
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label}>Urgency</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {URGENCIES.map((u) => (
                        <button
                          key={u.value} type="button"
                          onClick={() => set('urgency', u.value)}
                          className={`rounded-xl border px-3 py-2.5 text-left transition-all cursor-pointer ${
                            form.urgency === u.value
                              ? u.value === 'EMERGENCY'
                                ? 'border-brand-red-500/60 bg-brand-red-500/10'
                                : 'border-royal-500/60 bg-royal-500/10'
                              : 'border-navy-900/10 hover:border-navy-900/25'
                          }`}
                        >
                          <span className={`font-display text-[11px] tracking-widest uppercase block ${
                            form.urgency === u.value ? 'text-navy-900' : 'text-navy-900/60'
                          }`}>{u.label}</span>
                          <span className="text-[10px] text-navy-900/45">{u.hint}</span>
                        </button>
                      ))}
                    </div>
                    {form.urgency === 'EMERGENCY' && (
                      <p className="text-xs text-brand-red-500 mt-2">
                        For emergencies, please also call {BUSINESS.phone} for the fastest response.
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label} htmlFor="bk-desc">Describe the problem</label>
                    <textarea id="bk-desc" rows={3} className={inputCls('description')} value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      placeholder="What's happening with your system? Strange noises, no cooling, weak airflow…" />
                  </div>
                  <div>
                    <label className={label} htmlFor="bk-photo">Photo (optional)</label>
                    <label
                      htmlFor="bk-photo"
                      className="flex items-center gap-3 rounded-xl border border-dashed border-navy-900/15 px-4 py-3 text-sm text-navy-900/45 hover:border-royal-500/50 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="truncate">{form.photo_name || 'Upload a photo of the issue'}</span>
                    </label>
                    <input
                      id="bk-photo" type="file" accept="image/*" className="sr-only"
                      onChange={(e) => setForm((f) => ({ ...f, photo_name: e.target.files?.[0]?.name }))}
                    />
                  </div>
                  <div>
                    <label className={label} htmlFor="bk-notes">Additional notes</label>
                    <input id="bk-notes" className={inputCls('notes')} value={form.notes}
                      onChange={(e) => set('notes', e.target.value)} placeholder="Gate codes, pets, parking…" />
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-8">
                  <Button size="lg" className="w-full" disabled={submitting} type="submit" magnetic={false}>
                    {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>) : 'Submit Request'}
                  </Button>
                  <p className="text-center text-[11px] text-navy-900/40 mt-4">
                    By submitting you agree to be contacted by {BUSINESS.shortName} about your request.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
