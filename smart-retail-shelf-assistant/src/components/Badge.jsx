const tierClasses = {
  good: 'bg-good-soft text-good',
  warn: 'bg-warn-soft text-warn',
  bad: 'bg-bad-soft text-bad',
  vision: 'bg-vision-soft text-vision',
  assist: 'bg-assist-soft text-assist',
  neutral: 'bg-slate text-muted border border-border',
}

export default function Badge({ tier = 'neutral', children, className = '', dot = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-mono tracking-tight ${tierClasses[tier]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
