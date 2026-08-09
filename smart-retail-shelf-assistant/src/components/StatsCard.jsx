export default function StatsCard({ label, value, icon: Icon, accent = 'vision', trend }) {
  const accentClasses = {
    vision: 'bg-vision-soft text-vision',
    assist: 'bg-assist-soft text-assist',
  }
  return (
    <div className="rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentClasses[accent]}`}>
          <Icon size={17} strokeWidth={2} />
        </div>
        {trend && (
          <span className="font-mono text-[11px] font-medium text-good">{trend}</span>
        )}
      </div>
      <p className="mt-4 font-display text-[26px] font-semibold leading-none text-ink">{value}</p>
      <p className="mt-1.5 text-[13px] text-muted">{label}</p>
    </div>
  )
}
