import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Send, Headset, Loader2 } from 'lucide-react'
import {
  createConversation, listMessages, sendMessage,
  requestHumanHandoff, subscribe,
} from '../../lib/db'
import { botReply, SUGGESTED_QUESTIONS } from '../../lib/chatbot'
import { BUSINESS } from '../../lib/constants'
import type { ChatMessage } from '../../lib/types'
import { cn } from '../../lib/utils'

const CONVO_KEY = 'br_chat_convo_id'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [convoId, setConvoId] = useState<string | null>(null)
  const [handoff, setHandoff] = useState(false)
  const [handoffForm, setHandoffForm] = useState({ name: '', contact: '' })
  const [handoffDone, setHandoffDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load or lazily create the conversation when the widget opens.
  useEffect(() => {
    if (!open) return
    const existing = localStorage.getItem(CONVO_KEY)
    if (existing) {
      setConvoId(existing)
      listMessages(existing).then(setMessages).catch(() => {})
    }
  }, [open])

  // Realtime: refresh when admin replies.
  useEffect(() => {
    if (!convoId) return
    const unsub = subscribe('messages', () => {
      listMessages(convoId).then(setMessages).catch(() => {})
    })
    return unsub
  }, [convoId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking, open])

  const ensureConvo = async (): Promise<string> => {
    if (convoId) return convoId
    const convo = await createConversation('Website visitor', '')
    localStorage.setItem(CONVO_KEY, convo.id)
    setConvoId(convo.id)
    return convo.id
  }

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || thinking) return
    setInput('')
    setThinking(true)
    try {
      const id = await ensureConvo()
      const userMsg = await sendMessage(id, 'customer', trimmed)
      setMessages((m) => [...m, userMsg])
      // Small human-feeling delay before the bot answers.
      const reply = await botReply(trimmed)
      await new Promise((r) => setTimeout(r, 500))
      const botMsg = await sendMessage(id, 'bot', reply)
      setMessages((m) => [...m, botMsg])
    } finally {
      setThinking(false)
    }
  }

  const submitHandoff = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = await ensureConvo()
    await requestHumanHandoff(id, handoffForm.name, handoffForm.contact)
    const note = await sendMessage(
      id, 'bot',
      `Thanks${handoffForm.name ? `, ${handoffForm.name}` : ''}! A ${BUSINESS.shortName} representative has been notified and will reply here or reach out at the contact you provided. For urgent issues, call ${BUSINESS.phone}.`,
    )
    setMessages((m) => [...m, note])
    setHandoff(false)
    setHandoffDone(true)
  }

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[65] flex items-center gap-3 rounded-full bg-royal-500 hover:bg-royal-600 text-white pl-4 pr-5 py-3.5 shadow-[0_8px_32px_rgba(54,41,209,0.45)] transition-all hover:scale-105 cursor-pointer"
            aria-label="Open chat — Need HVAC help?"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-display text-sm font-semibold hidden sm:inline">Need HVAC help?</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[65] w-full sm:w-[400px] h-[100svh] sm:h-[620px] sm:max-h-[calc(100svh-3rem)] bg-white border border-navy-900/8 sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Chat with Burton's Reliable"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-navy-900/8 bg-gradient-to-r from-frost-100 to-transparent">
              <span className="relative w-10 h-10 rounded-full bg-royal-500/10 border border-royal-500/30 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-royal-600" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
              </span>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-navy-900">{BUSINESS.shortName} Assistant</p>
                <p className="text-[11px] text-navy-900/50">Typically replies instantly</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-navy-900/40 hover:text-navy-900 p-1.5 cursor-pointer" aria-label="Close chat">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="bg-frost-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-navy-900/80 leading-relaxed">
                      Hi! 👋 I&apos;m the {BUSINESS.shortName} assistant. Ask me about our services, hours,
                      or how to book — or tap a question below.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="text-xs text-royal-600 border border-royal-500/30 rounded-full px-3.5 py-2 hover:bg-royal-500/10 transition-colors text-left cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={cn('flex', m.sender === 'customer' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'px-4 py-3 max-w-[85%] text-sm leading-relaxed whitespace-pre-line',
                      m.sender === 'customer'
                        ? 'bg-royal-600 text-white rounded-2xl rounded-br-md'
                        : m.sender === 'admin'
                          ? 'bg-brand-red-500/10 border border-brand-red-500/25 text-navy-900/85 rounded-2xl rounded-tl-md'
                          : 'bg-frost-100 text-navy-900/80 rounded-2xl rounded-tl-md',
                    )}
                  >
                    {m.sender === 'admin' && (
                      <p className="font-display text-[10px] tracking-[0.2em] uppercase text-brand-red-500 mb-1.5">
                        {BUSINESS.shortName} team
                      </p>
                    )}
                    {m.text}
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="bg-frost-100 rounded-2xl rounded-tl-md px-4 py-3 w-16 flex justify-center">
                  <Loader2 className="w-4 h-4 text-royal-600 animate-spin" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Handoff form */}
            <AnimatePresence>
              {handoff && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={submitHandoff}
                  className="border-t border-navy-900/8 overflow-hidden"
                >
                  <div className="p-4 space-y-3 bg-frost-50">
                    <p className="text-xs text-navy-900/60">
                      Leave your name and phone/email — a representative will get back to you.
                    </p>
                    <input
                      className="w-full rounded-xl bg-white border border-navy-900/10 px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-900/35 focus:outline-none focus:border-royal-500"
                      placeholder="Your name"
                      value={handoffForm.name}
                      onChange={(e) => setHandoffForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                    <input
                      className="w-full rounded-xl bg-white border border-navy-900/10 px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-900/35 focus:outline-none focus:border-royal-500"
                      placeholder="Phone or email"
                      value={handoffForm.contact}
                      onChange={(e) => setHandoffForm((f) => ({ ...f, contact: e.target.value }))}
                      required
                    />
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-brand-red-500 hover:bg-brand-red-600 text-white font-display text-xs tracking-widest uppercase py-3 transition-colors cursor-pointer"
                    >
                      Request Callback
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Composer */}
            <div className="border-t border-navy-900/8 p-4 space-y-3">
              {!handoff && !handoffDone && (
                <button
                  onClick={() => setHandoff(true)}
                  className="w-full flex items-center justify-center gap-2 text-xs font-display tracking-widest uppercase text-brand-red-500 border border-brand-red-500/30 rounded-lg py-2.5 hover:bg-brand-red-500/10 transition-colors cursor-pointer"
                >
                  <Headset className="w-4 h-4" /> Talk to a representative
                </button>
              )}
              <form
                onSubmit={(e) => { e.preventDefault(); send(input) }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question…"
                  aria-label="Chat message"
                  className="flex-1 rounded-full bg-frost-50 border border-navy-900/10 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-900/35 focus:outline-none focus:border-royal-500 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="w-12 h-12 rounded-full bg-royal-600 hover:bg-royal-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
