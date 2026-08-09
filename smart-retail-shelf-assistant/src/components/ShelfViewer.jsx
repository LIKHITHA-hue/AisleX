import { useState } from 'react'
import DetectionBox from './DetectionBox'
import { ScanLine } from 'lucide-react'

export default function ShelfViewer({ imageUrl, detections = [], productLookup, loading, activeIndex, onHoverBox }) {
  const [internalActive, setInternalActive] = useState(null)
  const active = activeIndex ?? internalActive

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-ink">
      <div className="relative">
        <img src={imageUrl} alt="Shelf under analysis" className="block w-full select-none" draggable={false} />

        {loading && (
          <div className="absolute inset-0 bg-ink/55">
            <div className="animate-scanline absolute left-0 right-0 h-24 bg-gradient-to-b from-vision/0 via-vision/25 to-vision/0" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                <ScanLine size={18} className="text-white" />
              </div>
              <p className="font-mono text-[11.5px] text-white/80">Running detection…</p>
            </div>
          </div>
        )}

        {!loading &&
          detections.map((d, i) => {
            const product = productLookup?.(d.productId)
            return (
              <DetectionBox
                key={d.id}
                index={i}
                box={d.box}
                confidence={d.confidence}
                label={product?.name?.split(' ').slice(0, 2).join(' ') ?? 'Product'}
                active={active === i}
                onHover={(idx) => {
                  setInternalActive(idx)
                  onHoverBox?.(idx)
                }}
              />
            )
          })}
      </div>

      {!loading && detections.length > 0 && (
        <div className="flex items-center justify-between border-t border-white/10 bg-ink px-4 py-2.5">
          <p className="font-mono text-[11px] text-white/50">
            {detections.length} regions detected
          </p>
          <div className="flex items-center gap-3">
            {[['good', 'High'], ['warn', 'Medium'], ['bad', 'Low']].map(([tier, text]) => (
              <span key={tier} className="flex items-center gap-1.5 font-mono text-[10.5px] text-white/50">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: { good: '#17b26a', warn: '#f79009', bad: '#f04438' }[tier] }}
                />
                {text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
