import { confidenceTier, formatConfidence } from '../lib/format'

const tierColor = {
  good: '#17b26a',
  warn: '#f79009',
  bad: '#f04438',
}

/**
 * Renders one detection as a corner-bracket box (annotation-tool style)
 * over the shelf image, using percentage-based positioning so it scales
 * with the image regardless of rendered size.
 */
export default function DetectionBox({ box, confidence, label, index, active, onHover, onClick }) {
  const [x, y, w, h] = box
  const color = tierColor[confidenceTier(confidence)]
  const style = {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${w * 100}%`,
    height: `${h * 100}%`,
    borderColor: color,
    animationDelay: `${index * 60}ms`,
  }

  return (
    <button
      onMouseEnter={() => onHover?.(index)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(index)}
      style={style}
      className={`animate-box-in focus-ring absolute rounded-[3px] border-[1.5px] transition-[box-shadow,border-width] ${
        active ? 'z-10 border-[2.5px]' : ''
      }`}
    >
      {/* corner brackets */}
      {['-top-[1.5px] -left-[1.5px] border-t-2 border-l-2 rounded-tl-[3px]',
        '-top-[1.5px] -right-[1.5px] border-t-2 border-r-2 rounded-tr-[3px]',
        '-bottom-[1.5px] -left-[1.5px] border-b-2 border-l-2 rounded-bl-[3px]',
        '-bottom-[1.5px] -right-[1.5px] border-b-2 border-r-2 rounded-br-[3px]'].map((pos, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute h-2.5 w-2.5 ${pos}`}
          style={{ borderColor: color }}
        />
      ))}

      <span
        className={`pointer-events-none absolute -top-[22px] left-0 whitespace-nowrap rounded px-1.5 py-[3px] font-mono text-[10px] font-medium text-white shadow-sm transition-opacity ${
          active ? 'opacity-100' : 'opacity-80'
        }`}
        style={{ backgroundColor: color }}
      >
        {label} · {formatConfidence(confidence)}
      </span>
    </button>
  )
}
