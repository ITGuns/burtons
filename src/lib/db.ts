/**
 * Unified data layer.
 *
 * When VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set, all reads/writes go
 * through Supabase (schema in /supabase/migrations) with realtime channels.
 * Otherwise a localStorage-backed demo adapter is used so the full product
 * (booking, admin, chat) works out of the box. Cross-tab "realtime" in demo
 * mode is driven by the browser's `storage` event plus an in-page emitter.
 */
import { supabase, isSupabaseConfigured } from './supabase'
import { uid, bookingRef, sanitize } from './utils'
import type {
  Booking, Lead, Conversation, ChatMessage, KBArticle,
  AppNotification, SiteContent, InternalNote,
} from './types'

type Table =
  | 'bookings' | 'leads' | 'conversations' | 'messages'
  | 'knowledge_base' | 'notifications' | 'site_content'

const PREFIX = 'br_'

// ---------- local adapter ----------
function readAll<T>(table: Table): T[] {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + table) || '[]') as T[]
  } catch {
    return []
  }
}

function writeAll<T>(table: Table, rows: T[]) {
  localStorage.setItem(PREFIX + table, JSON.stringify(rows))
  emitLocal(table)
}

// ---------- change subscription ----------
type Listener = () => void
const listeners = new Map<Table, Set<Listener>>()

function emitLocal(table: Table) {
  listeners.get(table)?.forEach((fn) => fn())
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key?.startsWith(PREFIX)) {
      emitLocal(e.key.slice(PREFIX.length) as Table)
    }
  })
}

