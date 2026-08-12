/**
 * Admin authentication.
 *
 * Production: Supabase Auth (email/password) with roles stored in the `users`
 * table and enforced by RLS (see /supabase/migrations).
 * Demo mode (no Supabase env vars): a clearly-labeled local session so the
 * admin UI can be evaluated. Demo mode grants no access to any real data.
 */
import { supabase, isSupabaseConfigured } from './supabase'
import type { AdminRole } from './types'

export interface AdminSession {
  email: string
  role: AdminRole
  name: string
  demo: boolean
}

const DEMO_KEY = 'br_demo_session'

export async function signIn(email: string, password: string): Promise<AdminSession> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    const { data: profile } = await supabase
      .from('users')
      .select('role, name')
      .eq('id', data.user.id)
      .single()
    if (!profile) throw new Error('No admin profile found for this account.')
    return {
      email: data.user.email ?? email,
      role: (profile.role as AdminRole) ?? 'STAFF',
      name: profile.name ?? email,
      demo: false,
    }
  }
  // Demo mode: accept any email with the demo password shown on the login page.
  if (password !== 'demo') {
    throw new Error('Demo mode: use password "demo". Connect Supabase for real authentication.')
  }
  const session: AdminSession = {
    email,
    role: 'SUPER_ADMIN',
    name: email.split('@')[0] || 'Demo Admin',
    demo: true,
  }
  sessionStorage.setItem(DEMO_KEY, JSON.stringify(session))
  return session
}

export async function getSession(): Promise<AdminSession | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession()
    if (!data.session?.user) return null
    const { data: profile } = await supabase
      .from('users')
      .select('role, name')
      .eq('id', data.session.user.id)
      .single()
    if (!profile) return null
    return {
      email: data.session.user.email ?? '',
      role: (profile.role as AdminRole) ?? 'STAFF',
      name: profile.name ?? '',
      demo: false,
    }
  }
  try {
    const raw = sessionStorage.getItem(DEMO_KEY)
    return raw ? (JSON.parse(raw) as AdminSession) : null
  } catch {
    return null
  }
}

export async function signOut() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut()
    return
  }
  sessionStorage.removeItem(DEMO_KEY)
}

export function canAccess(role: AdminRole, section: string): boolean {
  if (role === 'SUPER_ADMIN') return true
  if (role === 'ADMIN') {
    return !['settings'].includes(section)
  }
  // STAFF
  return ['dashboard', 'bookings', 'calendar', 'customers'].includes(section)
}
