import { useState } from 'react'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import RevenueChart from './components/RevenueChart'
import OrdersTable from './components/OrdersTable'
import TopProducts from './components/TopProducts'
import ActivityFeed from './components/ActivityFeed'
import { stats } from './data/mockData'
import { Button, Input } from '@heroui/react'
import { useI18n } from './i18n/context'

function App() {
  const { t, locale, setLocale } = useI18n()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="flex-1 overflow-auto min-w-0 ml-14 lg:ml-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
              {t.header.title}
            </h1>
            <p className="text-xs text-zinc-400 hidden sm:block">{t.header.welcome}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Input
              placeholder={t.header.search}
              className="hidden sm:block w-36 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs outline-none"
            />
            <button
              onClick={() => setLocale(locale === 'uk' ? 'en' : 'uk')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {locale === 'uk' ? 'EN' : 'УК'}
            </button>
            <Button className="bg-violet-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
              {t.header.newOrder}
            </Button>
          </div>
        </header>

        <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.labelKey} {...stat} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <TopProducts />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <OrdersTable />
            </div>
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