export function subscribe(table: Table, fn: Listener): () => void {
  if (isSupabaseConfigured && supabase) {
    const sb = supabase
    const channel = sb
      .channel(`db-${table}-${uid()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, fn)
      .subscribe()
    return () => { sb.removeChannel(channel) }
  }
  if (!listeners.has(table)) listeners.set(table, new Set())
  listeners.get(table)!.add(fn)
  return () => listeners.get(table)?.delete(fn)
}

// ---------- generic helpers ----------
async function list<T>(table: Table, orderBy = 'created_at'): Promise<T[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []) as T[]
  }
  const rows = readAll<T>(table)
  return [...rows].sort((a, b) =>
    String((b as Record<string, unknown>)[orderBy] ?? '').localeCompare(
      String((a as Record<string, unknown>)[orderBy] ?? ''),
    ),
  )
}

async function insert<T extends { id: string }>(table: Table, row: T): Promise<T> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from(table).insert(row).select().single()
    if (error) throw new Error(error.message)
    return data as T
  }
  writeAll(table, [row, ...readAll<T>(table)])
  return row
}

async function update<T extends { id: string }>(
  table: Table, id: string, patch: Partial<T>,
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from(table).update(patch as Record<string, unknown>).eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  writeAll(
    table,
    readAll<T>(table).map((r) => (r.id === id ? { ...r, ...patch } : r)),
  )
}

async function remove(table: Table, id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  writeAll(table, readAll<{ id: string }>(table).filter((r) => r.id !== id))
}

// ---------- bookings ----------
export interface NewBookingInput {
  customer_name: string
  phone: string
  email: string
  address: string
  service: string
  description: string
  preferred_date: string
  preferred_time: string
  urgency: Booking['urgency']
  property_type: Booking['property_type']
  notes: string
  photo_name?: string
}

export async function createBooking(input: NewBookingInput): Promise<Booking> {
  const now = new Date().toISOString()
  const seq = (await list<Booking>('bookings')).length + 1
  const booking: Booking = {
    id: uid(),
    booking_ref: bookingRef(seq),
    customer_name: sanitize(input.customer_name, 120),
    phone: sanitize(input.phone, 30),
    email: sanitize(input.email, 160),
    address: sanitize(input.address, 240),
    service: sanitize(input.service, 80),
    description: sanitize(input.description),
    preferred_date: input.preferred_date,
    preferred_time: input.preferred_time,
    urgency: input.urgency,
    property_type: input.property_type,
    notes: sanitize(input.notes),
    photo_name: input.photo_name,
    status: 'NEW',
    internal_notes: [],
    created_at: now,
    updated_at: now,
  }
  await insert('bookings', booking)
  // Every booking also becomes a lead + admin notification.
  await createLead({
    name: booking.customer_name,
    phone: booking.phone,
    email: booking.email,
    address: booking.address,
    service: booking.service,
    source: 'Booking form',
  })
  await pushNotification({
    title: 'New service request',
    body: `${booking.customer_name} — ${booking.service} (${booking.booking_ref})`,
    link: '/admin/bookings',
  })
  return booking
}

export const listBookings = () => list<Booking>('bookings')

export async function updateBooking(id: string, patch: Partial<Booking>) {
  await update<Booking>('bookings', id, { ...patch, updated_at: new Date().toISOString() })
}

export async function addBookingNote(booking: Booking, note: InternalNote) {
  await updateBooking(booking.id, {
    internal_notes: [...booking.internal_notes, note],
  })
}

// ---------- leads ----------
export async function createLead(input: {
  name: string; phone: string; email: string; address: string
  service: string; source: string
}): Promise<Lead> {
  const lead: Lead = {
    id: uid(),
    name: sanitize(input.name, 120),
    phone: sanitize(input.phone, 30),
    email: sanitize(input.email, 160),
    address: sanitize(input.address, 240),
    service: sanitize(input.service, 80),
    source: input.source,
    status: 'NEW',
    notes: [],
    created_at: new Date().toISOString(),
  }
  return insert('leads', lead)
}

export const listLeads = () => list<Lead>('leads')
export const updateLead = (id: string, patch: Partial<Lead>) => update<Lead>('leads', id, patch)

// ---------- conversations & messages ----------
export async function createConversation(customerName: string, contact: string): Promise<Conversation> {
  const now = new Date().toISOString()
  const convo: Conversation = {
    id: uid(),
    customer_name: sanitize(customerName, 120) || 'Website visitor',
    customer_contact: sanitize(contact, 160),
    status: 'OPEN',
    needs_human: false,
    unread_admin: false,
    created_at: now,
    updated_at: now,
  }
  return insert('conversations', convo)
}

export const listConversations = () => list<Conversation>('conversations', 'updated_at')

export const updateConversation = (id: string, patch: Partial<Conversation>) =>
  update<Conversation>('conversations', id, { ...patch, updated_at: new Date().toISOString() })

export async function sendMessage(
  conversationId: string, sender: ChatMessage['sender'], text: string,
): Promise<ChatMessage> {
  const msg: ChatMessage = {
    id: uid(),
    conversation_id: conversationId,
    sender,
    text: sanitize(text, 4000),
    created_at: new Date().toISOString(),
  }
  await insert('messages', msg)
  await updateConversation(conversationId, {
    unread_admin: sender === 'customer',
  })
  return msg
}

export async function listMessages(conversationId: string): Promise<ChatMessage[]> {
  const all = await list<ChatMessage>('messages')
  return all
    .filter((m) => m.conversation_id === conversationId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
}

export async function requestHumanHandoff(conversationId: string, name: string, contact: string) {
  await updateConversation(conversationId, {
    needs_human: true,
    status: 'OPEN',
    customer_name: sanitize(name, 120) || 'Website visitor',
    customer_contact: sanitize(contact, 160),
  })
  await pushNotification({
    title: 'Chat handoff requested',
    body: `${name || 'A website visitor'} wants to talk to a representative.`,
    link: '/admin/conversations',
  })
}

// ---------- knowledge base ----------
export const listKB = () => list<KBArticle>('knowledge_base')

export async function saveKB(article: Partial<KBArticle> & { title: string; content: string; category: string }) {
  const now = new Date().toISOString()
  if (article.id) {
    await update<KBArticle>('knowledge_base', article.id, { ...article, updated_at: now })
    return
  }
  await insert<KBArticle>('knowledge_base', {
    id: uid(),
    title: sanitize(article.title, 200),
    category: sanitize(article.category, 80),
    content: sanitize(article.content, 8000),
    published: article.published ?? true,
    created_at: now,
    updated_at: now,
  })
}

export const deleteKB = (id: string) => remove('knowledge_base', id)

// ---------- notifications ----------
export async function pushNotification(input: { title: string; body: string; link?: string }) {
  const n: AppNotification = {
    id: uid(),
    title: input.title,
    body: input.body,
    link: input.link,
    read: false,
    created_at: new Date().toISOString(),
  }
  await insert('notifications', n)
}

export const listNotifications = () => list<AppNotification>('notifications')
export const markNotificationRead = (id: string) =>
  update<AppNotification>('notifications', id, { read: true })

// ---------- site content (CMS) ----------
const DEFAULT_CONTENT: SiteContent = {
  hero_headline: "BURTON'S RELIABLE",
  hero_subheadline: 'Engineered for comfort. Built for reliability.',
  hero_description:
    'Premium heating, cooling, installation and HVAC repair services for homes and businesses throughout Baton Rouge.',
  cta_text: 'Request Service',
}

export async function getSiteContent(): Promise<SiteContent> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('site_content').select('*').eq('id', 'main').maybeSingle()
    return data ? { ...DEFAULT_CONTENT, ...(data.content as Partial<SiteContent>) } : DEFAULT_CONTENT
  }
  try {
    const raw = localStorage.getItem(PREFIX + 'site_content')
    return raw ? { ...DEFAULT_CONTENT, ...(JSON.parse(raw) as Partial<SiteContent>) } : DEFAULT_CONTENT
  } catch {
    return DEFAULT_CONTENT
  }
}

export async function saveSiteContent(content: SiteContent) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('site_content').upsert({ id: 'main', content })
    if (error) throw new Error(error.message)
    return
  }
  localStorage.setItem(PREFIX + 'site_content', JSON.stringify(content))
  emitLocal('site_content')
}
