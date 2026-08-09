import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import { getAllProducts } from '../services/productService'
import { mockDetectionResult } from '../mock/mockDetections'
import { formatConfidence, confidenceTier, formatPrice, availabilityLabel, availabilityTier } from '../lib/format'

const confidenceByProduct = mockDetectionResult.detections.reduce((acc, d) => {
  if (!acc[d.productId] || d.confidence > acc[d.productId]) acc[d.productId] = d.confidence
  return acc
}, {})

export default function ProductClassification() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    getAllProducts().then(setProducts)
  }, [])

  const categories = useMemo(
    () => ['all', ...new Set(products.map((p) => p.category))],
    [products]
  )

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'all' || p.category === category
      return matchesQuery && matchesCategory
    })
  }, [products, query, category])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classified products…"
            className="focus-ring w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-[13px] text-ink placeholder:text-muted"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal size={14} className="shrink-0 text-muted" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`focus-ring shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                category === c
                  ? 'border-vision bg-vision-soft text-vision'
                  : 'border-border text-muted hover:bg-slate'
              }`}
            >
              {c === 'all' ? 'All categories' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-surface">
        {filtered.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No products match your filters"
            description="Try a different search term or category."
          />
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-slate/60 text-[11px] uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Category</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Price</th>
                <th className="px-4 py-3 font-medium">Confidence</th>
                <th className="px-4 py-3 font-medium">Availability</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const conf = confidenceByProduct[p.id]
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-slate/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-ink">{p.name}</p>
                          <p className="text-[11.5px] text-muted">{p.brand} · {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-[12.5px] text-muted sm:table-cell">{p.category}</td>
                    <td className="hidden px-4 py-3 font-mono text-[12.5px] text-ink md:table-cell">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      {conf ? (
                        <Badge tier={confidenceTier(conf)}>{formatConfidence(conf)}</Badge>
                      ) : (
                        <span className="text-[12px] text-muted">Not scanned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tier={availabilityTier(p.availability)} dot>
                        {availabilityLabel(p.availability)}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
