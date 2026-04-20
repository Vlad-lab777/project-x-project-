import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import RevenueChart from './components/RevenueChart'
import OrdersTable from './components/OrdersTable'
import TopProducts from './components/TopProducts'
import ActivityFeed from './components/ActivityFeed'
import { stats } from './data/mockData'
import { Button, Input } from '@heroui/react'

function App() {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-100 dark:border-zinc-800 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-zinc-900 dark:text-white">Dashboard</h1>
            <p className="text-xs text-zinc-400">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="🔍 Search..."
              className="w-44 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs outline-none"
            />
            <Button className="bg-violet-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
              + New Order
            </Button>
          </div>
        </header>

        <div className="px-6 py-6 flex flex-col gap-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
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
