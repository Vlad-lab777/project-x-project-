import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'

interface RecentOrder {
  id: number
  full_name: string
  created_at: string
}

const AVATAR_GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-orange-400 to-amber-500',
  'from-pink-500 to-rose-500',
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function getGradient(name: string): string {
  const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length]
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '< 1m'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ActivityFeed() {
  const { t } = useI18n()
  const [orders, setOrders] = useState<RecentOrder[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/orders/recent')
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {})
  }, [])

  return (
    <div
      className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm p-5 animate-fade-up"
      style={{ animationDelay: '350ms' }}
    >
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{t.activityFeed.title}</p>
      <p className="text-xs text-zinc-400 mt-0.5 mb-5">{t.activityFeed.subtitle}</p>

      <div className="flex flex-col gap-0">
        {orders.length === 0 ? (
          <p className="text-xs text-zinc-400 py-4 text-center">—</p>
        ) : (
          orders.map((order, i) => (
            <div
              key={order.id}
              className="flex items-start gap-3 py-3 animate-fade-up"
              style={{ animationDelay: `${350 + i * 70}ms` }}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center
                  bg-gradient-to-br ${getGradient(order.full_name)}
                  text-white text-[11px] font-bold shadow-sm`}
              >
                {getInitials(order.full_name)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug">
                  <span className="font-semibold text-zinc-900 dark:text-white">{order.full_name}</span>{' '}
                  <span className="text-zinc-500">{t.activityActions.placedOrder}</span>
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">{timeAgo(order.created_at)}</p>
              </div>

              {/* Dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
