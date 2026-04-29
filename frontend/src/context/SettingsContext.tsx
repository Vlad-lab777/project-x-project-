import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Profile {
  name: string
  email: string
  initials: string
}

interface Dashboard {
  widgetOrder: string[]
  visibleWidgets: string[]
  chartRange: string
}

interface Settings {
  theme: string
  profile: Profile
  dashboard: Dashboard
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void
  updateProfile: (patch: Partial<Profile>) => void
  updateDashboard: (patch: Partial<Dashboard>) => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

const WIDGET_IDS = ['stats', 'revenueChart', 'topProducts', 'ordersTable', 'activityFeed']

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  profile: {
    name: 'Admin',
    email: 'admin@projectx.io',
    initials: 'AD',
  },
  dashboard: {
    widgetOrder: WIDGET_IDS,
    visibleWidgets: WIDGET_IDS,
    chartRange: 'week',
  },
}

function applyTheme(theme: string) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem('app-settings')
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Settings>
        const merged: Settings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          profile: { ...DEFAULT_SETTINGS.profile, ...parsed.profile },
          dashboard: { ...DEFAULT_SETTINGS.dashboard, ...parsed.dashboard },
        }
        applyTheme(merged.theme)
        return merged
      }
    } catch {
      // ignore malformed localStorage value
    }
    applyTheme('light')
    return DEFAULT_SETTINGS
  })

  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings))
    applyTheme(settings.theme)
  }, [settings])

  const updateSettings = (patch: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...patch }))
  const updateProfile = (patch: Partial<Profile>) =>
    setSettings((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }))
  const updateDashboard = (patch: Partial<Dashboard>) =>
    setSettings((prev) => ({ ...prev, dashboard: { ...prev.dashboard, ...patch } }))

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateProfile, updateDashboard }}>
      {children}
    </SettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
