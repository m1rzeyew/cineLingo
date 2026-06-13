import { useEffect, useState } from 'react'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { cn, formatRelative } from '../../utils/helpers'
import { notificationService } from '../../services'
import { useLanguage } from '../../context/LanguageContext'

export default function NotificationsDropdown() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await notificationService.getAll()
      setNotifs(Array.isArray(res.data) ? res.data : [])
    } catch {
      setNotifs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const unread = notifs.filter(n => !n.isRead).length

  const markAll = async () => {
    await notificationService.markAllRead()
    setNotifs(ns => ns.map(n => ({ ...n, isRead: true })))
  }

  const markOne = async (id) => {
    await notificationService.markRead(id)
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(v => !v); if (!open) load() }}
        className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:bg-slate-700 dark:hover:text-white"
        aria-label={t('notifications', 'Notifications')}
      >
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning-500 text-[9px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-[9999] mt-2 w-80 animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('notifications', 'Notifications')}</h3>
              {unread > 0 && (
                <button onClick={markAll} className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200">
                  <CheckCheck size={13} /> {t('markAllRead', 'Mark all read')}
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {loading && <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">{t('loading', 'Loading...')}</p>}
              {!loading && notifs.length === 0 && <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">{t('noNotificationsYet', 'No notifications yet.')}</p>}
              {!loading && notifs.map((n) => (
                <div key={n.id} className={cn('flex gap-3 border-b border-slate-100 px-4 py-3 transition-colors last:border-0 hover:bg-brand-50 dark:border-slate-700 dark:hover:bg-slate-700', !n.isRead && 'bg-brand-50/60 dark:bg-brand-500/10')}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">{n.title}</p>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{n.message}</p>
                    {n.createdAt && <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">{formatRelative(n.createdAt)}</p>}
                  </div>
                  {!n.isRead && (
                    <button onClick={() => markOne(n.id)} className="shrink-0 rounded-lg p-1 text-brand-600 transition-colors hover:bg-brand-100 dark:text-brand-300 dark:hover:bg-brand-500/10">
                      <Check size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
