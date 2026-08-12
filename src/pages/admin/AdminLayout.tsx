import { createContext, useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, CalendarDays, ClipboardList, Users, MessageSquare,
  BookOpen, Wrench, FileEdit, BarChart3, Settings, LogOut, Bell, Menu, X,
} from 'lucide-react'
import Logo from '../../components/layout/Logo'
import { getSession, signOut, canAccess, type AdminSession } from '../../lib/auth'
import { listNotifications, markNotificationRead, subscribe } from '../../lib/db'
import type { AppNotification } from '../../lib/types'
import { timeAgo, cn } from '../../lib/utils'

const SessionContext = createContext<AdminSession | null>(null)
export const useAdminSession = () => {
  const s = useContext(SessionContext)
  if (!s) throw new Error('useAdminSession outside AdminLayout')
  return s
}

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', section: 'dashboard', end: true },
  { to: '/admin/bookings', icon: ClipboardList, label: 'Bookings', section: 'bookings' },
  { to: '/admin/calendar', icon: CalendarDays, label: 'Calendar', section: 'calendar' },
  { to: '/admin/leads', icon: Users, label: 'Leads', section: 'leads' },
  { to: '/admin/customers', icon: Users, label: 'Customers', section: 'customers' },
  { to: '/admin/conversations', icon: MessageSquare, label: 'Conversations', section: 'conversations' },
  { to: '/admin/knowledge-base', icon: BookOpen, label: 'Knowledge Base', section: 'knowledge-base' },
  { to: '/admin/services', icon: Wrench, label: 'Services', section: 'services' },
  { to: '/admin/content', icon: FileEdit, label: 'Content', section: 'content' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', section: 'analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings', section: 'settings' },
]

export default function AdminLayout() {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [checked, setChecked] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [mobileNav, setMobileNav] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getSession().then((s) => {
      setSession(s)
      setChecked(true)
      if (!s) navigate('/admin/login', { replace: true })
    })
  }, [navigate])

  useEffect(() => {
    if (!session) return
    const load = () => listNotifications().then(setNotifications).catch(() => {})
    load()
    return subscribe('notifications', load)
  }, [session])

  if (!checked) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="font-display text-xs tracking-[0.3em] uppercase text-slate-400">Authenticating…</p>
      </div>
    )
  }
  if (!session) return null

  const unread = notifications.filter((n) => !n.read).length
  const visibleNav = NAV.filter((n) => canAccess(session.role, n.section))

  const logout = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <SessionContext.Provider value={session}>
      <div className="admin-theme min-h-screen bg-slate-100 text-slate-900 flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 bg-navy-950 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static',
            mobileNav ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="px-5 py-6 flex items-center justify-between border-b border-white/8">
            <Logo />
            <button className="lg:hidden text-white/60 cursor-pointer" onClick={() => setMobileNav(false)} aria-label="Close navigation">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Admin navigation">
            {visibleNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileNav(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-royal-600/30 text-electric-300 border border-royal-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent',
                  )
                }
              >
                <item.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-white/8">
            <p className="text-xs text-white/40 px-2 mb-2">
              {session.name} · <span className="text-electric-400">{session.role.replace('_', ' ')}</span>
              {session.demo && <span className="ml-1 text-amber-400">(demo)</span>}
            </p>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-[18px] h-[18px]" /> Sign out
            </button>
          </div>
        </aside>

        {/* Overlay for mobile nav */}
        {mobileNav && (
          <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)} />
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-xl border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center gap-4">
            <button className="lg:hidden text-slate-500 cursor-pointer" onClick={() => setMobileNav(true)} aria-label="Open navigation">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-slate-800 text-sm tracking-wide uppercase">
              Admin Console
            </h1>
            {session.demo && (
              <span className="hidden sm:inline text-[11px] bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-3 py-1">
                Demo mode — connect Supabase for production data
              </span>
            )}
            <div className="ml-auto relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
              >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
                  >
                    <p className="px-4 py-3 text-xs font-display tracking-widest uppercase text-slate-400 border-b border-slate-100">
                      Notifications
                    </p>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 && (
                        <p className="px-4 py-8 text-sm text-slate-400 text-center">No notifications yet</p>
                      )}
                      {notifications.slice(0, 20).map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id)
                            setNotifOpen(false)
                            if (n.link) navigate(n.link)
                          }}
                          className={cn(
                            'w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer',
                            !n.read && 'bg-blue-50/60',
                          )}
                        >
                          <p className="text-sm font-medium text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SessionContext.Provider>
  )
}
