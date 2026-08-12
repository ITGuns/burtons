import { useState } from 'react'
import { Phone, MapPin, Clock, Siren, Loader2, CheckCircle2 } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import { BUSINESS } from '../lib/constants'
import { createLead, pushNotification } from '../lib/db'
import { isValidEmail, isValidPhone } from '../lib/utils'
import { useSEO } from '../lib/useSEO'
import { LOCAL_BUSINESS_SCHEMA } from '../lib/schema'
import { useStore } from '../store/useStore'

export default function Contact() {
  const openBooking = useStore((s) => s.openBooking)
  const toast = useStore((s) => s.toast)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useSEO({
    title: "Contact | Burton's Reliable Heating and Air Conditioning | Baton Rouge, LA",
    description:
      "Contact Burton's Reliable Heating and Air Conditioning LLC in Baton Rouge, LA. Call (225) 603-2253 or send a message for free estimates and HVAC service.",
    jsonLd: LOCAL_BUSINESS_SCHEMA,
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (form.name.trim().length < 2) errs.name = 'Please enter your name'
    if (!isValidPhone(form.phone)) errs.phone = 'Please enter a valid phone'
    if (!isValidEmail(form.email)) errs.email = 'Please enter a valid email'
    if (form.message.trim().length < 5) errs.message = 'Please enter a message'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSending(true)
    try {
      await createLead({
        name: form.name, phone: form.phone, email: form.email,
        address: '', service: form.message.slice(0, 80), source: 'Contact form',
      })
      await pushNotification({
        title: 'New contact message',
        body: `${form.name}: ${form.message.slice(0, 80)}`,
        link: '/admin/leads',
      })
      setSent(true)
      toast({ title: 'Message sent', body: "We'll be in touch shortly.", tone: 'success' })
    } catch {
      toast({ title: 'Could not send', body: `Please call ${BUSINESS.phone}.`, tone: 'error' })
    } finally {
      setSending(false)
    }
  }

  const inputCls = (k: string) =>
    `w-full rounded-xl bg-frost-50 border px-4 py-3 text-sm text-navy-900 placeholder:text-navy-900/35 focus:outline-none focus:border-royal-500 focus:bg-white transition-colors ${
      errors[k] ? 'border-brand-red-500/70' : 'border-navy-900/10'
    }`

  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title={'Let’s talk\ncomfort.'}
        description={`${BUSINESS.name} · ${BUSINESS.city}, ${BUSINESS.state}`}
      />
      <div className="max-w-6xl mx-auto px-6 py-16 pb-24 grid lg:grid-cols-2 gap-8">
        {/* Contact form */}
        <Reveal>
          <div className="bg-white border border-navy-900/8 shadow-[0_24px_56px_-32px_rgba(14,12,61,0.25)] rounded-[28px] p-8">
            {sent ? (
              <div className="text-center py-14">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-5" />
                <h2 className="font-display text-2xl font-medium text-navy-900">Message sent</h2>
                <p className="mt-3 text-navy-900/60">We&apos;ll get back to you shortly. Need us now? Call {BUSINESS.phone}.</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <h2 className="font-display text-xl font-medium text-navy-900 mb-1">Send a message</h2>
                <p className="text-sm text-navy-900/50">Questions, estimates, anything, we answer fast.</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <input aria-label="Your name" className={inputCls('name')} placeholder="Your name" value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    {errors.name && <p className="text-xs text-brand-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input aria-label="Phone" type="tel" className={inputCls('phone')} placeholder="Phone" value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                    {errors.phone && <p className="text-xs text-brand-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <input aria-label="Email" type="email" className={inputCls('email')} placeholder="Email" value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  {errors.email && <p className="text-xs text-brand-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <textarea aria-label="Message" rows={5} className={inputCls('message')} placeholder="How can we help?"
                    value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                  {errors.message && <p className="text-xs text-brand-red-500 mt-1">{errors.message}</p>}
                </div>
                <Button size="lg" className="w-full" type="submit" disabled={sending} magnetic={false}>
                  {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </Reveal>

        {/* Info column */}
        <div className="space-y-5">
          <Reveal delay={0.05}>
            <a href={BUSINESS.phoneHref} className="tile rounded-[24px] p-7 flex items-center gap-5 hover:bg-white hover:shadow-lg transition-all block">
              <span className="w-14 h-14 rounded-2xl bg-royal-500/10 border border-royal-500/25 flex items-center justify-center">
                <Phone className="w-6 h-6 text-royal-600" />
              </span>
              <div>
                <p className="font-display text-[10px] tracking-[0.3em] uppercase text-navy-900/45">Call us</p>
                <p className="font-display text-2xl font-medium text-navy-900">{BUSINESS.phone}</p>
              </div>
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="tile rounded-[24px] p-7 flex items-start gap-5">
              <span className="w-14 h-14 rounded-2xl bg-royal-500/10 border border-royal-500/25 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-royal-600" />
              </span>
              <div>
                <p className="font-display text-[10px] tracking-[0.3em] uppercase text-navy-900/45">Address</p>
                <p className="text-navy-900/75 mt-1">{BUSINESS.address}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="tile rounded-[24px] p-7 flex items-start gap-5">
              <span className="w-14 h-14 rounded-2xl bg-royal-500/10 border border-royal-500/25 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-royal-600" />
              </span>
              <div className="space-y-1.5">
                <p className="font-display text-[10px] tracking-[0.3em] uppercase text-navy-900/45">Business hours</p>
                {BUSINESS.hours.map((h) => (
                  <p key={h.days} className="text-sm text-navy-900/70">
                    <span className="text-navy-900/45">{h.days}:</span> {h.hours}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="rounded-[24px] p-7 bg-gradient-to-b from-[#fbe7e8] to-[#f8d0d2] flex items-start gap-5">
              <span className="w-14 h-14 rounded-2xl bg-white/70 border border-brand-red-500/25 flex items-center justify-center shrink-0">
                <Siren className="w-6 h-6 text-brand-red-500" />
              </span>
              <div>
                <p className="font-display text-[10px] tracking-[0.3em] uppercase text-brand-red-600">Emergency service</p>
                <p className="text-sm text-navy-900/70 mt-1 mb-4">System down? We offer emergency HVAC service.</p>
                <Button variant="red" size="sm" onClick={() => openBooking('Emergency Service')}>
                  Request Emergency Service
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
