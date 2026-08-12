import { useEffect, useMemo, useRef, useState } from 'react'
import { Headset, Search, Send } from 'lucide-react'
import {
  listConversations, listMessages, sendMessage, subscribe, updateConversation,
} from '../../lib/db'
import type { ChatMessage, Conversation, ConversationStatus } from '../../lib/types'
import { Card, EmptyState, StatusBadge, adminInput } from './adminUi'
import { useAdminSession } from './AdminLayout'
import { timeAgo, cn } from '../../lib/utils'

const CONVO_STATUSES: ConversationStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED']

export default function Conversations() {
  const session = useAdminSession()
  const [convos, setConvos] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [reply, setReply] = useState('')
  const [query, setQuery] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = () => listConversations().then(setConvos).catch(() => {})
    load()
    return subscribe('conversations', load)
  }, [])

  useEffect(() => {
    if (!activeId) return
    const load = () => listMessages(activeId).then(setMessages).catch(() => {})
    load()
    return subscribe('messages', load)
  }, [activeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const active = convos.find((c) => c.id === activeId) ?? null

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return convos.filter(
      (c) => !q || c.customer_name.toLowerCase().includes(q) || c.customer_contact.toLowerCase().includes(q),
    )
  }, [convos, query])

  const open = async (c: Conversation) => {
    setActiveId(c.id)
    if (c.unread_admin) await updateConversation(c.id, { unread_admin: false })
  }

  const sendReply = async () => {
    if (!reply.trim() || !activeId) return
    await sendMessage(activeId, 'admin', reply.trim())
    if (active?.status === 'OPEN') {
      await updateConversation(activeId, { status: 'IN_PROGRESS', assigned_to: session.name })
    }
    setReply('')
  }

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-bold text-slate-900">Conversations</h2>
      <div className="grid lg:grid-cols-[340px_1fr] gap-5 min-h-[560px]">
        {/* List */}
        <Card className="overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className={cn(adminInput, 'pl-9')}
                placeholder="Search conversations…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search conversations"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 && (
              <EmptyState title="No conversations" body="Website chat conversations will appear here." />
            )}
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => open(c)}
                className={cn(
                  'w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer',
                  activeId === c.id && 'bg-blue-50/70',
                )}
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800 flex-1 truncate">{c.customer_name}</p>
                  {c.needs_human && (
                    <span title="Requested a representative">
                      <Headset className="w-4 h-4 text-brand-red-500 shrink-0" />
                    </span>
                  )}
                  {c.unread_admin && <span className="w-2 h-2 rounded-full bg-royal-600 shrink-0" />}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {c.customer_contact || 'No contact info'} · {timeAgo(c.updated_at)}
                </p>
                <div className="mt-1.5"><StatusBadge status={c.status} /></div>
              </button>
            ))}
          </div>
        </Card>

        {/* Thread */}
        <Card className="flex flex-col overflow-hidden">
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
                <div className="mr-auto">
                  <p className="font-semibold text-slate-800 text-sm">{active.customer_name}</p>
                  <p className="text-xs text-slate-400">
                    {active.customer_contact || 'No contact provided'}
                    {active.assigned_to && ` · Assigned to ${active.assigned_to}`}
                  </p>
                </div>
                <select
                  value={active.status}
                  onChange={(e) => updateConversation(active.id, { status: e.target.value as ConversationStatus })}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer"
                  aria-label="Conversation status"
                >
                  {CONVO_STATUSES.map((s) => <option key={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <button
                  onClick={() => updateConversation(active.id, { assigned_to: session.name })}
                  className="text-xs font-semibold text-royal-600 border border-royal-600/40 rounded-lg px-3 py-1.5 hover:bg-royal-600 hover:text-white transition-colors cursor-pointer"
                >
                  Assign to me
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/60">
                {messages.map((m) => (
                  <div key={m.id} className={cn('flex', m.sender === 'admin' ? 'justify-end' : 'justify-start')}>
                    <div
                      className={cn(
                        'px-4 py-2.5 max-w-[75%] text-sm rounded-2xl whitespace-pre-line',
                        m.sender === 'admin'
                          ? 'bg-royal-600 text-white rounded-br-md'
                          : m.sender === 'bot'
                            ? 'bg-slate-200/80 text-slate-600 rounded-tl-md'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-md',
                      )}
                    >
                      {m.sender === 'bot' && (
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Bot</p>
                      )}
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="p-4 border-t border-slate-100 flex gap-2">
                <input
                  className={adminInput}
                  placeholder="Reply as Burton's Reliable…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                  aria-label="Reply"
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim()}
                  className="shrink-0 rounded-lg bg-royal-600 hover:bg-royal-700 disabled:opacity-40 text-white px-4 transition-colors cursor-pointer"
                  aria-label="Send reply"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
