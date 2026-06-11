import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { useLanguage } from '../../context/LanguageContext'

const isAdminUser = (user) => {
  const roles = user?.roles || (user?.role ? [user.role] : [])
  return roles.some(role => String(role).toLowerCase() === 'admin') || String(user?.role).toLowerCase() === 'admin'
}

export default function LoginPage() {
  const { login, loading } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = t('auth.emailOrUsernameRequired')
    if (!form.password) e.password = t('auth.passwordRequired')
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    const result = await login(form)
    if (result.success) {
      if (isAdminUser(result.user)) {
        navigate('/admin', { replace: true })
        return
      }
      const hasLevel = result.user?.englishLevel != null || result.user?.levelId != null || !!result.user?.levelName
      navigate(hasLevel ? '/dashboard' : '/placement', { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-24 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(193,125,60,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(155,115,85,0.16),transparent_32%)]" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-800 lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden bg-gradient-to-br from-brand-500 via-brand-600 to-accent-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600">
              <GraduationCap size={18} />
            </div>
            <span className="text-xl font-black tracking-normal">CineLingo</span>
          </div>
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5">
              <Sparkles size={14} />
              <span className="text-xs font-bold uppercase tracking-normal text-white/80">{t('auth.loginBadge')}</span>
            </div>
            <p className="max-w-md text-3xl font-black leading-tight tracking-normal">
              {t('auth.loginHeroTitle')}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
              {t('auth.loginHeroText')}
            </p>
          </div>
          <p className="text-xs text-white/55">{t('auth.secureSession')}</p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <GraduationCap size={18} />
              </div>
              <span className="text-xl font-black tracking-normal text-slate-950 dark:text-white">Cine<span className="text-brand-500">Lingo</span></span>
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-normal text-slate-950 dark:text-white">{t('auth.loginTitle')}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('auth.loginSubtitle')}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="field-label mb-1.5 block">{t('auth.emailOrUsername')}</label>
              <input
                type="text"
                placeholder={t('auth.emailOrUsernamePlaceholder')}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="field-label mb-1.5 block">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-label={showPw ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.password}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} variant="brand">
              {t('auth.signIn')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {t('auth.newTo')}{' '}
            <Link to="/register" className="font-bold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300">
              {t('auth.createAccount')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
