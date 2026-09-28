import { useMemo, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useElementSize } from '../hooks/useElementSize'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePathFollower } from '../hooks/usePathFollower'
import { cn } from '../lib/utils'
import { PlaneGlyph } from './Plane'

const PAD = 70

/**
 * Builds a winding route of identical S-curves that alternates between the left and
 * right edges. Because every segment has the same shape, stop `i` sits exactly at
 * progress `i / segments` along the path.
 */
function buildRoute(width, height, segments) {
  if (!width || !height || segments < 1) return null
  const left = Math.max(28, width * 0.05)
  const right = width - left
  const dy = (height - PAD * 2) / segments
  const points = Array.from({ length: segments + 1 }, (_, i) => ({
    x: i % 2 === 0 ? left : right,
    y: PAD + i * dy,
  }))
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    d += ` C ${a.x} ${a.y + dy * 0.62}, ${b.x} ${b.y - dy * 0.62}, ${b.x} ${b.y}`
  }
  return { d, points }
}

/**
 * Wraps a run of Home-page sections with a dotted flight route. As the user scrolls,
 * a plane travels the route (rotating with the curve) and destination pins pop in
 * as they are reached. Shown from the `md` breakpoint up.
 */
export default function FlightPath({ stops, children }) {
  const wrapperRef = useRef(null)
  const pathRef = useRef(null)
  const planeRef = useRef(null)
  const reduce = useReducedMotion()
  const enabled = useMediaQuery('(min-width: 768px)')
  const { width, height } = useElementSize(wrapperRef)
  const segments = stops.length - 1
  const route = useMemo(() => buildRoute(width, height, segments), [width, height, segments])

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start 55%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.35, restDelta: 0.0005 })
  // The flown (orange) part of the route is revealed down to the plane's height using two
  // opposing GPU transforms: the clip box slides down while the SVG inside slides up by the
  // same amount. Works because the route only ever travels downwards, and — unlike an SVG
  // mask — never repaints the page-tall SVG.
  const clipRef = useRef(null)
  const flownRef = useRef(null)
  const revealTo = (y) => {
    if (!clipRef.current || !flownRef.current) return
    clipRef.current.style.transform = `translate3d(0, ${y - height}px, 0)`
    flownRef.current.style.transform = `translate3d(0, ${height - y}px, 0)`
  }
  usePathFollower(pathRef, planeRef, progress, route?.d, 'css', reduce ? undefined : revealTo)

  const [reached, setReached] = useState(0)
  useMotionValueEvent(progress, 'change', (value) => {
    setReached(Math.floor(value * segments + 0.03))
  })

  const showAll = reduce
  const active = enabled && route

  return (
    <div ref={wrapperRef} className="relative">
      {active && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <svg className="absolute inset-0" width={width} height={height} viewBox={`0 0 ${width} ${height}`} focusable="false" fill="none">
            <path ref={pathRef} d={route.d} stroke="var(--color-brand)" strokeOpacity="0.22" strokeWidth="3" strokeDasharray="1 11" strokeLinecap="round" />
          </svg>
          <div
            ref={clipRef}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{ transform: showAll ? 'none' : `translate3d(0, ${-height}px, 0)` }}
          >
            <svg
              ref={flownRef}
              className="absolute inset-0 will-change-transform"
              style={{ transform: showAll ? 'none' : `translate3d(0, ${height}px, 0)` }}
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              focusable="false"
              fill="none"
            >
              <path d={route.d} stroke="var(--color-accent)" strokeWidth="3.5" strokeDasharray="1 11" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}

      <div className="relative z-10">{children}</div>

      {active && (
        <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
          {route.points.map((point, i) => {
            const isReached = showAll || reached >= i
            const onRight = i % 2 === 1
            return (
              <motion.div
                key={stops[i]}
                className="absolute"
                style={{ left: point.x, top: point.y }}
                initial={false}
                animate={isReached ? { scale: 1, opacity: 1 } : { scale: 0.2, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              >
                <div className="relative -translate-x-1/2 -translate-y-full">
                  <MapPin size={34} className="fill-accent text-white drop-shadow-md" strokeWidth={1.6} />
                  <span
                    className={cn(
                      'absolute top-1 rounded-full bg-white px-3 py-1 text-xs font-bold whitespace-nowrap text-ink shadow-soft',
                      onRight ? 'right-full mr-1' : 'left-full ml-1',
                    )}
                  >
                    {stops[i]}
                  </span>
                </div>
              </motion.div>
            )
          })}

          {!reduce && (
            // A small GPU layer moved with translate3d — no page repaint while scrolling.
            <div ref={planeRef} className="absolute top-0 left-0 h-0 w-0 origin-top-left will-change-transform">
              <svg width="48" height="48" viewBox="-24 -24 48 48" className="-translate-x-1/2 -translate-y-1/2 overflow-visible">
                <PlaneGlyph size={30} color="var(--color-brand)" badge="#ffffff" />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
