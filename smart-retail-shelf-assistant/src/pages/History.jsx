import { useEffect, useState } from 'react'
import { Eye, History as HistoryIcon, MessageSquareText } from 'lucide-react'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import RecommendationCard from '../components/RecommendationCard'
import { getShelfHistory, getQueryHistory } from '../services/historyService'
import { getProductById } from '../services/productService'
import { useAuth } from '../hooks/useAuth'
import { formatDateTime } from '../lib/format'

const statusTier = { completed: 'good', review: 'warn', failed: 'bad' }
const statusLabel = { completed: 'Completed', review: 'Needs review', failed: 'Failed' }

export default function History() {
  const { user } = useAuth()
  const [runs, setRuns] = useState(null)
  const [queries, setQueries] = useState(null)
  const [productMap, setProductMap] = useState({})

  useEffect(() => {
    if (!user) return
    getShelfHistory(user.email).then(setRuns)
    getQueryHistory(user.email).then(async (list) => {
      setQueries(list)
      const ids = [...new Set(list.flatMap((q) => q.productIds ?? []))]
      const results = await Promise.all(ids.map((id) => getProductById(id)))
      const map = {}
      results.forEach((p) => p && (map[p.id] = p))
      setProductMap(map)
    })
  }, [user])

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section>
        <div className="mb-3 flex items-center gap-2">
          <HistoryIcon size={15} className="text-vision" />
          <h2 className="text-[14px] font-medium text-ink">Shelf analysis runs</h2>
        </div>

        {runs === null ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl border border-border bg-surface" />
            ))}
          </div>
        ) : runs.length === 0 ? (
          <EmptyState icon={HistoryIcon} title="No analyses yet" description="Run your first shelf analysis to see it here." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {runs.map((run) => (
              <div key={run.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                <div className="h-28 w-full overflow-hidden bg-slate">
                  {run.thumbnail ? (
                    <img src={run.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted">
                      <HistoryIcon size={20} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-[13px] font-medium text-ink">{run.shelfLabel}</p>
                    <Badge tier={statusTier[run.status] ?? 'good'}>{statusLabel[run.status] ?? run.status}</Badge>
                  </div>
                  <p className="mt-1 text-[11.5px] text-muted">{formatDateTime(run.date)}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <p className="font-mono text-[12px] text-muted">{run.productsDetected} products</p>
                    <button className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-vision hover:bg-vision-soft">
                      <Eye size={13} />
                      View results
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <MessageSquareText size={15} className="text-assist" />
          <h2 className="text-[14px] font-medium text-ink">AisleX AI query history</h2>
        </div>
        {queries === null ? (
          <div className="h-32 animate-pulse rounded-xl border border-border bg-surface" />
        ) : queries.length === 0 ? (
          <EmptyState icon={MessageSquareText} title="No queries yet" description="Ask AisleX AI a question to see it here." />
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border bg-surface">
            {queries.map((q) => (
              <div key={q.id} className="px-4 py-3.5">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[13px] font-medium text-ink">{q.question}</p>
                  <p className="shrink-0 font-mono text-[11.5px] text-muted">{formatDateTime(q.date)}</p>
                </div>
                {q.answer && <p className="mt-1.5 text-[12.5px] text-muted">{q.answer}</p>}
                {q.productIds?.length > 0 && (
                  <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                    {q.productIds.map((id) => (
                      <RecommendationCard key={id} product={productMap[id]} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
