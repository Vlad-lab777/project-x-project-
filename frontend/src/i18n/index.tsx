import { useState, ReactNode } from 'react'
import { I18nContext } from './context'
import uk from './locales/uk'
import en from './locales/en'

const locales: Record<string, typeof uk> = { uk, en }

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('uk')
  const t = locales[locale]

  return <I18nContext.Provider value={{ t, locale, setLocale }}>{children}</I18nContext.Provider>
}
