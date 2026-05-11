import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api, type ApiReview } from '../lib/api'

const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600', 'from-amber-400 to-orange-500', 'from-rose-500 to-pink-600',
]

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i < rating ? '#F59E0B' : 'none'}
          stroke={i < rating ? '#F59E0B' : '#3F3F46'}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState<ApiReview[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<number | 'all'>('all')

  useEffect(() => {
    api.getReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const filtered = filter === 'all' ? sorted : sorted.filter((r) => r.rating === filter)

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({ rating: r, count: reviews.filter((rv) => rv.rating === r).length }))

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Відгуки</p>
          <h1 className="text-4xl font-extrabold text-white mb-8">Що кажуть наші клієнти</h1>

          <div className="flex flex-col sm:flex-row gap-6 bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6">
            <div className="text-center sm:border-r border-zinc-800 sm:pr-8">
              <p className="text-5xl font-extrabold text-white">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</p>
              <Stars rating={Math.round(avgRating)} size={20} />
              <p className="text-sm text-zinc-500 mt-2">{reviews.length} відгуків</p>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 w-3">{rating}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                      style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-600 w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {(['all', 5, 4, 3, 2, 1] as (number | 'all')[]).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === r ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/50'
              }`}
            >
              {r === 'all' ? 'Всі' : `★ ${r}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-1/3" />
                    <div className="h-3 bg-zinc-800 rounded w-1/4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-800 rounded" />
                  <div className="h-3 bg-zinc-800 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                    {r.clientInitials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-white">{r.clientName}</p>
                      <p className="text-xs text-zinc-600">{formatDate(r.createdAt)}</p>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{r.text}</p>
                {r.reply && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-500/40 bg-blue-500/5 rounded-r-xl py-3 pr-3">
                    <p className="text-xs font-semibold text-blue-400 mb-1">Відповідь студії DetailPRO</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{r.reply}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
