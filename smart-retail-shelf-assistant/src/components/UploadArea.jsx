import { useCallback, useRef, useState } from 'react'
import { UploadCloud, ImageOff } from 'lucide-react'

export default function UploadArea({ onFileSelected }) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0]
      if (!file) return
      if (!file.type.startsWith('image/')) {
        setError('That file type is not supported. Upload a JPG, PNG, or WEBP image.')
        return
      }
      setError(null)
      onFileSelected(file)
    },
    [onFileSelected]
  )

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={`focus-ring flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16 text-center transition-colors ${
          dragActive ? 'border-vision bg-vision-soft' : 'border-border bg-slate hover:border-vision/50 hover:bg-vision-soft/40'
        }`}
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${dragActive ? 'bg-vision text-white' : 'bg-white text-vision'} border border-border`}>
          <UploadCloud size={20} strokeWidth={1.8} />
        </div>
        <p className="mt-4 text-[14.5px] font-medium text-ink">
          Drag and drop a shelf image, or click to browse
        </p>
        <p className="mt-1 text-[12.5px] text-muted">Supports JPG, PNG, WEBP — up to 15MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-bad-soft px-3 py-2 text-[12.5px] text-bad">
          <ImageOff size={14} />
          {error}
        </div>
      )}
    </div>
  )
}
