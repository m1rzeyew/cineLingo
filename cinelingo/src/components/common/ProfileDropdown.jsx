import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Trophy, Users, LogOut } from 'lucide-react'
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
        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <Avatar name={`${user?.firstName} ${user?.lastName}`} src={user?.avatarUrl} size="sm" />
        <div className="text-left hidden sm:block">
          <p className="text-xs font-semibold text-white leading-none">{user?.firstName}</p>
          <p className="text-[10px] text-white/60 mt-0.5">{levelLabel(user?.englishLevel)}</p>
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-cream-200 z-50 animate-slide-up overflow-hidden">
            
            {/* User info */}
            <div className="px-4 py-3 bg-cream-50 border-b border-cream-100">
              <p className="font-semibold text-dark-900 text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-dark-600 mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-sm">🔥</span>
                <span className="text-xs text-dark-700 font-medium">{user?.streak ?? 7} day streak</span>
              </div>
            </div>

            {/* Links */}
            <div className="py-1">
              <button
                onClick={() => goTo('profile')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-700 hover:bg-cream-50 hover:text-dark-900 transition-colors"
              >
                <User size={15} className="text-dark-500" />
                My Profile
              </button>

              <button
                onClick={() => goTo('stats')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-700 hover:bg-cream-50 hover:text-dark-900 transition-colors"
              >
                <Trophy size={15} className="text-dark-500" />
                My Stats
              </button>

              <button
                onClick={() => goTo('friends')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-700 hover:bg-cream-50 hover:text-dark-900 transition-colors"
              >
                <Users size={15} className="text-dark-500" />
                Friends
              </button>

              <div className="border-t border-cream-100 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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