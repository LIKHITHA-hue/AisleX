import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ScanLine, Sparkles, Boxes, Layers, MessagesSquare, Tags, ArrowUpRight } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import { getDashboardStats } from '../services/productService'
import { getHistoryStats } from '../services/historyService'
import { useAuth } from '../hooks/useAuth'

function FeatureCard({ accent, icon: Icon, pipeline, title, description, cta, to }) {
  const accentClasses = accent === 'vision'
    ? { bg: 'bg-vision-soft', text: 'text-vision', button: 'bg-vision hover:bg-vision/90' }
    : { bg: 'bg-assist-soft', text: 'text-assist', button: 'bg-assist hover:bg-assist/90' }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentClasses.bg} ${accentClasses.text}`}>
          <Icon size={19} strokeWidth={2} />
        </div>
        <span className={`font-mono text-[10.5px] font-medium uppercase tracking-wider ${accentClasses.text}`}>
          {pipeline}
        </span>
      </div>
      <h3 className="mt-4 font-display text-[16.5px] font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{description}</p>
      <Link
        to={to}
        className={`focus-ring mt-5 inline-flex w-fit items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-medium text-white transition-colors ${accentClasses.button}`}
      >
        {cta}
        <ArrowUpRight size={14} />
      </Link>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!user) return
    Promise.all([getDashboardStats(), getHistoryStats(user.email)]).then(([catalog, history]) => {
      setStats({ ...catalog, ...history })
    })
  }, [user])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-xl border border-border bg-ink p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">AisleX</p>
        <h2 className="mt-2 max-w-2xl font-display text-[22px] font-semibold leading-snug text-white sm:text-[26px]">
          Smarter Shelves. Smarter Shopping.
        </h2>
        <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-white/55">
          Upload a shelf photo to detect and classify products, or ask AisleX AI a question to get
          recommendations and alternatives — all running on demo data until your models are connected.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard label="Products detected" value={stats ? stats.productsDetected.toLocaleString() : '—'} icon={Boxes} accent="vision" />
        <StatsCard label="Shelves analyzed" value={stats ? stats.shelvesAnalyzed : '—'} icon={Layers} accent="vision" />
        <StatsCard label="AI queries" value={stats ? stats.aiQueries : '—'} icon={MessagesSquare} accent="assist" />
        <StatsCard label="Products classified" value={stats ? stats.productsClassified : '—'} icon={Tags} accent="assist" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FeatureCard
          accent="vision"
          icon={ScanLine}
          pipeline="AisleX Vision"
          title="AisleX Vision"
          description="Analyze retail shelf images and identify and classify products using Computer Vision."
          cta="Analyze Shelf"
          to="/shelf-analysis"
        />
        <FeatureCard
          accent="assist"
          icon={Sparkles}
          pipeline="AisleX AI"
          title="AisleX AI"
          description="Ask questions about products, find alternatives, and get intelligent shopping recommendations."
          cta="Ask AisleX AI"
          to="/assistant"
        />
      </div>
    </div>
  )
}
