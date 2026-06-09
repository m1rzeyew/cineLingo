import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Clapperboard, LayoutDashboard, Users, BookOpen,
  GraduationCap, HelpCircle, BarChart2, LogOut,
  ChevronLeft, ChevronRight, Menu, Bell,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import { cn } from '../utils/helpers'

const LINKS = [
  { to: '/admin',                label: 'Dashboard',     icon: LayoutDashboard, end: true },
  { to: '/admin/users',          label: 'Users',         icon: Users },
  { to: '/admin/levels',         label: 'Levels',        icon: GraduationCap },
  { to: '/admin/units',          label: 'Units',         icon: BookOpen },
  { to: '/admin/quizzes',        label: 'Quizzes',       icon: HelpCircle },
  { to: '/admin/analytics',      label: 'Analytics',     icon: BarChart2 },
  { to: '/admin/notifications',  label: 'Notifications', icon: Bell },
]

function SidebarContent({ collapsed, onLogout }) {
  const { user } = useAuth()

  return (
    <div className="flex flex-col h-full bg-white border-r border-cream-200">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-2.5 border-b border-cream-200 shrink-0',
        collapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4',
      )}>
        <div className="w-8 h-8 bg-dark-900 rounded-xl flex items-center justify-center shrink-0">
          <Clapperboard size={16} className="text-brand-400" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display font-bold text-dark-900 text-base leading-none">
              Cine<span className="text-brand-500">Lingo</span>
            </p>
            <p className="text-[10px] font-medium text-dark-400 mt-0.5 tracking-widest uppercase">Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto thin-scroll">
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
            {!collapsed && <span className="flex-1">{label}</span>}
            {!collapsed && <ChevronRight size={13} className="opacity-25" />}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-cream-200 px-2 py-3 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 mb-2">
            <Avatar name={`${user?.firstName} ${user?.lastName}`} src={user?.avatarUrl} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-dark-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-dark-400 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          title={collapsed ? 'Log Out' : undefined}
          className={cn(
            'admin-nav-link w-full text-red-500 hover:bg-red-50 hover:text-red-600',
            collapsed && 'justify-center px-2',
          )}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-cream-100 overflow-hidden">

      {/* ── Desktop sidebar ───────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden lg:block relative shrink-0 transition-all duration-300',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        <div className="h-full">
          <SidebarContent collapsed={collapsed} onLogout={handleLogout} />
        </div>

        <button
          onClick={() => setCollapsed(v => !v)}
          className={cn(
            'absolute top-16 -right-3 z-10',
            'w-6 h-6 bg-white border border-cream-300 rounded-full',
            'flex items-center justify-center shadow-sm',
            'hover:bg-cream-50 transition-colors',
          )}
        >
          {collapsed
            ? <ChevronRight size={11} className="text-dark-600" />
            : <ChevronLeft  size={11} className="text-dark-600" />
          }
        </button>
      </aside>

      {/* ── Mobile sidebar overlay ────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-dark-900/50" />
          <div
            className="relative w-60 animate-slide-left"
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent collapsed={false} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-cream-200 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-cream-100 text-dark-700 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-dark-900 rounded-lg flex items-center justify-center">
              <Clapperboard size={14} className="text-brand-400" />
            </div>
            <span className="font-display font-bold text-dark-900">
              Cine<span className="text-brand-500">Lingo</span>
              <span className="text-xs font-body font-medium text-dark-400 ml-1.5">Admin</span>
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto thin-scroll">
          <div className="p-6 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}