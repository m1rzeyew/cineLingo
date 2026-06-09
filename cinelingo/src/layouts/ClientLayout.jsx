import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Clapperboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import NotificationsDropdown from '../components/common/NotificationsDropdown'
import ProfileDropdown       from '../components/common/ProfileDropdown'
import ChatSidebar           from '../components/chat/ChatSidebar'
import { cn }                from '../utils/helpers'

const NAV_LINKS = [
  { to: '/dashboard',  label: 'Dashboard'  },
  { to: '/units',      label: 'Units'      },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/quizzes',    label: 'Quizzes'    },
  { to: '/leaderboard', label: 'Leaderboard' },
]

export default function ClientLayout() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-30 bg-dark-900 shadow-dark">
        <div className="max-w-screen-xl mx-auto flex items-center h-14 px-4 gap-2">
          <NavLink to="/dashboard" className="flex items-center gap-2 mr-3 shrink-0">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <Clapperboard size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg">
              Cine<span className="text-brand-400">Lingo</span>
            </span>
          </NavLink>

          <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn('client-nav-link whitespace-nowrap', isActive && 'active')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 shrink-0">
            <NotificationsDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <main>
        <Outlet context={{ chatOpen, setChatOpen }} />
      </main>

      <ChatSidebar
        roomId="global-lobby"
        isOpen={chatOpen}
        onToggle={() => setChatOpen(v => !v)}
      />
    </div>
  )
}