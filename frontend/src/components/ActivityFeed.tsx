import { Card, CardContent, CardHeader, Avatar, AvatarFallback } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'

interface RecentOrder {
  id: number
  full_name: string
  created_at: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '< 1m'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
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
    <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <CardHeader className="px-5 pt-5 pb-0">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {t.activityFeed.title}
          </p>
          <p className="text-xs text-zinc-400">{t.activityFeed.subtitle}</p>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex flex-col gap-3">
        {orders.length === 0 ? (
          <p className="text-xs text-zinc-400 py-4 text-center">—</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="flex items-start gap-3">
              <Avatar
                aria-label={order.full_name}
                className="bg-violet-100 text-violet-700 text-xs font-bold shrink-0 w-8 h-8"
              >
                <AvatarFallback>{getInitials(order.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold">{order.full_name}</span>{' '}
                  {t.activityActions.placedOrder}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{timeAgo(order.created_at)}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
