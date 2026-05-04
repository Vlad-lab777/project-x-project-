import { Card, CardContent } from '@heroui/react'
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
  const growthPct = first === 0 ? (second > 0 ? 100 : 0) : parseFloat(((second - first) / first * 100).toFixed(1))
  const growthUp = growthPct >= 0

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <CardContent className="px-5 pt-5 pb-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {t.revenueChart.title}
            </p>
            <p className="text-xs text-zinc-400">{t.revenueChart.subtitle}</p>
          </div>
          <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2 py-1 rounded-full">
            {t.revenueChart.badge}
          </span>
        </div>
        <div className="flex items-end gap-2" style={{ height: `${BAR_MAX_HEIGHT + 20}px` }}>
          {data.map((point, i) => (
            <div key={point.date} className="flex-1 flex flex-col items-center gap-1 justify-end">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${Math.max(2, Math.round((point.revenue / max) * BAR_MAX_HEIGHT))}px`,
                  background:
                    i === data.length - 1
                      ? 'linear-gradient(180deg, #7c3aed, #a78bfa)'
                      : 'linear-gradient(180deg, #ddd6fe, #ede9fe)',
                }}
              />
              <span className="text-[10px] text-zinc-400">{formatLabel(point.date, range)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-zinc-400">
          <span>Total: ${total.toFixed(0)}</span>
          <span className={`font-medium ${growthUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {growthUp ? '▲' : '▼'} {Math.abs(growthPct)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
