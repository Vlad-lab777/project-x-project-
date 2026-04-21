import { Card, CardContent } from '@heroui/react'
import { useI18n } from '../i18n/context'

export default function StatCard({ labelKey, value, change, trend, icon }) {
  const { t } = useI18n()
  const isUp = trend === 'up'

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest leading-tight">
            {t.stats[labelKey]}
          </p>
          <span className="text-xl shrink-0">{icon}</span>
        </div>

        <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">{value}</p>

        <div className="flex flex-col gap-1">
          <span
            className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full ${
              isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            }`}
          >
            {isUp ? '▲' : '▼'} {change}
          </span>
          <span className="text-[11px] text-zinc-400">{t.stats.vsLastMonth}</span>
        </div>
      </CardContent>
    </Card>
  )
}
