import { clsx } from 'clsx'
import toast from 'react-hot-toast'

export const cn = (...inputs) => clsx(inputs)

export function getApiErrorMessage(error, fallback = 'Something went wrong.') {
  const data = error?.response?.data ?? error

  if (!data) return fallback
  if (typeof data === 'string') return data
  if (data.message) return data.message
  if (data.error?.message) return data.error.message
  if (error?.message) return error.message

  if (data.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat().filter(Boolean)
    if (messages.length) return messages.join(' ')
  }

  if (data.title) return data.title

  return fallback
}

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })

export const formatRelative = (date) => {
  const diff = Date.now() - new Date(date).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return formatDate(date)
}

export const truncate = (str, n = 80) =>
  str?.length > n ? str.slice(0, n) + '...' : str

export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

export const scoreColor = (score) => {
  if (score >= 80) return 'text-brand-600'
  if (score >= 50) return 'text-brand-500'
  return 'text-red-500'
}

export const levelLabel = (n) => {
  const lang = (() => {
    try {
      return localStorage.getItem('i18nextLng') || localStorage.getItem('cinelingo_language') || 'en'
    } catch {
      return 'en'
    }
  })()

  const map = {
    en: { 0: 'Beginner', 1: 'Intermediate', 2: 'Advanced', selected: 'Not selected' },
    az: { 0: 'Başlanğıc', 1: 'Orta', 2: 'İrəli', selected: 'Seçilməyib' },
    ru: { 0: 'Начальный', 1: 'Средний', 2: 'Продвинутый', selected: 'Не выбрано' },
  }
  if (typeof n === 'string') {
    const numeric = Number(n)
    if (n.trim() !== '' && Number.isInteger(numeric) && map[lang]?.[numeric]) return map[lang][numeric]
    return n
  }
  return map[lang]?.[n] || map[lang]?.selected || 'Not selected'
}

const toastCache = new Map()

export const showApiErrorOnce = (error, fallback = 'Something went wrong.') => {
  const message = getApiErrorMessage(error, fallback)
  const now = Date.now()
  const lastShown = toastCache.get(message) || 0
  if (now - lastShown > 1200) {
    toast.error(message)
    toastCache.set(message, now)
  }
  return message
}

export const debounce = (fn, delay = 300) => {
  let t
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay) }
}
