import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.')
      return
    }

    setSubmitting(true)
    try {
      await login(email, password)
      const redirectTo = location.state?.from ?? '/'
      navigate(redirectTo, { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Log in" subtitle="Welcome back — enter your details to continue.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[12.5px] font-medium text-ink">
            Email
          </label>
          <div className="relative">
            <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="focus-ring w-full rounded-lg border border-border bg-slate py-2.5 pl-9 pr-3 text-[13.5px] text-ink placeholder:text-muted"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-[12.5px] font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="focus-ring w-full rounded-lg border border-border bg-slate py-2.5 pl-9 pr-9 text-[13.5px] text-ink placeholder:text-muted"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="focus-ring absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-vision"
            />
            Remember me
          </label>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-bad-soft px-3 py-2.5 text-[12.5px] text-bad">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="focus-ring w-full rounded-lg bg-vision py-2.5 text-[13.5px] font-medium text-white transition-opacity hover:bg-vision/90 disabled:opacity-60"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-5 text-center text-[12.5px] text-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="focus-ring font-medium text-vision hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
