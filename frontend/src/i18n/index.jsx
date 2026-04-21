import { useState } from 'react'
import { I18nContext } from './context'
import uk from './locales/uk'
import en from './locales/en'

const locales = { uk, en }

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('uk')
  const t = locales[locale]

  return <I18nContext.Provider value={{ t, locale, setLocale }}>{children}</I18nContext.Provider>
}
