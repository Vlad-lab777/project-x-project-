import type { ReactElement } from 'react'
import { useI18n } from '../i18n/context'
import { useSettings } from '../context/SettingsContext'

interface SidebarProps {
  open: boolean
  onToggle: () => void
  currentPage: string
  onNavigate: (page: string) => void
}

const NavIcons: Record<string, ReactElement> = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  orders: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  customers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  products: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
}

export default function Sidebar({ open, onToggle, currentPage, onNavigate }: SidebarProps) {
  const { t } = useI18n()
  const { settings } = useSettings()

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard },
    { id: 'analytics', label: t.nav.analytics },
    { id: 'orders', label: t.nav.orders },
    { id: 'customers', label: t.nav.customers },
    { id: 'products', label: t.nav.products },
    { id: 'settings', label: t.nav.settings },
  ]

  return (
    <aside
      className={`
        fixed lg:sticky top-0 left-0 z-30 h-screen flex flex-col
        bg-white dark:bg-zinc-900
        border-r border-zinc-100 dark:border-zinc-800
        shadow-sm
        transition-all duration-300 ease-in-out
        ${open ? 'w-56' : 'w-14'}
      `}
    >
      {/* Burger */}
      <div className="flex items-center justify-center py-4 border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={onToggle}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-all duration-200"
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
        {navItems.map((item, i) => {
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={!open ? item.label : undefined}
              className={`
                group/btn relative w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl
                transition-all duration-200
                animate-fade-up
                ${open ? '' : 'lg:justify-center'}
                ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 font-semibold'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                }
              `}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="shrink-0">{NavIcons[item.id]}</span>
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
          <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-violet-500/30">
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
