export type BookingStatus =
  | 'NEW'
  | 'CONFIRMED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'BOOKED'
  | 'COMPLETED'
  | 'LOST'

export type ConversationStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'

export type Urgency = 'ROUTINE' | 'SOON' | 'URGENT' | 'EMERGENCY'

export type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL'

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF'

export interface Booking {
  id: string
  booking_ref: string
  customer_name: string
  phone: string
  email: string
  address: string
  service: string
  description: string
  preferred_date: string
  preferred_time: string
  urgency: Urgency
  property_type: PropertyType
  notes: string
  photo_name?: string
  status: BookingStatus
  technician?: string
  internal_notes: InternalNote[]
  created_at: string
  updated_at: string
}

export interface InternalNote {
  text: string
  author: string
  at: string
}

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  address: string
  service: string
  source: string
  status: LeadStatus
  notes: InternalNote[]
  created_at: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender: 'customer' | 'bot' | 'admin'
  text: string
  created_at: string
}

export interface Conversation {
  id: string
  customer_name: string
  customer_contact: string
  status: ConversationStatus
  assigned_to?: string
  needs_human: boolean
  unread_admin: boolean
  created_at: string
  updated_at: string
}

export interface KBArticle {
  id: string
  title: string
  category: string
  content: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface SiteContent {
  hero_headline: string
  hero_subheadline: string
  hero_description: string
  cta_text: string
}

export interface AppNotification {
  id: string
  title: string
  body: string
  read: boolean
  link?: string
  created_at: string
}

export interface ServiceDef {
  slug: string
  title: string
  short: string
  headline: string
  description: string
  bullets: string[]
  icon: string
}
