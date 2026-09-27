import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { cn } from '../lib/utils'

function Cloud({ className, style }) {
  return (
    <svg viewBox="0 0 140 64" className={className} style={style} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M30 62 a20 20 0 0 1 -2 -39.9 A26 26 0 0 1 77 16 a20 20 0 0 1 35 10 a18 18 0 0 1 4 36 z"
      />
    </svg>
  )
}

// Each layer: vertical band, cloud placements (% of half-strip), drift speed and scroll parallax.
const LAYERS = [
  { band: 'top-[8%] h-32', duration: 150, parallax: 60, opacity: 'text-white/25', clouds: [{ x: 5, y: 10, w: 150 }, { x: 45, y: 40, w: 110 }, { x: 78, y: 0, w: 170 }] },
  { band: 'top-[26%] h-40', duration: 95, parallax: 140, opacity: 'text-white/35', clouds: [{ x: 15, y: 20, w: 200 }, { x: 60, y: 50, w: 150 }] },
  { band: 'bottom-[12%] h-48', duration: 60, parallax: 240, opacity: 'text-white/45', clouds: [{ x: 0, y: 30, w: 260 }, { x: 38, y: 0, w: 180 }, { x: 72, y: 45, w: 230 }] },
]

function CloudLayer({ layer, reduce }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 900], [0, reduce ? 0 : layer.parallax])

  return (
    <motion.div style={{ y }} className={cn('absolute inset-x-0', layer.band, layer.opacity)}>
      <motion.div
        className="flex h-full w-[200%]"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: layer.duration, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="relative h-full w-1/2">
            {layer.clouds.map((cloud, i) => (
              <Cloud key={i} className="absolute" style={{ left: `${cloud.x}%`, top: `${cloud.y}%`, width: cloud.w }} />
            ))}
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

/** Three layers of slowly drifting clouds with scroll parallax (static for reduced motion). */
export default function Clouds({ className }) {
  const reduce = useReducedMotion()
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {LAYERS.map((layer, i) => (
        <CloudLayer key={i} layer={layer} reduce={reduce} />
      ))}
    </div>
  )
}
