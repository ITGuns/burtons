import { BUSINESS } from '../../lib/constants'
import { isSupabaseConfigured } from '../../lib/supabase'
import { Card } from './adminUi'
import { useAdminSession } from './AdminLayout'

export default function SettingsPage() {
  const session = useAdminSession()
  return (
    <div className="space-y-5 max-w-3xl">
      <h2 className="font-display text-2xl font-bold text-slate-900">Settings</h2>

      <Card className="p-6 space-y-2">
        <h3 className="font-display font-bold text-slate-800 mb-3">Your account</h3>
        <p className="text-sm text-slate-600"><span className="text-slate-400">Name:</span> {session.name}</p>
        <p className="text-sm text-slate-600"><span className="text-slate-400">Email:</span> {session.email}</p>
        <p className="text-sm text-slate-600">
          <span className="text-slate-400">Role:</span>{' '}
          <span className="font-semibold text-royal-700">{session.role.replace('_', ' ')}</span>
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="font-display font-bold text-slate-800 mb-3">Backend</h3>
        {isSupabaseConfigured ? (
          <p className="text-sm text-emerald-600 font-semibold">✓ Supabase connected: data, auth and realtime are live.</p>
        ) : (
          <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
            <p className="text-amber-600 font-semibold">Demo mode: data is stored in this browser only.</p>
            <p>To go to production:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-500">
              <li>Create a Supabase project and run <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">supabase/migrations/001_init.sql</code></li>
              <li>Set <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">VITE_SUPABASE_URL</code> and <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">VITE_SUPABASE_ANON_KEY</code> in <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">.env</code></li>
              <li>Create admin users in Supabase Auth and add rows to the <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">users</code> table with roles</li>
            </ol>
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-2">
        <h3 className="font-display font-bold text-slate-800 mb-3">Business profile</h3>
        <p className="text-sm text-slate-600">{BUSINESS.name}</p>
        <p className="text-sm text-slate-600">{BUSINESS.address}</p>
        <p className="text-sm text-slate-600">{BUSINESS.phone}</p>
        <p className="text-xs text-slate-400 mt-2">
          Edit in <code className="bg-slate-100 rounded px-1.5 py-0.5">src/lib/constants.ts</code>
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="font-display font-bold text-slate-800 mb-3">Roles</h3>
        <ul className="text-sm text-slate-600 space-y-1.5">
          <li><b>SUPER ADMIN</b>: full access including settings</li>
          <li><b>ADMIN</b>: bookings, leads, conversations, knowledge base, content, analytics</li>
          <li><b>STAFF</b>: dashboard, assigned bookings, calendar, customers</li>
        </ul>
      </Card>
    </div>
  )
}
