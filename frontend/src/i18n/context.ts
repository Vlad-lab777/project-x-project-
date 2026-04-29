import { createContext, useContext } from 'react'
import type uk from './locales/uk'

type Translations = typeof uk

interface I18nContextType {
  t: Translations
  locale: string
  setLocale: (locale: string) => void
}

export const I18nContext = createContext<I18nContextType | null>(null)

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
