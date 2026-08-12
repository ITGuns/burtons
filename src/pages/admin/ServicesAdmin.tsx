import { SERVICES } from '../../data/services'
import { Card } from './adminUi'

/** Read-only view of website services; editable via src/data/services.ts or Supabase. */
export default function ServicesAdmin() {
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Services</h2>
        <p className="text-sm text-slate-500 mt-1">
          The services shown on the public website. Edit{' '}
          <code className="text-xs bg-slate-100 rounded px-1.5 py-0.5">src/data/services.ts</code>{' '}
          (or connect Supabase for live editing).
        </p>
      </div>
      <Card>
        <div className="divide-y divide-slate-50">
          {SERVICES.map((s, i) => (
            <div key={s.slug} className="px-6 py-4 flex items-start gap-4">
              <span className="font-display text-xs text-slate-300 font-bold mt-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.short}</p>
                <p className="text-[11px] text-slate-400 mt-1">/services/{s.slug}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
