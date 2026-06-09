import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Film } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input  from '../../components/ui/Input'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [form,   setForm]   = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    const result = await login(form)
    if (result.success) {
      if (!result.user?.levelId) navigate('/select-level', { replace: true })
      else navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — cinema panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-dark-800 border-r border-white/8 p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        </div>
        <div className="flex items-center gap-2 relative">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <Film size={17} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-xl">
            Cine<span className="text-brand-400">Lingo</span>
          </span>
        </div>

        <div className="relative">
          <blockquote className="text-3xl font-display text-white leading-snug mb-6">
            "Language is the road map of a culture. It tells you where its people come from and where they are going."
          </blockquote>
          <p className="text-white/40 text-sm">— Rita Mae Brown</p>

          <div className="flex gap-6 mt-10">
            {[['12K+','Learners'],['200+','Units'],['6','Levels']].map(([n,l]) => (
              <div key={l}>
                <p className="text-2xl font-bold text-brand-400 font-display">{n}</p>
                <p className="text-xs text-white/40 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs relative">© {new Date().getFullYear()} CineLingo</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-dark-900">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-10 lg:hidden">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
              <Film size={17} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">
              Cine<span className="text-brand-400">Lingo</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold font-display text-white mb-1">Welcome back</h1>
          <p className="text-white/40 text-sm mb-8">Sign in to continue your learning journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-dark-800 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white
                           placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50
                           focus:border-brand-500/50 transition-all"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-dark-800 border border-white/15 rounded-xl px-4 py-2.5 pr-10 text-sm text-white
                             placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50
                             focus:border-brand-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} variant="brand" className="mt-2 shadow-amber">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
