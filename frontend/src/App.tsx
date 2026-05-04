import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import RevenueChart from './components/RevenueChart'
import OrdersTable from './components/OrdersTable'
import TopProducts from './components/TopProducts'
import ActivityFeed from './components/ActivityFeed'
import SettingsPage from './pages/SettingsPage'
import ProductsPage from './pages/ProductsPage'
import OrderPage from './pages/OrderPage'
import ClientsPage from './pages/ClientsPage'
import LoginPage from './pages/LoginPage'
import { Button, Input } from '@heroui/react'
import { useSettings } from './context/SettingsContext'
import { useI18n } from './i18n/context'

const AUTH_KEY = 'px_auth'

interface AuthUser {
  id: number
  full_name: string
  role: string
  email: string
}

function getStoredUser(): AuthUser | null {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
  } catch {
    return null
  }
}

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalClients: number
  revenueChange: number
  ordersChange: number
}

const CHART_ROW = ['revenueChart', 'topProducts']
const BOTTOM_ROW = ['ordersTable', 'activityFeed']

function DashboardContent() {
  const { settings } = useSettings()
  const { visibleWidgets, widgetOrder } = settings.dashboard
  const [apiStats, setApiStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/stats')
      .then((r) => r.json())
      .then(setApiStats)
      .catch(() => {})
  }, [])

  const isVisible = (id: string) => visibleWidgets.includes(id)

  function orderedVisible(ids: string[]) {
    return widgetOrder.filter((id) => ids.includes(id) && isVisible(id))
  }

  const chartVisible = orderedVisible(CHART_ROW)
  const bottomVisible = orderedVisible(BOTTOM_ROW)

  const statCards = apiStats
    ? [
        {
          labelKey: 'totalRevenue',
          value: `$${apiStats.totalRevenue.toFixed(0)}`,
          change: `${Math.abs(apiStats.revenueChange)}%`,
          trend: (apiStats.revenueChange >= 0 ? 'up' : 'down') as 'up' | 'down',
          icon: '💰',
        },
        {
          labelKey: 'orders',
          value: String(apiStats.totalOrders),
          change: `${Math.abs(apiStats.ordersChange)}%`,
          trend: (apiStats.ordersChange >= 0 ? 'up' : 'down') as 'up' | 'down',
          icon: '📦',
        },
        {
          labelKey: 'activeUsers',
          value: String(apiStats.totalClients),
          change: '—',
          trend: 'up' as 'up' | 'down',
          icon: '👥',
        },
      ]
    : []

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
      {isVisible('stats') && statCards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {statCards.map((stat, i) => (
            <StatCard key={stat.labelKey} {...stat} delay={i * 100} />
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
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')

  if (!user) {
    return (
      <LoginPage
        onLogin={(u) => {
          localStorage.setItem(AUTH_KEY, JSON.stringify(u))
          setUser(u)
        }}
      />
    )
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY)
    setUser(null)
  }

  const isSettings = currentPage === 'settings'
  const isProducts = currentPage === 'products'
  const isOrders = currentPage === 'orders'
  const isClients = currentPage === 'customers'
  const pageTitle = isSettings
    ? t.settings.title
    : isProducts
      ? t.products.list.title
      : isOrders
        ? t.order.title
        : isClients
          ? t.clients.title
          : t.header.title
  const pageSubtitle = isSettings
    ? t.settings.subtitle
    : isProducts
      ? t.products.list.subtitle
      : isOrders
        ? t.order.subtitle
        : isClients
          ? t.clients.subtitle
          : t.header.welcome

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-50 via-violet-50/10 to-zinc-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 font-sans">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <main className="flex-1 overflow-auto min-w-0 ml-14 lg:ml-0">
        <header className="sticky top-0 z-10 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 flex items-center gap-3">
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
            {!isSettings && !isProducts && !isOrders && !isClients && (
              <Button className="bg-violet-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
                {t.header.newOrder}
              </Button>
            )}
            <button
              onClick={handleLogout}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title={user.full_name}
            >
              ↩
            </button>
          </div>
        </header>

        {isSettings ? (
          <SettingsPage />
        ) : isProducts ? (
          <ProductsPage />
        ) : isOrders ? (
          <OrderPage />
        ) : isClients ? (
          <ClientsPage />
        ) : (
          <DashboardContent />
        )}
      </main>
    </div>
  )
}

export default App
