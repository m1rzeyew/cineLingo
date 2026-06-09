import { clsx } from 'clsx'

export const cn = (...inputs) => clsx(inputs)

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
  str?.length > n ? str.slice(0, n) + '…' : str

export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

export const scoreColor = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 50) return 'text-brand-500'
  return 'text-red-500'
}

export const levelLabel = (n) => {
  const map = { 1:'Beginner', 2:'Elementary', 3:'Pre-Intermediate', 4:'Intermediate', 5:'Upper-Intermediate', 6:'Advanced' }
  return map[n] || `Level ${n}`
}

export const debounce = (fn, delay = 300) => {
  let t
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay) }
}
