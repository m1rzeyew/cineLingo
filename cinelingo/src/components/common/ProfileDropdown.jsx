import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, User, Trophy, Users, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import { levelLabel } from '../../utils/helpers'

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/home')
  }

  const goTo = (page) => {
    setOpen(false)
    navigate(`/${page}`)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand-500 dark:hover:bg-slate-700"
      >
        <Avatar name={`${user?.firstName} ${user?.lastName}`} src={user?.avatarUrl} size="sm" />
        <div className="hidden text-left sm:block">
          <p className="text-xs font-bold leading-none text-slate-900 dark:text-slate-100">{user?.firstName || 'Learner'}</p>
          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{levelLabel(user?.englishLevel)}</p>
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-dark dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user?.firstName} {user?.lastName}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <Flame size={13} className="text-warning-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user?.streak ?? 0} day streak</span>
              </div>
            </div>

            <div className="py-1">
              {[
                ['profile', 'My Profile', User],
                ['stats', 'My Stats', Trophy],
                ['friends', 'Friends', Users],
              ].map(([page, label, Icon]) => (
                <button
                  key={page}
                  onClick={() => goTo(page)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
                >
                  <Icon size={15} className="text-slate-400 dark:text-slate-500" />
                  {label}
                </button>
              ))}

              <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
