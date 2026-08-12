import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Lock } from 'lucide-react'
import Logo from '../../components/layout/Logo'
import { signIn } from '../../lib/auth'
import { isSupabaseConfigured } from '../../lib/supabase'
import { useSEO } from '../../lib/useSEO'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  useSEO({ title: 'Admin Login | Burton\'s Reliable', description: 'Secure admin access.' })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-25" aria-hidden="true" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-royal-700/20 blur-[120px]" aria-hidden="true" />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8"><Logo light /></div>
        <form onSubmit={submit} className="glass bg-navy-900/80 rounded-3xl p-8 space-y-5">
          <div className="text-center mb-2">
            <span className="inline-flex w-12 h-12 rounded-2xl bg-royal-600/25 border border-royal-500/40 items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-electric-400" />
            </span>
            <h1 className="font-display text-xl font-bold text-white">ADMIN ACCESS</h1>
            <p className="text-xs text-white/50 mt-1">Authorized personnel only</p>
          </div>
          <div>
            <label className="font-display text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2 block" htmlFor="adm-email">
              Email
            </label>
            <input
              id="adm-email" type="email" required autoComplete="username"
              className="w-full rounded-lg bg-navy-800/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-400/70 transition-colors"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="font-display text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2 block" htmlFor="adm-pass">
              Password
            </label>
            <input
              id="adm-pass" type="password" required autoComplete="current-password"
              className="w-full rounded-lg bg-navy-800/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-400/70 transition-colors"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-brand-red-500">{error}</p>}
          <button
            type="submit" disabled={busy}
            className="w-full rounded-lg bg-royal-500 hover:bg-royal-600 disabled:opacity-50 text-white font-display text-xs tracking-widest uppercase py-3.5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign In'}
          </button>
          {!isSupabaseConfigured && (
            <p className="text-[11px] text-amber-400/80 text-center leading-relaxed">
              Demo mode: no backend connected. Use any email with password &quot;demo&quot;.
              Configure VITE_SUPABASE_URL for real authentication.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
