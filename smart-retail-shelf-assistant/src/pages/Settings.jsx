import { useNavigate } from 'react-router-dom'
import { Cpu, Sparkles, Info, UserCog, LogOut, Coins, Aperture } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function SettingRow({ label, description, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[13.5px] font-medium text-ink">{label}</p>
        {description && <p className="mt-0.5 text-[12px] text-muted">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-border bg-vision-soft p-4">
        <Info size={16} className="mt-0.5 shrink-0 text-vision" />
        <p className="text-[12.5px] leading-relaxed text-ink">
          These settings are placeholders. Endpoint fields become active once{' '}
          <code className="font-mono text-[12px]">visionService.js</code> and{' '}
          <code className="font-mono text-[12px]">llmService.js</code> are connected to real backends.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-1 flex items-center gap-2">
          <UserCog size={15} className="text-ink" />
          <p className="text-[13.5px] font-medium text-ink">Account</p>
        </div>
        <SettingRow label="Name" description={user?.email}>
          <p className="text-[13px] text-ink">{user?.name}</p>
        </SettingRow>
        <SettingRow label="Currency" description="Prices are shown in Indian Rupees">
          <span className="flex items-center gap-1.5 text-[13px] text-ink">
            <Coins size={14} className="text-muted" />
            INR (₹)
          </span>
        </SettingRow>
        <SettingRow label="Log out" description="End your current session">
          <button
            onClick={handleLogout}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[12.5px] font-medium text-bad hover:bg-bad-soft"
          >
            <LogOut size={14} />
            Log out
          </button>
        </SettingRow>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-1 flex items-center gap-2">
          <Cpu size={15} className="text-vision" />
          <p className="text-[13.5px] font-medium text-ink">Computer Vision pipeline</p>
        </div>
        <SettingRow label="Model endpoint" description="Inference URL for the shelf-detection CNN">
          <input
            disabled
            placeholder="https://your-cnn-endpoint.example.com/v1/analyze"
            className="w-full max-w-xs rounded-lg border border-border bg-slate px-3 py-2 text-[12.5px] text-muted"
          />
        </SettingRow>
        <SettingRow label="Confidence threshold" description="Minimum score to display a detection">
          <input disabled type="range" defaultValue={60} className="w-full max-w-xs accent-vision" />
        </SettingRow>
        <SettingRow label="Auto-classify on upload" description="Run analysis immediately after upload">
          <button disabled className="relative h-6 w-11 rounded-full bg-border">
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
          </button>
        </SettingRow>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles size={15} className="text-assist" />
          <p className="text-[13.5px] font-medium text-ink">GenAI assistant</p>
        </div>
        <SettingRow label="Model endpoint" description="Chat completion URL for the shopping assistant">
          <input
            disabled
            placeholder="https://your-llm-endpoint.example.com/v1/chat"
            className="w-full max-w-xs rounded-lg border border-border bg-slate px-3 py-2 text-[12.5px] text-muted"
          />
        </SettingRow>
        <SettingRow label="Response tone" description="Style used for assistant replies">
          <select disabled className="w-full max-w-xs rounded-lg border border-border bg-slate px-3 py-2 text-[12.5px] text-muted">
            <option>Friendly & concise</option>
          </select>
        </SettingRow>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
            <Aperture size={15} className="text-white" />
          </div>
          <div>
            <p className="text-[13.5px] font-medium text-ink">AisleX</p>
            <p className="text-[12px] text-muted">Smarter Shelves. Smarter Shopping. · Version 1.0.0 (frontend demo)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
