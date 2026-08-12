import { useEffect, useMemo, useState } from 'react'
import { Search, StickyNote } from 'lucide-react'
import { listLeads, subscribe, updateLead } from '../../lib/db'
import type { Lead, LeadStatus } from '../../lib/types'
import { Card, EmptyState, LEAD_STATUSES, StatusBadge, adminInput } from './adminUi'
import { useAdminSession } from './AdminLayout'
import { formatDate, cn } from '../../lib/utils'

export default function Leads() {
  const session = useAdminSession()
  const [leads, setLeads] = useState<Lead[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<LeadStatus | 'ALL'>('ALL')
  const [noteFor, setNoteFor] = useState<string | null>(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    const load = () => listLeads().then(setLeads).catch(() => {})
    load()
    return subscribe('leads', load)
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return leads.filter((l) => {
      if (status !== 'ALL' && l.status !== status) return false
      if (q && ![l.name, l.phone, l.email, l.service, l.source].some((f) => f.toLowerCase().includes(q))) return false
      return true
    })
  }, [leads, query, status])

  const saveNote = async (lead: Lead) => {
    if (!note.trim()) return
    await updateLead(lead.id, {
      notes: [...lead.notes, { text: note.trim(), author: session.name, at: new Date().toISOString() }],
    })
    setNote('')
    setNoteFor(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl font-bold text-slate-900 mr-auto">Leads</h2>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className={cn(adminInput, 'pl-9 w-56')}
            placeholder="Search leads…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search leads"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ALL', ...LEAD_STATUSES] as const).map((s) => (
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
            {s} <span className="ml-1 text-[10px] opacity-60">
              {s === 'ALL' ? leads.length : leads.filter((l) => l.status === s).length}
            </span>
          </button>
        ))}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState title="No leads" body="Leads from bookings, the contact form and chat will appear here." />
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((l) => (
              <div key={l.id} className="px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-48">
                    <p className="text-sm font-semibold text-slate-800">{l.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {l.phone} · {l.email || 'no email'} · {formatDate(l.created_at)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {l.service} <span className="text-slate-300">·</span>{' '}
                      <span className="text-royal-600">{l.source}</span>
                    </p>
                  </div>
                  <select
                    value={l.status}
                    onChange={(e) => updateLead(l.id, { status: e.target.value as LeadStatus })}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
                    aria-label={`Status for ${l.name}`}
                  >
                    {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <StatusBadge status={l.status} />
                  <button
                    onClick={() => { setNoteFor(noteFor === l.id ? null : l.id); setNote('') }}
                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label="Notes"
                  >
                    <StickyNote className="w-4 h-4" />
                  </button>
                </div>
                {(l.notes.length > 0 || noteFor === l.id) && (
                  <div className="mt-3 pl-1 space-y-2">
                    {l.notes.map((n, i) => (
                      <p key={i} className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                        {n.text} <span className="text-slate-300">— {n.author}</span>
                      </p>
                    ))}
                    {noteFor === l.id && (
                      <div className="flex gap-2">
                        <input
                          className={adminInput}
                          placeholder="Add note…"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveNote(l)}
                          aria-label="New lead note"
                        />
                        <button
                          onClick={() => saveNote(l)}
                          className="shrink-0 rounded-lg bg-navy-900 text-white px-4 text-xs font-semibold hover:bg-navy-800 transition-colors cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    )}
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
