import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { getSiteContent, saveSiteContent } from '../../lib/db'
import type { SiteContent } from '../../lib/types'
import { Card, adminInput } from './adminUi'
import { useStore } from '../../store/useStore'

/** CMS-style controls for public site copy. */
export default function ContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [saving, setSaving] = useState(false)
  const toast = useStore((s) => s.toast)

  useEffect(() => {
    getSiteContent().then(setContent).catch(() => {})
  }, [])

  if (!content) return <p className="text-sm text-slate-400">Loading content…</p>

  const save = async () => {
    setSaving(true)
    try {
      await saveSiteContent(content)
      toast({ title: 'Content published', body: 'The website updates immediately.', tone: 'success' })
    } catch {
      toast({ title: 'Save failed', tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const field = (
    label: string, key: keyof SiteContent, hint: string, textarea = false,
  ) => (
    <div>
      <label className="text-sm font-semibold text-slate-700 block mb-1" htmlFor={`content-${key}`}>{label}</label>
      <p className="text-xs text-slate-400 mb-2">{hint}</p>
      {textarea ? (
        <textarea
          id={`content-${key}`} className={adminInput} rows={3} value={content[key]}
          onChange={(e) => setContent((c) => c && { ...c, [key]: e.target.value })}
        />
      ) : (
        <input
          id={`content-${key}`} className={adminInput} value={content[key]}
          onChange={(e) => setContent((c) => c && { ...c, [key]: e.target.value })}
        />
      )}
    </div>
  )

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="mr-auto">
          <h2 className="font-display text-2xl font-bold text-slate-900">Site Content</h2>
          <p className="text-sm text-slate-500 mt-1">Edit public website copy — changes go live instantly.</p>
        </div>
        <button
          onClick={save} disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-royal-600 hover:bg-royal-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" /> {saving ? 'Publishing…' : 'Publish changes'}
        </button>
      </div>

      <Card className="p-6 space-y-6">
        <h3 className="font-display font-bold text-slate-800">Hero section</h3>
        {field('Hero subheadline', 'hero_subheadline', 'The tagline under the main headline.')}
        {field('Hero description', 'hero_description', 'Supporting paragraph in the hero.', true)}
        {field('Primary CTA text', 'cta_text', 'The main button label, e.g. "Request Service".')}
      </Card>

      <Card className="p-6">
        <h3 className="font-display font-bold text-slate-800 mb-2">Other content</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Services, FAQs, business hours and contact details are managed in code
          (<code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">src/lib/constants.ts</code>,{' '}
          <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">src/data/</code>) or via the
          Knowledge Base for chatbot answers. Connect Supabase to manage all content dynamically.
        </p>
      </Card>
    </div>
  )
}
