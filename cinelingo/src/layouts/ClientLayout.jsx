import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import NotificationsDropdown from '../components/common/NotificationsDropdown'
import ProfileDropdown from '../components/common/ProfileDropdown'
import LanguageSelector from '../components/common/LanguageSelector'
import ThemeToggle from '../components/common/ThemeToggle'
import ChatSidebar from '../components/chat/ChatSidebar'
import { useLanguage } from '../context/LanguageContext'
import { cn } from '../utils/helpers'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/units', label: 'Units' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/quizzes', label: 'Quizzes' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

export default function ClientLayout() {
  const [chatOpen, setChatOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <div className="app-shell min-h-screen">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-3 px-4">
          <NavLink to="/dashboard" className="mr-2 flex shrink-0 items-center gap-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-amber">
              <GraduationCap size={18} />
            </div>
            <span className="hidden text-lg font-black tracking-normal text-slate-950 dark:text-white sm:block">
              Cine<span className="text-brand-500 dark:text-brand-300">Lingo</span>
            </span>
          </NavLink>

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto thin-scroll">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => cn('client-nav-link whitespace-nowrap', isActive && 'active')}
              >
                {t(label.toLowerCase(), label)}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <LanguageSelector />
            <ThemeToggle />
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
