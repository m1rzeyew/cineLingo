import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart2, Bell, BookOpen, ChevronLeft, ChevronRight, FileQuestion, Film,
  GraduationCap, Languages, LayoutDashboard, LogOut, Menu, Users,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import ThemeToggle from '../components/common/ThemeToggle'
import NotificationsDropdown from '../components/common/NotificationsDropdown'
import LanguageSelector from '../components/common/LanguageSelector'
import { cn } from '../utils/helpers'
import { useLanguage } from '../context/LanguageContext'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/units', label: 'Units', icon: BookOpen },
  { to: '/admin/videos', label: 'Videos', icon: Film },
  { to: '/admin/words', label: 'Words', icon: Languages },
  { to: '/admin/quizzes', label: 'Quizzes', icon: FileQuestion },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
]

function SidebarContent({ collapsed, onLogout }) {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className={cn(
        'flex shrink-0 items-center gap-2.5 border-b border-slate-200 dark:border-slate-800',
        collapsed ? 'justify-center px-3 py-4' : 'px-5 py-4',
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-amber">
          <GraduationCap size={18} />
        </div>
        {!collapsed && (
          <div>
            <p className="text-base font-black leading-none text-slate-950 dark:text-white">
              Cine<span className="text-brand-500 dark:text-brand-300">Lingo</span>
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-normal text-slate-400 dark:text-slate-500">{t('admin.label', 'Admin')}</p>
          </div>
        )}
      </div>

      <nav className="thin-scroll flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn('admin-nav-link', isActive && 'active', collapsed && 'justify-center px-2')
            }
          >
            <Icon size={17} className="shrink-0" />
            {!collapsed && <span className="flex-1">{t(label.toLowerCase(), label)}</span>}
            {!collapsed && <ChevronRight size={13} className="opacity-35" />}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-slate-200 px-2 py-3 dark:border-slate-800">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-3 px-2">
            <Avatar name={`${user?.firstName} ${user?.lastName}`} src={user?.avatarUrl} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          title={collapsed ? t('logout', 'Log Out') : undefined}
          className={cn(
            'admin-nav-link w-full text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-300 dark:hover:bg-red-500/10 dark:hover:text-red-200',
            collapsed && 'justify-center px-2',
          )}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>{t('logout', 'Log Out')}</span>}
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell flex h-screen overflow-hidden">
      <aside
        className={cn(
          'relative hidden shrink-0 transition-all duration-300 lg:block',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="h-full">
          <SidebarContent collapsed={collapsed} onLogout={handleLogout} />
        </div>

        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-16 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-slate-950/50" />
          <div
            className="relative w-64 animate-slide-left"
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent collapsed={false} onLogout={handleLogout} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-50 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
              <GraduationCap size={16} />
            </div>
            <span className="font-black text-slate-950 dark:text-white">
              Cine<span className="text-brand-500 dark:text-brand-300">Lingo</span>
              <span className="ml-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">{t('admin.label', 'Admin')}</span>
            </span>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-normal text-brand-600 dark:text-brand-300">{t('admin.label', 'Admin')}</p>
            <h1 className="text-lg font-black tracking-normal text-slate-950 dark:text-white">{t('admin.controlCenter', 'Platform Control Center')}</h1>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <LanguageSelector />
            <NotificationsDropdown />
            <ThemeToggle />
          </div>
        </header>

        <main className="thin-scroll flex-1 overflow-y-auto">
          <div className="mx-auto max-w-screen-2xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
