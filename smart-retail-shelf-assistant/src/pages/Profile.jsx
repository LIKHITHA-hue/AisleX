import { useNavigate } from 'react-router-dom'
import { LogOut, Mail, UserRound, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  if (!user) return null
  const initial = user.name.trim().charAt(0).toUpperCase()

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-display text-[20px] font-semibold text-white">
            {initial}
          </div>
          <div>
            <p className="font-display text-[17px] font-semibold text-ink">{user.name}</p>
            <p className="text-[13px] text-muted">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-border border-t border-border">
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-2.5 text-[13px] text-ink">
              <UserRound size={15} className="text-muted" />
              Full name
            </div>
            <span className="text-[13px] text-muted">{user.name}</span>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-2.5 text-[13px] text-ink">
              <Mail size={15} className="text-muted" />
              Email
            </div>
            <span className="text-[13px] text-muted">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-2.5 text-[13px] text-ink">
              <ShieldCheck size={15} className="text-muted" />
              Account type
            </div>
            <span className="text-[13px] text-muted">Demo account</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="focus-ring mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13px] font-medium text-bad hover:bg-bad-soft"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </div>
  )
}
