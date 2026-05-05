import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SERVICES } from '../data/mock'
import type { ServiceCategory } from '../types'

const CATEGORY_LABELS: Record<ServiceCategory | 'all', string> = {
  all: 'Всі послуги', wash: 'Мийка', polish: 'Полірування',
  ceramic: 'Кераміка', 'dry-cleaning': 'Хімчистка', detailing: 'Детейлінг',
}

function formatDuration(m: number) {
  const h = Math.floor(m / 60)
  const min = m % 60
  return h ? (min ? `${h}г ${min}хв` : `${h}г`) : `${m}хв`
}

export function ServicesPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<ServiceCategory | 'all'>('all')

  const filtered = category === 'all' ? SERVICES.filter((s) => s.active) : SERVICES.filter((s) => s.category === category && s.active)

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Каталог</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">Наші послуги</h1>
          <p className="text-zinc-400 max-w-xl">
            Весь спектр детейлінгових послуг від базової мийки до преміум керамічного покриття.
            Обирайте те, що підходить саме вам.
          </p>
        </motion.div>
      </div>

      {/* Category filter */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {(Object.entries(CATEGORY_LABELS) as [ServiceCategory | 'all', string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setCategory(val)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                category === val
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:text-white hover:border-zinc-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-zinc-900 border border-zinc-800/60 rounded-2xl overflow-hidden group flex flex-col"
            >
              {/* Gradient header */}
              <div className={`h-32 bg-gradient-to-br ${s.gradient} flex items-center justify-center relative shrink-0`}>
                <span className="text-5xl drop-shadow-xl group-hover:scale-110 transition-transform duration-300">{s.icon}</span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-white mb-1">{s.name}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-1">{s.description}</p>

                <div className="flex items-center gap-3 text-xs text-zinc-600 mb-4">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {formatDuration(s.duration)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <p className="text-lg font-bold text-white">₴{s.price.toLocaleString()}</p>
                  <button
                    onClick={() => navigate('/booking', { state: { serviceId: s.id } })}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow"
                  >
                    Записатись
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
