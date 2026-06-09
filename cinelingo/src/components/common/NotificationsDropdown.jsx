import { useState } from 'react'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { cn } from '../../utils/helpers'

const MOCK_NOTIFS = [
  { id:'1', message:'🎉 You completed "City Life & Urban Stories"!',     isRead:false, createdAt: new Date(Date.now()-3600000).toISOString() },
  { id:'2', message:'📊 Your quiz score improved by 15% this week.',      isRead:false, createdAt: new Date(Date.now()-86400000).toISOString() },
  { id:'3', message:'🔥 7 day streak! Keep it up!',                       isRead:true,  createdAt: new Date(Date.now()-172800000).toISOString() },
  { id:'4', message:'👥 Kamran A. started following you.',                isRead:true,  createdAt: new Date(Date.now()-259200000).toISOString() },
]

export default function NotificationsDropdown() {
  const [open, setOpen]     = useState(false)
  const [notifs, setNotifs] = useState(MOCK_NOTIFS)

  const unread = notifs.filter(n => !n.isRead).length

  const markAll = () => setNotifs(ns => ns.map(n => ({ ...n, isRead:true })))
  const markOne = (id) => setNotifs(ns => ns.map(n => n.id===id ? { ...n, isRead:true } : n))

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors">
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-cream-200 z-50 animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-cream-100">
              <h3 className="font-semibold text-dark-900 text-sm">Notifications</h3>
              {unread > 0 && (
                <button onClick={markAll} className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 font-medium">
                  <CheckCheck size={13}/> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifs.map((n) => (
                <div key={n.id} className={cn('flex gap-3 px-4 py-3 border-b border-cream-50 last:border-0 hover:bg-cream-50 transition-colors', !n.isRead && 'bg-brand-50/40')}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-900 leading-snug">{n.message}</p>
                  </div>
                  {!n.isRead && (
                    <button onClick={() => markOne(n.id)} className="shrink-0 p-1 rounded-lg hover:bg-cream-200 text-brand-500 transition-colors">
                      <Check size={13}/>
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
