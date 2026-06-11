import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, Menu, X } from 'lucide-react'
import ThemeToggle from '../components/common/ThemeToggle'
import LanguageSelector from '../components/common/LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

export default function GuestLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()

  const isHome = location.pathname === '/home'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled || !isHome ? 'border-b border-slate-200 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          <NavLink to="/home" className="flex items-center gap-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-amber">
              <GraduationCap size={18} />
            </div>
            <span className={`text-lg font-black tracking-normal ${scrolled || !isHome ? 'text-slate-950 dark:text-white' : 'text-white'}`}>
              Cine<span className="text-brand-500 dark:text-brand-300">Lingo</span>
            </span>
          </NavLink>

          {isHome && (
            <nav className="hidden items-center gap-1 md:flex">
              <a href="#features" className={scrolled ? 'guest-nav-link' : 'rounded-xl px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white'}>{t('nav.features')}</a>
              <a href="#levels" className={scrolled ? 'guest-nav-link' : 'rounded-xl px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white'}>{t('nav.levels')}</a>
              <a href="#about" className={scrolled ? 'guest-nav-link' : 'rounded-xl px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white'}>{t('nav.about')}</a>
            </nav>
          )}

          <div className="hidden items-center gap-2 md:flex">
            <LanguageSelector tone={scrolled || !isHome ? 'light' : 'hero'} />
            <ThemeToggle />
            <button
              onClick={() => navigate('/login')}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${scrolled || !isHome ? 'text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
            >
              {t('nav.signIn')}
            </button>
            <button
              onClick={() => navigate('/register')}
              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white shadow-amber transition-all hover:-translate-y-0.5 hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {t('nav.getStarted')}
            </button>
          </div>

          {isHome && (
            <button
              className={`rounded-xl p-2 transition-colors md:hidden ${scrolled ? 'text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-slate-800' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={t('nav.toggle')}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        {isHome && mobileOpen && (
          <div className="mx-4 mb-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-dark backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 md:hidden">
            <a href="#features" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-slate-800">{t('nav.features')}</a>
            <a href="#levels" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-slate-800">{t('nav.levels')}</a>
            <a href="#about" onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-slate-800">{t('nav.about')}</a>
            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { navigate('/login'); setMobileOpen(false) }} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-slate-800">{t('nav.signIn')}</button>
                <button onClick={() => { navigate('/register'); setMobileOpen(false) }} className="rounded-xl bg-brand-500 px-3 py-2 text-sm font-bold text-white hover:bg-brand-600">{t('nav.getStarted')}</button>
              </div>
            </div>
          </div>
        )}
      </header>

      <Outlet />
    </div>
  )
}
