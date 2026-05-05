import { useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Дашборд',
  '/bookings': 'Записи',
  '/services': 'Послуги',
  '/reviews': 'Відгуки',
}

interface LayoutProps { children: ReactNode }

export function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] ?? 'DetailPRO'

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar collapsed={collapsed} />
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 220 }}
      >
        <Topbar onToggleSidebar={() => setCollapsed((c) => !c)} title={title} />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-6 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
