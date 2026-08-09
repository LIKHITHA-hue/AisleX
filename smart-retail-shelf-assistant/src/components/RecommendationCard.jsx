import { formatPrice, availabilityLabel, availabilityTier } from '../lib/format'
import Badge from './Badge'

export default function RecommendationCard({ product }) {
  if (!product) return null
  return (
    <div className="flex w-[180px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="h-24 w-full overflow-hidden bg-slate">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="line-clamp-2 text-[12.5px] font-medium leading-snug text-ink">{product.name}</p>
        <p className="font-mono text-[12px] font-medium text-ink">{formatPrice(product.price)}</p>
        <Badge tier={availabilityTier(product.availability)} dot className="w-fit">
          {availabilityLabel(product.availability)}
        </Badge>
      </div>
    </div>
  )
}
