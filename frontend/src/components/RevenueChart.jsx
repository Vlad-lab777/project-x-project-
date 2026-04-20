import { Card, CardContent, CardHeader } from '@heroui/react'
import { weeklyRevenue, weekDays } from '../data/mockData'

export default function RevenueChart() {
  const max = Math.max(...weeklyRevenue)

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <CardHeader className="px-5 pt-5 pb-0 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Weekly Revenue</p>
          <p className="text-xs text-zinc-400">Last 7 days</p>
        </div>
        <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2 py-1 rounded-full">
          This week
        </span>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex items-end gap-2 h-32 mt-4">
          {weeklyRevenue.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${(val / max) * 100}%`,
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
          <span>Total: $48,295</span>
          <span className="text-emerald-500 font-medium">▲ 12.5% from last week</span>
        </div>
      </CardContent>
    </Card>
  )
}
