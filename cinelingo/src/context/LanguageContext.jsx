import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'cinelingo_language'
const COOKIE_KEY = 'cinelingo_language'
const DEFAULT_LANGUAGE = 'en'

const readCookie = (name) => {
  if (typeof document === 'undefined') return null
  return document.cookie.split('; ').reduce((acc, item) => {
    const [key, ...rest] = item.split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
    return acc
  }, null)
}

const writeCookie = (name, value) => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored || readCookie(COOKIE_KEY) || DEFAULT_LANGUAGE
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
    writeCookie(COOKIE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      if (translations[event.newValue]) setLanguageState(event.newValue)
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setLanguage = (nextLanguage) => {
    if (translations[nextLanguage]) setLanguageState(nextLanguage)
  }

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key) => translations[language]?.[key] || translations[DEFAULT_LANGUAGE][key] || key,
  }), [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
