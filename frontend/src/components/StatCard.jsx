import { Card, CardContent } from '@heroui/react'

export default function StatCard({ label, value, change, trend, icon }) {
  const isUp = trend === 'up'
  return (
    <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="mt-3 flex items-center gap-1">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}
          >
            {isUp ? '▲' : '▼'} {change}
          </span>
          <span className="text-xs text-zinc-400">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}
