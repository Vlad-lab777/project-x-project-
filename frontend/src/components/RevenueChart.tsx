import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'
import { useSettings } from '../context/SettingsContext'

const BAR_MAX_HEIGHT = 112

interface RevenuePoint {
  date: string
  revenue: number
}

function formatLabel(dateStr: string, range: string): string {
  const d = new Date(dateStr)
  if (range === 'year') return d.toLocaleString('default', { month: 'short' })
  if (range === 'month') return String(d.getDate())
  return d.toLocaleString('default', { weekday: 'short' })
}

const BAR_COLORS = [
  'linear-gradient(180deg, #a78bfa, #c4b5fd)',
  'linear-gradient(180deg, #818cf8, #a5b4fc)',
  'linear-gradient(180deg, #60a5fa, #93c5fd)',
  'linear-gradient(180deg, #34d399, #6ee7b7)',
  'linear-gradient(180deg, #a78bfa, #c4b5fd)',
  'linear-gradient(180deg, #f472b6, #f9a8d4)',
]

export default function RevenueChart() {
  const { t } = useI18n()
  const { settings } = useSettings()
  const range = settings.dashboard.chartRange || 'week'
  const [data, setData] = useState<RevenuePoint[]>([])

  useEffect(() => {
    fetch(`http://localhost:3000/api/stats/revenue?range=${range}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [range])

  const values = data.map((d) => d.revenue)
  const max = Math.max(...values, 1)
  const total = values.reduce((a, b) => a + b, 0)

  const half = Math.floor(values.length / 2)
  const first = values.slice(0, half).reduce((a, b) => a + b, 0)
  const second = values.slice(half).reduce((a, b) => a + b, 0)
  const growthPct =
    first === 0 ? (second > 0 ? 100 : 0) : parseFloat(((second - first) / first * 100).toFixed(1))
  const growthUp = growthPct >= 0

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm p-5 animate-fade-up" style={{ animationDelay: '200ms' }}>
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {t.revenueChart.title}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">{t.revenueChart.subtitle}</p>
        </div>
        <span className="text-xs bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold px-3 py-1 rounded-full shadow-sm shadow-violet-400/30">
          {t.revenueChart.badge}
        </span>
      </div>

      {/* Chart */}
      <div
        className="flex items-end gap-1.5 px-1"
        style={{ height: `${BAR_MAX_HEIGHT + 20}px` }}
      >
        {data.map((point, i) => {
          const isLast = i === data.length - 1
          const h = Math.max(3, Math.round((point.revenue / max) * BAR_MAX_HEIGHT))
          return (
            <div key={point.date} className="flex-1 flex flex-col items-center gap-1 justify-end group/bar">
              <div
                className="w-full rounded-t-lg origin-bottom"
                style={{
                  height: `${h}px`,
                  background: isLast
                    ? 'linear-gradient(180deg, #7c3aed, #6d28d9)'
                    : BAR_COLORS[i % BAR_COLORS.length],
                  animation: 'growBar 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
                  animationDelay: `${i * 55}ms`,
                  boxShadow: isLast ? '0 4px 14px rgba(124,58,237,0.35)' : undefined,
                }}
              />
              <span className={`text-[10px] transition-colors ${isLast ? 'text-violet-500 font-semibold' : 'text-zinc-400'}`}>
                {formatLabel(point.date, range)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <div>
          <p className="text-[11px] text-zinc-400 uppercase tracking-widest">Total</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-white">${total.toFixed(0)}</p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            growthUp
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {growthUp ? '▲' : '▼'} {Math.abs(growthPct)}%
        </span>
      </div>
    </div>
  )
}
