import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  ScanLine,
  Tags,
  MessageCircleMore,
  History,
  Settings,
  Aperture,
  X,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const navGroups = [
  {
    label: null,
    items: [{ to: '/', label: 'Dashboard', icon: LayoutGrid, accent: 'plain' }],
  },
  {
    label: 'Computer Vision',
    accent: 'vision',
    items: [
      { to: '/shelf-analysis', label: 'Shelf Analysis', icon: ScanLine, accent: 'vision' },
      { to: '/product-classification', label: 'Product Classification', icon: Tags, accent: 'vision' },
    ],
  },
  {
    label: 'AisleX AI',
    accent: 'assist',
    items: [{ to: '/assistant', label: 'AI Shopping Assistant', icon: MessageCircleMore, accent: 'assist' }],
  },
  {
    label: null,
    items: [
      { to: '/history', label: 'History', icon: History, accent: 'plain' },
      { to: '/settings', label: 'Settings', icon: Settings, accent: 'plain' },
    ],
  },
]

const accentActive = {
  vision: 'bg-vision-soft text-vision',
  assist: 'bg-assist-soft text-assist',
  plain: 'bg-white/10 text-white',
}

function NavItem({ to, label, icon: Icon, accent, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        `focus-ring group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive ? accentActive[accent] : 'text-white/60 hover:bg-white/5 hover:text-white/90'
        }`
      }
    >
      <Icon size={17} strokeWidth={2} className="shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    onClose?.()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-ink transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vision">
              <Aperture size={18} className="text-white" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-[15px] font-semibold text-white">AisleX</p>
              <p className="text-[10.5px] text-white/45">Smarter Shelves. Smarter Shopping.</p>
            </div>
          </div>
          <button
            aria-label="Close navigation"
            onClick={onClose}
            className="focus-ring rounded-md p-1 text-white/60 hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {navGroups.map((group, i) => (
            <div key={i} className={i === 0 ? '' : 'mt-5'}>
              {group.label && (
                <div className="mb-1.5 flex items-center gap-2 px-3">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      group.accent === 'vision' ? 'bg-vision' : 'bg-assist'
                    }`}
                  />
                  <p className="font-mono text-[10.5px] font-medium uppercase tracking-wider text-white/35">
                    {group.label}
                  </p>
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.to} {...item} onNavigate={onClose} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-3 py-3">
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors ${
                isActive ? 'bg-white/10' : 'hover:bg-white/5'
              }`
            }
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vision font-display text-[12px] font-semibold text-white">
              {user?.name?.trim().charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-white">{user?.name ?? 'Guest'}</p>
              <p className="truncate text-[11px] text-white/40">{user?.email ?? ''}</p>
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            className="focus-ring mt-1 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-[12.5px] font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/90"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}
