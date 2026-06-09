import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Film } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [form,   setForm]   = useState({ firstName:'', lastName:'', email:'', password:'', confirm:'' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.firstName)  e.firstName = 'Required'
    if (!form.lastName)   e.lastName  = 'Required'
    if (!form.email)      e.email     = 'Required'
    if (!form.password)   e.password  = 'Required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    const { success } = await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password })
    if (success) navigate('/select-level', { replace: true })
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="text-sm font-medium text-white/70 block mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-dark-800 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white
                   placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/50
                   focus:border-brand-500/50 transition-all"
      />
      {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-10">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
            <Film size={19} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-2xl">
            Cine<span className="text-brand-400">Lingo</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold font-display text-white mb-1">Create your account</h1>
        <p className="text-white/40 text-sm mb-8">Start your cinematic English journey — Beginner is free.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {field('firstName', 'First name', 'text', 'Alex')}
            {field('lastName',  'Last name',  'text', 'Johnson')}
          </div>
          {field('email',    'Email address',    'email',    'you@example.com')}
          {field('password', 'Password',         'password', 'Min 6 characters')}
          {field('confirm',  'Confirm password', 'password', 'Repeat password')}

          <Button type="submit" fullWidth size="lg" loading={loading} variant="brand" className="mt-2 shadow-amber">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
