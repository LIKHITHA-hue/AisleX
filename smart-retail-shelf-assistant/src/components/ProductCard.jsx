import Badge from './Badge'
import { formatConfidence, confidenceTier, formatPrice, availabilityLabel, availabilityTier } from '../lib/format'

/**
 * Reusable across the classification results page and the AI assistant's
 * recommendation cards. `confidence` is optional (only present when this
 * card represents a detection result rather than a plain catalog lookup).
 */
export default function ProductCard({ product, confidence, compact = false, onView }) {
  if (!product) return null
  return (
    <div className="group flex gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-vision/40">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[13.5px] font-medium text-ink">{product.name}</p>
          {confidence !== undefined && (
            <Badge tier={confidenceTier(confidence)} className="shrink-0">
              {formatConfidence(confidence)}
            </Badge>
          )}
        </div>
        <p className="mt-0.5 text-[12px] text-muted">{product.brand} · {product.category}</p>
        {!compact && (
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-[12.5px] font-medium text-ink">{formatPrice(product.price)}</span>
            <Badge tier={availabilityTier(product.availability)} dot>
              {availabilityLabel(product.availability)}
            </Badge>
          </div>
        )}
        {onView && (
          <button
            onClick={() => onView(product)}
            className="focus-ring mt-2 text-[12px] font-medium text-vision hover:underline"
          >
            View details
          </button>
        )}
      </div>
    </div>
  )
}
