import { Link } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Navbar({ title, subtitle, onMenuClick }) {
  const { user } = useAuth()
  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? '?'
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/80 px-5 py-4 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="focus-ring -ml-1 rounded-md p-1.5 text-muted hover:bg-slate lg:hidden"
        >
          <Menu size={19} />
        </button>
        <div>
          <h1 className="font-display text-[17px] font-semibold leading-tight text-ink sm:text-[19px]">
            {title}
          </h1>
          {subtitle && <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="focus-ring relative rounded-lg border border-border p-2 text-muted hover:bg-slate"
        >
          <Bell size={16} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-vision" />
        </button>
        <Link
          to="/profile"
          aria-label="View profile"
          className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-ink font-display text-[12px] font-semibold text-white hover:opacity-90"
        >
          {initial}
        </Link>
      </div>
    </header>
  )
}
