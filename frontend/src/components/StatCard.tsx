import { useI18n } from '../i18n/context'

interface StatCardProps {
  labelKey: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: string
  delay?: number
}

const themes: Record<string, { gradient: string; glow: string; blob: string }> = {
  totalRevenue: {
    gradient: 'from-violet-500 to-purple-600',
    glow: 'hover:shadow-violet-200/60 dark:hover:shadow-violet-900/40',
    blob: 'bg-violet-400',
  },
  orders: {
    gradient: 'from-sky-500 to-blue-600',
    glow: 'hover:shadow-sky-200/60 dark:hover:shadow-sky-900/40',
    blob: 'bg-sky-400',
  },
  activeUsers: {
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'hover:shadow-emerald-200/60 dark:hover:shadow-emerald-900/40',
    blob: 'bg-emerald-400',
  },
  conversion: {
    gradient: 'from-orange-400 to-amber-500',
    glow: 'hover:shadow-orange-200/60 dark:hover:shadow-orange-900/40',
    blob: 'bg-orange-400',
  },
}

export default function StatCard({ labelKey, value, change, trend, icon, delay = 0 }: StatCardProps) {
  const { t } = useI18n()
  const isUp = trend === 'up'
  const stats = t.stats as Record<string, string>
  const theme = themes[labelKey] ?? themes.totalRevenue

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        bg-white dark:bg-zinc-900
        border border-zinc-100 dark:border-zinc-800
        p-5 cursor-default
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl ${theme.glow}
        animate-fade-up
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* ambient blob */}
      <div
        className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${theme.blob} opacity-10 blur-2xl pointer-events-none`}
      />

      <div className="flex items-start justify-between gap-2 mb-4">
        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest leading-tight">
          {stats[labelKey]}
        </p>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${theme.gradient} shadow-md shrink-0`}
        >
          <span className="text-base">{icon}</span>
        </div>
      </div>

      <p className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-4 tracking-tight">
        {value}
      </p>

      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            isUp
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {change === '—' ? '—' : `${isUp ? '▲' : '▼'} ${change}`}
        </span>
        <span className="text-[11px] text-zinc-400">{t.stats.vsLastMonth}</span>
      </div>
    </div>
  )
}
