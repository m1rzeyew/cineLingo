import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { useLanguage } from '../../context/LanguageContext'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.firstName) e.firstName = t('auth.required')
    if (!form.lastName) e.lastName = t('auth.required')
    if (!form.username) e.username = t('auth.required')
    if (!form.email) e.email = t('auth.required')
    if (!form.password) e.password = t('auth.required')
    else if (form.password.length < 6) e.password = t('auth.passwordMin')
    if (form.password !== form.confirm) e.confirm = t('auth.passwordMismatch')
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    const { success } = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      email: form.email,
      password: form.password,
    })
    if (success) navigate('/placement', { replace: true })
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="field-label mb-1.5 block">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      {errors[key] && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-24 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(193,125,60,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(155,115,85,0.16),transparent_32%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800 sm:p-10">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-amber">
            <GraduationCap size={18} />
          </div>
          <span className="text-xl font-black tracking-normal text-slate-950 dark:text-white">
            Cine<span className="text-brand-500">Lingo</span>
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-normal text-slate-950 dark:text-white">{t('auth.registerTitle')}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('auth.registerSubtitle')}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field('firstName', t('auth.firstName'), 'text', 'Alex')}
            {field('lastName', t('auth.lastName'), 'text', 'Johnson')}
          </div>
          {field('username', t('auth.username'), 'text', 'alexjohnson')}
          {field('email', t('auth.email'), 'email', 'you@example.com')}
          {field('password', t('auth.password'), 'password', t('auth.minPassword'))}
          {field('confirm', t('auth.confirmPassword'), 'password', t('auth.repeatPassword'))}

          <Button type="submit" fullWidth size="lg" loading={loading} variant="brand">
            {t('auth.registerButton')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {t('auth.alreadyHave')}{' '}
          <Link to="/login" className="font-bold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}
