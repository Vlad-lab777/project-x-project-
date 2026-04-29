import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@heroui/react/styles'
import './index.css'
import App from './App'
import { I18nProvider } from './i18n/index'
import { SettingsProvider } from './context/SettingsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </I18nProvider>
  </StrictMode>
)
