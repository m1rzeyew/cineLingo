import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Clapperboard, Menu, X } from 'lucide-react'
import Button from '../components/ui/Button'

export default function GuestLayout() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isHome = location.pathname === '/home'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-dark-900/95 backdrop-blur-md border-b border-white/8 shadow-dark'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">

          <NavLink to="/home" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <Clapperboard size={17} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">
              Cine<span className="text-brand-400">Lingo</span>
            </span>
          </NavLink>

          {isHome && (
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="guest-nav-link">Features</a>
              <a href="#levels"   className="guest-nav-link">Levels</a>
              <a href="#about"    className="guest-nav-link">About</a>
            </nav>
          )}

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl transition-colors"
            >
              Get Started →
            </button>
          </div>

          {isHome && (
            <button
              className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        {isHome && mobileOpen && (
          <div className="md:hidden bg-dark-800 border-t border-white/8 px-6 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileOpen(false)} className="block text-white/70 hover:text-white py-2 text-sm">Features</a>
            <a href="#levels"   onClick={() => setMobileOpen(false)} className="block text-white/70 hover:text-white py-2 text-sm">Levels</a>
            <a href="#about"    onClick={() => setMobileOpen(false)} className="block text-white/70 hover:text-white py-2 text-sm">About</a>
            <div className="flex flex-col gap-2 pt-2 border-t border-white/8">
              <button onClick={() => { navigate('/login');    setMobileOpen(false) }} className="w-full text-sm text-white/80 py-2.5 rounded-xl hover:bg-white/10 transition-colors">Sign In</button>
              <button onClick={() => { navigate('/register'); setMobileOpen(false) }} className="w-full text-sm bg-brand-500 text-white py-2.5 rounded-xl hover:bg-brand-600 transition-colors">Get Started →</button>
            </div>
          </div>
        )}
      </header>

      <Outlet />
    </div>
  )
}