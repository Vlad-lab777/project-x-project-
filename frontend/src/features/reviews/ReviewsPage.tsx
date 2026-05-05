import { useState } from 'react'
import { motion } from 'framer-motion'
import { EmptyState } from '../../components/ui/EmptyState'
import { useToast } from '../../context/ToastContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { REVIEWS as INITIAL, CLIENTS } from '../../data/mock'
import type { Review } from '../../types'

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < rating ? '#F59E0B' : 'none'} stroke={i < rating ? '#F59E0B' : '#3F3F46'} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
}

const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600', 'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600', 'from-amber-400 to-orange-500', 'from-rose-500 to-pink-600',
]

export function ReviewsPage() {
  const { toast } = useToast()
  const [reviews, setReviews] = useLocalStorage<Review[]>('detail_reviews', INITIAL)
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all')
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [replyOpen, setReplyOpen] = useState<string | null>(null)

  const filtered = ratingFilter === 'all' ? reviews : reviews.filter((r) => r.rating === ratingFilter)
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  function handleReply(id: string) {
    const text = replyText[id]?.trim()
    if (!text) return
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, reply: text } : r))
    setReplyText((p) => ({ ...p, [id]: '' }))
    setReplyOpen(null)
    toast('Відповідь надіслано')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-zinc-100">Відгуки</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{reviews.length} відгуків · середня оцінка {avgRating.toFixed(1)}</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3">
          <Stars rating={Math.round(avgRating)} size={16} />
          <span className="text-xl font-extrabold text-zinc-100">{avgRating.toFixed(1)}</span>
        </div>
      </div>

      {/* Rating filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 5, 4, 3, 2, 1] as (number | 'all')[]).map((r) => (
          <button
            key={r}
            onClick={() => setRatingFilter(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              ratingFilter === r ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {r === 'all' ? 'Всі' : `★ ${r}`}
          </button>
        ))}
      </div>

      {/* Reviews */}
      {sorted.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800/60 p-8">
          <EmptyState icon="⭐" title="Немає відгуків" description="Відгуки клієнтів з'являться тут" />
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((r, i) => {
            const client = CLIENTS.find((c) => c.id === r.clientId)!
            const gradIdx = CLIENTS.findIndex((c) => c.id === r.clientId) % AVATAR_GRADIENTS.length
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-zinc-900 border border-zinc-800/60 p-5 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[gradIdx]} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                    {client.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-zinc-100">{client.name}</p>
                      <p className="text-[11px] text-zinc-600">{formatDate(r.createdAt)}</p>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed pl-12">{r.text}</p>

                {r.reply && (
                  <div className="ml-12 pl-4 border-l-2 border-blue-500/30">
                    <p className="text-xs font-semibold text-blue-400 mb-1">Відповідь студії</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{r.reply}</p>
                  </div>
                )}

                {!r.reply && (
                  <>
                    {replyOpen === r.id ? (
                      <div className="ml-12 flex gap-2">
                        <input
                          type="text"
                          value={replyText[r.id] ?? ''}
                          onChange={(e) => setReplyText((p) => ({ ...p, [r.id]: e.target.value }))}
                          placeholder="Напишіть відповідь..."
                          onKeyDown={(e) => { if (e.key === 'Enter') handleReply(r.id) }}
                          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 outline-none focus:border-blue-500"
                          autoFocus
                        />
                        <button onClick={() => handleReply(r.id)} className="px-3 py-2 text-xs font-medium rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">Надіслати</button>
                        <button onClick={() => setReplyOpen(null)} className="px-3 py-2 text-xs rounded-xl bg-zinc-800 text-zinc-400">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setReplyOpen(r.id)} className="ml-12 text-xs text-zinc-600 hover:text-blue-400 transition-colors">
                        + Відповісти
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
