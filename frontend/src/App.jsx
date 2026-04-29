import { useState } from 'react'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import RevenueChart from './components/RevenueChart'
import OrdersTable from './components/OrdersTable'
import TopProducts from './components/TopProducts'
import ActivityFeed from './components/ActivityFeed'
import SettingsPage from './pages/SettingsPage'
import ProductsPage from './pages/ProductsPage'
import OrderPage from './pages/OrderPage'
import { stats } from './data/mockData'
import { Button, Input } from '@heroui/react'
import { useSettings } from './context/SettingsContext'
import { useI18n } from './i18n/context'

const CHART_ROW = ['revenueChart', 'topProducts']
const BOTTOM_ROW = ['ordersTable', 'activityFeed']

function DashboardContent() {
  const { settings } = useSettings()
  const { visibleWidgets, widgetOrder } = settings.dashboard

  const isVisible = (id) => visibleWidgets.includes(id)

  function orderedVisible(ids) {
    return widgetOrder.filter((id) => ids.includes(id) && isVisible(id))
  }

  const chartVisible = orderedVisible(CHART_ROW)
  const bottomVisible = orderedVisible(BOTTOM_ROW)

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
      {isVisible('stats') && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.labelKey} {...stat} />
          ))}
        </div>
      )}

      {chartVisible.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {chartVisible[0] === 'revenueChart' ? (
            <>
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              {chartVisible.includes('topProducts') && <TopProducts />}
            </>
          ) : (
            <>
              <TopProducts />
              {chartVisible.includes('revenueChart') && (
                <div className="lg:col-span-2">
                  <RevenueChart />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {bottomVisible.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {bottomVisible[0] === 'ordersTable' ? (
            <>
              <div className="lg:col-span-2">
                <OrdersTable />
              </div>
              {bottomVisible.includes('activityFeed') && <ActivityFeed />}
            </>
          ) : (
            <>
              <ActivityFeed />
              {bottomVisible.includes('ordersTable') && (
                <div className="lg:col-span-2">
                  <OrdersTable />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function App() {
  const { t, locale, setLocale } = useI18n()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')

  const isSettings = currentPage === 'settings'
  const isProducts = currentPage === 'products'
  const isOrders = currentPage === 'orders'
  const pageTitle = isSettings
    ? t.settings.title
    : isProducts
      ? t.products.list.title
      : isOrders
        ? t.order.title
        : t.header.title
  const pageSubtitle = isSettings
    ? t.settings.subtitle
    : isProducts
      ? t.products.list.subtitle
      : isOrders
        ? t.order.subtitle
        : t.header.welcome

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <main className="flex-1 overflow-auto min-w-0 ml-14 lg:ml-0">
        <header className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
              {pageTitle}
            </h1>
            <p className="text-xs text-zinc-400 hidden sm:block">{pageSubtitle}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Input
              placeholder={t.header.search}
              aria-label={t.header.search}
              className="hidden sm:block w-36 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-xs outline-none"
            />
            <button
              onClick={() => setLocale(locale === 'uk' ? 'en' : 'uk')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {locale === 'uk' ? 'EN' : 'УК'}
            </button>
            {!isSettings && !isProducts && !isOrders && (
              <Button className="bg-violet-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
                {t.header.newOrder}
              </Button>
            )}
          </div>
        </header>

        {isSettings ? (
          <SettingsPage />
        ) : isProducts ? (
          <ProductsPage />
        ) : isOrders ? (
          <OrderPage />
        ) : (
          <DashboardContent />
        )}
      </main>
    </div>
  )
}

export default App
