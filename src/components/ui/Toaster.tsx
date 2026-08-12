import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useStore } from '../../store/useStore'

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-brand-red-500" />,
  info: <Info className="w-5 h-5 text-electric-400" />,
}

export default function Toaster() {
  const { toasts, dismissToast } = useStore()
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-[calc(100vw-2rem)] max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="glass rounded-xl px-4 py-3 flex items-start gap-3 shadow-2xl pointer-events-auto bg-navy-800/90"
            role="status"
          >
            {icons[t.tone]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{t.title}</p>
              {t.body && <p className="text-xs text-white/60 mt-0.5">{t.body}</p>}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
