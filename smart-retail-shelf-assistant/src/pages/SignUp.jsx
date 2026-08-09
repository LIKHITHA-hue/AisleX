import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { User, Mail, Lock, AlertCircle } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../hooks/useAuth'

export default function SignUp() {
  const { signUp, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !password) {
      setError('Fill in all fields to create your account.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await signUp(name, email, password)
      navigate('/', { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Set up access to your shelf-intelligence dashboard.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[12.5px] font-medium text-ink">
            Full name
          </label>
          <div className="relative">
            <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Lee"
              className="focus-ring w-full rounded-lg border border-border bg-slate py-2.5 pl-9 pr-3 text-[13.5px] text-ink placeholder:text-muted"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-[12.5px] font-medium text-ink">
            Email
          </label>
          <div className="relative">
            <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="signup-email"
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
          <label htmlFor="signup-password" className="mb-1.5 block text-[12.5px] font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="focus-ring w-full rounded-lg border border-border bg-slate py-2.5 pl-9 pr-3 text-[13.5px] text-ink placeholder:text-muted"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1.5 block text-[12.5px] font-medium text-ink">
            Confirm password
          </label>
          <div className="relative">
            <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="focus-ring w-full rounded-lg border border-border bg-slate py-2.5 pl-9 pr-3 text-[13.5px] text-ink placeholder:text-muted"
            />
          </div>
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
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-[12.5px] text-muted">
        Already have an account?{' '}
        <Link to="/login" className="focus-ring font-medium text-vision hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
