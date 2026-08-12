import { useEffect, useState } from 'react'
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { deleteKB, listKB, saveKB, subscribe } from '../../lib/db'
import type { KBArticle } from '../../lib/types'
import { Card, EmptyState, adminInput } from './adminUi'
import { useStore } from '../../store/useStore'

const CATEGORIES = [
  'FAQ', 'Service descriptions', 'Service areas', 'Business hours',
  'Financing', 'Company information', 'Emergency service',
]

const empty = { id: '', title: '', category: 'FAQ', content: '', published: true }

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<KBArticle[]>([])
  const [editing, setEditing] = useState<typeof empty | null>(null)
  const toast = useStore((s) => s.toast)

  useEffect(() => {
    const load = () => listKB().then(setArticles).catch(() => {})
    load()
    return subscribe('knowledge_base', load)
  }, [])

  const save = async () => {
    if (!editing || !editing.title.trim() || !editing.content.trim()) return
    await saveKB({ ...editing, id: editing.id || undefined })
    toast({ title: editing.id ? 'Article updated' : 'Article created', tone: 'success' })
    setEditing(null)
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="mr-auto">
          <h2 className="font-display text-2xl font-bold text-slate-900">Knowledge Base</h2>
          <p className="text-sm text-slate-500 mt-1">
            Published articles are used by the website chatbot to answer customers.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 rounded-lg bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add article
        </button>
      </div>

      {editing && (
        <Card className="p-6 space-y-4 border-royal-500/40">
          <h3 className="font-display font-bold text-slate-800">
            {editing.id ? 'Edit article' : 'New article'}
          </h3>
          <div className="grid sm:grid-cols-[1fr_220px] gap-4">
            <input
              className={adminInput} placeholder="Title" value={editing.title}
              onChange={(e) => setEditing((s) => s && { ...s, title: e.target.value })}
              aria-label="Article title"
            />
            <select
              className={adminInput} value={editing.category}
              onChange={(e) => setEditing((s) => s && { ...s, category: e.target.value })}
              aria-label="Category"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <textarea
            className={adminInput} rows={6}
            placeholder="Article content — the chatbot quotes this text to customers."
            value={editing.content}
            onChange={(e) => setEditing((s) => s && { ...s, content: e.target.value })}
            aria-label="Article content"
          />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600 mr-auto cursor-pointer">
              <input
                type="checkbox" checked={editing.published}
                onChange={(e) => setEditing((s) => s && { ...s, published: e.target.checked })}
                className="rounded"
              />
              Published (visible to chatbot)
            </label>
            <button onClick={() => setEditing(null)} className="text-sm text-slate-500 hover:text-slate-800 px-3 py-2 cursor-pointer">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!editing.title.trim() || !editing.content.trim()}
              className="rounded-lg bg-navy-900 hover:bg-navy-800 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 transition-colors cursor-pointer"
            >
              Save article
            </button>
          </div>
        </Card>
      )}

      <Card>
        {articles.length === 0 ? (
          <EmptyState
            title="No articles yet"
            body="Add FAQs, service info and policies — the chatbot will use them to answer customers."
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {articles.map((a) => (
              <div key={a.id} className="px-6 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-royal-600 bg-royal-600/10 rounded-full px-2 py-0.5">
                      {a.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.content}</p>
                </div>
                <button
                  onClick={() => saveKB({ ...a, published: !a.published })}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label={a.published ? 'Unpublish' : 'Publish'}
                  title={a.published ? 'Published — click to unpublish' : 'Unpublished — click to publish'}
                >
                  {a.published ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setEditing({ ...a })}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    await deleteKB(a.id)
                    toast({ title: 'Article deleted', tone: 'info' })
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
