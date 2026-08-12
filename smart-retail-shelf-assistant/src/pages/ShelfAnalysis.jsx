import { useMemo, useState } from 'react'
import { RotateCcw, ImagePlus, CircleCheck, Timer, Cpu, X } from 'lucide-react'
import UploadArea from '../components/UploadArea'
import ShelfViewer from '../components/ShelfViewer'
import { analyzeShelfImage } from '../services/visionService'
import { saveShelfRun } from '../services/historyService'
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
    setHovered(null)
    setSaved(false)
  }

  function reset() {
    setFile(null)
    setPreviewUrl(null)
    setStatus('idle')
    setResult(null)
    setHovered(null)
    setSaved(false)
  }

  async function handleAnalyze() {
    if (!file) return

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
          productsDetected: res.detections?.length ?? 0,
          status: 'completed',
        })

        setSaved(true)
      }
    } catch (error) {
      console.error('Shelf analysis failed:', error)
      setStatus('error')
    }
  }

  const summary = useMemo(() => {
    if (!result) return null

    const detections = result.detections ?? []

    const avg = detections.length
      ? detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length
      : 0

    const uniqueProducts = new Set(
      detections
        .map((d) => d.productId)
        .filter(Boolean)
        .map((name) => name.trim().toLowerCase())
    ).size

    return {
      total: detections.length,
      avg,
      uniqueProducts,
    }
  }, [result])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

        {/* LEFT: Upload / Viewer */}
        <div>
          {!previewUrl && (
            <UploadArea onFileSelected={handleFileSelected} />
          )}

          {previewUrl && (
            <div>
              <ShelfViewer
                imageUrl={previewUrl}
                detections={status === 'done' ? result?.detections ?? [] : []}
                productLookup={null}
                loading={status === 'analyzing'}
                activeIndex={hovered}
                onHoverBox={setHovered}
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">

                {/* Analyze */}
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

                {/* Analyzing */}
                {status === 'analyzing' && (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 rounded-lg bg-vision/50 px-4 py-2.5 text-[13.5px] font-medium text-white"
                  >
                    <Cpu size={15} className="animate-pulse-dot" />
                    Analyzing shelf…
                  </button>
                )}

                {/* Done */}
                {status === 'done' && (
                  <button
                    onClick={reset}
                    className="focus-ring inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13.5px] font-medium text-muted hover:bg-slate"
                  >
                    <RotateCcw size={15} />
                    Analyze another image
                  </button>
                )}

                {/* Remove */}
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

              {/* Error message */}
              {status === 'error' && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-600">
                  Unable to analyze this image. Make sure the Flask backend is running and try again.
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Results */}
        <div>
          {status === 'done' && summary ? (
            <div className="space-y-4">

              {/* Summary */}
              <div className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center gap-2 text-good">
                  <CircleCheck size={16} />

                  <p className="text-[13.5px] font-medium text-ink">
                    Shelf Analysis Results
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">

                  {/* Total */}
                  <div>
                    <p className="font-display text-[20px] font-semibold text-ink">
                      {summary.total}
                    </p>

                    <p className="text-[11.5px] text-muted">
                      Detected
                    </p>
                  </div>

                  {/* Unique */}
                  <div>
                    <p className="font-display text-[20px] font-semibold text-ink">
                      {summary.uniqueProducts}
                    </p>

                    <p className="text-[11.5px] text-muted">
                      Unique Products
                    </p>
                  </div>

                  {/* Confidence */}
                  <div>
                    <p className="font-display text-[20px] font-semibold text-ink">
                      {Math.round(summary.avg * 100)}%
                    </p>

                    <p className="text-[11.5px] text-muted">
                      Avg. confidence
                    </p>
                  </div>
                </div>

                {/* Processing info */}
                <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-[11.5px] text-muted">
                  <Timer size={12} />

                  Processed in{' '}
                  {result?.processingTimeMs
                    ? (result.processingTimeMs / 1000).toFixed(1)
                    : '0.0'}
                  s

                  {' · '}

                  {result?.modelVersion ?? 'AisleX YOLO + OCR'}

                  {saved && (
                    <span className="ml-auto text-good">
                      Saved to history
                    </span>
                  )}
                </div>
              </div>

              {/* Product List */}
              <div>
                <p className="mb-2 text-[12.5px] font-medium text-muted">
                  Detected Products
                </p>

                <div className="space-y-2">

                  {result.detections?.length > 0 ? (
                    result.detections.map((d, i) => (
                      <div
                        key={d.id ?? i}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        className={`rounded-xl transition-shadow ${
                          hovered === i
                            ? 'ring-2 ring-vision/40'
                            : ''
                        }`}
                      >
                        <div className="rounded-xl border border-border bg-surface p-3">

                          <div className="flex items-center justify-between">

                            {/* OCR Product Name */}
                            <p className="text-[13.5px] font-medium text-ink">
                              {d.productId || d.ocrText || 'Unknown Product'}
                            </p>

                            {/* Confidence */}
                            <span className="text-[11.5px] text-muted">
                              {Math.round((d.confidence ?? 0) * 100)}%
                            </span>

                          </div>

                          {/* OCR text if different */}
                          {d.ocrText &&
                            d.ocrText !== d.productId && (
                              <p className="mt-1 text-[11.5px] text-muted">
                                OCR: {d.ocrText}
                              </p>
                            )}

                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-border bg-surface p-4">
                      <p className="text-[13px] text-muted">
                        No products were detected in this image.
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface p-5">

              <p className="text-[13.5px] font-medium text-ink">
                How it works
              </p>

              <ol className="mt-3 space-y-3">

                {[
                  [
                    'Upload',
                    'Drag in a shelf photo or browse from your device.',
                  ],
                  [
                    'Detect',
                    'YOLO11 locates individual products on the shelf.',
                  ],
                  [
                    'Identify',
                    'EasyOCR reads text from each detected product to identify the brand or product name.',
                  ],
                ].map(([title, desc], i) => (
                  <li key={title} className="flex gap-3">

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-vision-soft font-mono text-[11px] font-medium text-vision">
                      {i + 1}
                    </span>

                    <div>
                      <p className="text-[13px] font-medium text-ink">
                        {title}
                      </p>

                      <p className="text-[12px] text-muted">
                        {desc}
                      </p>
                    </div>

                  </li>
                ))}

              </ol>

              <p className="mt-4 border-t border-border pt-3 text-[11.5px] text-muted">
                Results are generated by the AisleX YOLO11 + OCR vision pipeline.
              </p>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
