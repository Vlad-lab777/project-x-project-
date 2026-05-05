import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StatCard } from './StatCard'
import { CardSkeleton } from '../../components/ui/Skeleton'
import { BOOKINGS, CLIENTS, REVIEWS, CLIENTS as C, SERVICES } from '../../data/mock'

const totalRevenue = BOOKINGS.filter((b) => b.status === 'completed').reduce((s, b) => s + b.price, 0)
const activeBookings = BOOKINGS.filter((b) => ['confirmed', 'in-progress'].includes(b.status)).length
const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="12" height="12"
          viewBox="0 0 24 24"
          fill={i < rating ? '#F59E0B' : 'none'}
          stroke={i < rating ? '#F59E0B' : '#52525B'}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const recentBookings = [...BOOKINGS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Виторг" value={`₴${totalRevenue.toLocaleString()}`} sub="за весь час" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          } gradient="from-emerald-500 to-teal-600" delay={0} />

          <StatCard label="Клієнти" value={C.length} sub="зареєстровано" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          } gradient="from-blue-500 to-indigo-600" delay={0.05} />

          <StatCard label="Активних записів" value={activeBookings} sub="підтверджених + в роботі" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          } gradient="from-amber-400 to-orange-500" delay={0.1} />

          <StatCard label="Середня оцінка" value={`★ ${avgRating}`} sub={`${REVIEWS.length} відгуків`} icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          } gradient="from-violet-500 to-purple-600" delay={0.15} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800/60 p-5"
        >
          <p className="text-sm font-semibold text-zinc-100 mb-4">Останні записи</p>
          <div className="space-y-2">
            {recentBookings.map((b) => {
              const client = CLIENTS.find((c) => c.id === b.clientId)!
              const service = SERVICES.find((s) => s.id === b.serviceId)!
              const statusColor: Record<string, string> = {
                pending: 'text-amber-400', confirmed: 'text-blue-400',
                'in-progress': 'text-violet-400', completed: 'text-emerald-400', cancelled: 'text-zinc-500',
              }
              const statusLabel: Record<string, string> = {
                pending: 'Очікує', confirmed: 'Підтверджено', 'in-progress': 'В роботі',
                completed: 'Завершено', cancelled: 'Скасовано',
              }
              return (
                <div key={b.id} className="flex items-center gap-3 py-2.5 border-b border-zinc-800/40 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center text-[11px] font-bold text-zinc-300 shrink-0">
                    {client.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 font-medium truncate">{client.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{service.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-zinc-300">₴{b.price.toLocaleString()}</p>
                    <p className={`text-[11px] font-medium ${statusColor[b.status]}`}>{statusLabel[b.status]}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-zinc-900 border border-zinc-800/60 p-5"
        >
          <p className="text-sm font-semibold text-zinc-100 mb-4">Останні відгуки</p>
          <div className="space-y-4">
            {REVIEWS.slice(0, 4).map((r) => {
              const client = C.find((c) => c.id === r.clientId)!
              return (
                <div key={r.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-zinc-300">{client.name}</p>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{r.text}</p>
                  <p className="text-[10px] text-zinc-700">{formatDate(r.createdAt)}</p>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
