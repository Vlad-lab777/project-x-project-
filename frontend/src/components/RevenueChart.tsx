import { Card, CardContent } from '@heroui/react'
import { weeklyRevenue, weekDays } from '../data/mockData'
import { useI18n } from '../i18n/context'

const BAR_MAX_HEIGHT = 112

export default function RevenueChart() {
  const { t } = useI18n()
  const max = Math.max(...weeklyRevenue)

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
          {weeklyRevenue.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${Math.round((val / max) * BAR_MAX_HEIGHT)}px`,
                  background:
                    i === weeklyRevenue.length - 1
                      ? 'linear-gradient(180deg, #7c3aed, #a78bfa)'
                      : 'linear-gradient(180deg, #ddd6fe, #ede9fe)',
                }}
              />
              <span className="text-[10px] text-zinc-400">{weekDays[i]}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-zinc-400">
          <span>{t.revenueChart.total}</span>
          <span className="text-emerald-500 font-medium">{t.revenueChart.growth}</span>
        </div>
      </CardContent>
    </Card>
  )
}
