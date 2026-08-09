import { useMemo, useState } from 'react'
import { RotateCcw, ImagePlus, CircleCheck, Timer, Cpu, X } from 'lucide-react'
import UploadArea from '../components/UploadArea'
import ShelfViewer from '../components/ShelfViewer'
import ProductCard from '../components/ProductCard'
import { analyzeShelfImage } from '../services/visionService'
import { saveShelfRun } from '../services/historyService'
import { findProduct } from '../mock/mockProducts'
import { useAuth } from '../hooks/useAuth'

export default function ShelfAnalysis() {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [status, setStatus] = useState('idle') // idle | analyzing | done | error
  const [result, setResult] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [saved, setSaved] = useState(false)

  function handleFileSelected(f) {
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setStatus('idle')
    setResult(null)
  }

  function reset() {
    setFile(null)
    setPreviewUrl(null)
    setStatus('idle')
    setResult(null)
    setSaved(false)
  }

  async function handleAnalyze() {
    setStatus('analyzing')
    setSaved(false)
    try {
      const res = await analyzeShelfImage(file)
      setResult(res)
      setStatus('done')
      if (user) {
        await saveShelfRun(user.email, {
          thumbnail: previewUrl,
          shelfLabel: file?.name ?? 'Shelf scan',
          productsDetected: res.detections.length,
          status: 'completed',
        })
        setSaved(true)
      }
    } catch {
      setStatus('error')
    }
  }

  const summary = useMemo(() => {
    if (!result) return null
    const avg = result.detections.reduce((s, d) => s + d.confidence, 0) / result.detections.length
    const uniqueProducts = new Set(result.detections.map((d) => d.productId)).size
    return { total: result.detections.length, avg, uniqueProducts }
  }, [result])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: upload / viewer */}
        <div>
          {!previewUrl && <UploadArea onFileSelected={handleFileSelected} />}

          {previewUrl && (
            <div>
              <ShelfViewer
                imageUrl={previewUrl}
                detections={status === 'done' ? result.detections : []}
                productLookup={findProduct}
                loading={status === 'analyzing'}
                activeIndex={hovered}
                onHoverBox={setHovered}
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {status === 'idle' && (
                  <>
                    <button
                      onClick={handleAnalyze}
                      className="focus-ring inline-flex items-center gap-2 rounded-lg bg-vision px-4 py-2.5 text-[13.5px] font-medium text-white hover:bg-vision/90"
                    >
                      <Cpu size={15} />
                      Analyze Shelf
                    </button>
                    <button
                      onClick={reset}
                      className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13.5px] font-medium text-muted hover:bg-slate"
                    >
                      <ImagePlus size={15} />
                      Change image
                    </button>
                  </>
                )}
                {status === 'analyzing' && (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 rounded-lg bg-vision/50 px-4 py-2.5 text-[13.5px] font-medium text-white"
                  >
                    <Cpu size={15} className="animate-pulse-dot" />
                    Analyzing shelf…
                  </button>
                )}
                {status === 'done' && (
                  <button
                    onClick={reset}
                    className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13.5px] font-medium text-muted hover:bg-slate"
                  >
                    <RotateCcw size={15} />
                    Analyze another image
                  </button>
                )}
                {status !== 'analyzing' && previewUrl && (
                  <button
                    onClick={reset}
                    aria-label="Remove image"
                    className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[12.5px] text-muted hover:bg-slate"
                  >
                    <X size={14} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: results summary / product list */}
        <div>
          {status === 'done' && summary ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center gap-2 text-good">
                  <CircleCheck size={16} />
                  <p className="text-[13.5px] font-medium text-ink">Shelf Analysis Results</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="font-display text-[20px] font-semibold text-ink">{summary.total}</p>
                    <p className="text-[11.5px] text-muted">Detected</p>
                  </div>
                  <div>
                    <p className="font-display text-[20px] font-semibold text-ink">{summary.uniqueProducts}</p>
                    <p className="text-[11.5px] text-muted">Unique SKUs</p>
                  </div>
                  <div>
                    <p className="font-display text-[20px] font-semibold text-ink">{Math.round(summary.avg * 100)}%</p>
                    <p className="text-[11.5px] text-muted">Avg. confidence</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-[11.5px] text-muted">
                  <Timer size={12} />
                  Processed in {(result.processingTimeMs / 1000).toFixed(1)}s · {result.modelVersion}
                  {saved && <span className="ml-auto text-good">Saved to history</span>}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[12.5px] font-medium text-muted">Product list</p>
                <div className="space-y-2">
                  {result.detections.map((d, i) => (
                    <div
                      key={d.id}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      className={`rounded-xl transition-shadow ${hovered === i ? 'ring-2 ring-vision/40' : ''}`}
                    >
                      <ProductCard product={findProduct(d.productId)} confidence={d.confidence} compact />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface p-5">
              <p className="text-[13.5px] font-medium text-ink">How it works</p>
              <ol className="mt-3 space-y-3">
                {[
                  ['Upload', 'Drag in a shelf photo or browse from your device.'],
                  ['Detect', 'The CV pipeline locates each product on the shelf.'],
                  ['Classify', 'Every detection is matched to a catalog SKU with a confidence score.'],
                ].map(([title, desc], i) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vision-soft font-mono text-[11px] font-medium text-vision">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-ink">{title}</p>
                      <p className="text-[12px] text-muted">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-border pt-3 text-[11.5px] text-muted">
                Results shown are mock data — connect your CNN model in{' '}
                <code className="font-mono text-[11px] text-ink">visionService.js</code> to go live.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
