import { Aperture } from 'lucide-react'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink">
            <Aperture size={22} className="text-white" strokeWidth={2.2} />
          </div>
          <p className="mt-3 font-display text-[20px] font-semibold text-ink">AisleX</p>
          <p className="mt-0.5 text-[12.5px] text-muted">Smarter Shelves. Smarter Shopping.</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 sm:p-7">
          <h1 className="font-display text-[17px] font-semibold text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
          <div className="mt-5">{children}</div>
        </div>
      </div>
    </div>
  )
}
