import { useI18n } from '../i18n/context'
import { useSettings } from '../context/SettingsContext'

interface SidebarProps {
  open: boolean
  onToggle: () => void
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ open, onToggle, currentPage, onNavigate }: SidebarProps) {
  const { t } = useI18n()
  const { settings } = useSettings()

  const navItems = [
    { id: 'dashboard', icon: '▣', label: t.nav.dashboard },
    { id: 'analytics', icon: '📊', label: t.nav.analytics },
    { id: 'orders', icon: '📦', label: t.nav.orders },
    { id: 'customers', icon: '👥', label: t.nav.customers },
    { id: 'products', icon: '🛍️', label: t.nav.products },
    { id: 'settings', icon: '⚙️', label: t.nav.settings },
  ]

  return (
    <aside
      className={`
        fixed lg:sticky top-0 left-0 z-30 h-screen flex flex-col
        bg-white dark:bg-zinc-900
        border-r border-zinc-100 dark:border-zinc-800
        transition-all duration-300 ease-in-out
        ${open ? 'w-56' : 'w-14'}
      `}
    >
      {/* Burger */}
      <div className="flex items-center justify-center py-4 border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={onToggle}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect y="2.5" width="16" height="1.8" rx="0.9" fill="currentColor" />
            <rect y="7.1" width="16" height="1.8" rx="0.9" fill="currentColor" />
            <rect y="11.7" width="16" height="1.8" rx="0.9" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-hidden">
        {navItems.map((item) => {
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={!open ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all
                ${open ? '' : 'lg:justify-center'}
                ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 font-semibold dark:bg-violet-950 dark:text-violet-300'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              <span
                className={`text-sm whitespace-nowrap transition-all duration-200 ${
                  open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-2 py-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className={`flex items-center gap-3 ${!open ? 'lg:justify-center' : ''}`}>
          <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {settings.profile.initials}
          </div>
          <div
            className={`min-w-0 transition-all duration-200 ${
              open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}
          >
            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
              {settings.profile.name}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">{settings.profile.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
