import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext(null)

const WIDGET_IDS = ['stats', 'revenueChart', 'topProducts', 'ordersTable', 'activityFeed']

const DEFAULT_SETTINGS = {
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

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('app-settings')
      if (stored) {
        const parsed = JSON.parse(stored)
        const merged = {
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

  const updateSettings = (patch) => setSettings((prev) => ({ ...prev, ...patch }))
  const updateProfile = (patch) =>
    setSettings((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }))
  const updateDashboard = (patch) =>
    setSettings((prev) => ({ ...prev, dashboard: { ...prev.dashboard, ...patch } }))

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateProfile, updateDashboard }}>
      {children}
    </SettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
