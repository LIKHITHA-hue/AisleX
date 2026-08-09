export function formatConfidence(value) {
  return `${Math.round(value * 100)}%`
}

export function confidenceTier(value) {
  if (value >= 0.85) return 'good'
  if (value >= 0.65) return 'warn'
  return 'bad'
}

export function formatPrice(value) {
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateTime(iso) {
  const d = new Date(iso)
  return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`
}

export function availabilityLabel(status) {
  return {
    in_stock: 'In stock',
    low_stock: 'Low stock',
    out_of_stock: 'Out of stock',
  }[status] ?? 'Unknown'
}

export function availabilityTier(status) {
  return {
    in_stock: 'good',
    low_stock: 'warn',
    out_of_stock: 'bad',
  }[status] ?? 'warn'
}
