import { motion } from 'framer-motion'
import { CategoryBadge } from '../../components/ui/Badge'
import type { Service } from '../../types'

interface Props {
  service: Service
  onEdit: (s: Service) => void
  onDelete: (id: string) => void
  index: number
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} хв`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}г ${m}хв` : `${h}г`
}

export function ServiceCard({ service, onEdit, onDelete, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className={`relative overflow-hidden rounded-2xl bg-zinc-900 border ${service.active ? 'border-zinc-800/60' : 'border-zinc-800/30 opacity-60'} flex flex-col`}
    >
      {/* Gradient header */}
      <div className={`h-28 bg-gradient-to-br ${service.gradient} flex items-center justify-center relative`}>
        <span className="text-5xl drop-shadow-lg">{service.icon}</span>
        {!service.active && (
          <div className="absolute inset-0 bg-zinc-900/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-zinc-400 bg-zinc-900/80 px-3 py-1 rounded-full">Неактивна</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-100 leading-snug">{service.name}</h3>
          <CategoryBadge category={service.category} />
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed flex-1">{service.description}</p>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {formatDuration(service.duration)}
            </div>
          </div>
          <p className="text-base font-bold text-zinc-100">₴{service.price.toLocaleString()}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(service)}
            className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Редагувати
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
