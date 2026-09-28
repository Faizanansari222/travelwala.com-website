import { useEffect, useId, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion'
import { usePathFollower } from '../hooks/usePathFollower'
import { PlaneGlyph } from './Plane'

/**
 * A plane that flies along an SVG path.
 * - `trail`  : reveals a dashed contrail behind the plane as it flies (masked pathLength)
 * - `track`  : always shows the full dashed route underneath
 * - `loop`   : repeats forever with `repeatDelay` seconds of pause; otherwise flies once
 * Honours prefers-reduced-motion by showing the finished route without movement.
 */
export default function PathFlight({
  d,
  viewBox = '0 0 1000 200',
  preserveAspectRatio = 'xMidYMid meet',
  duration = 5,
  delay = 0,
  repeatDelay = 3,
  loop = true,
  trail = true,
  track = false,
  planeSize = 32,
  planeColor = '#ffffff',
  planeBadge,
  trailColor = 'rgba(255,255,255,0.75)',
  trailWidth = 2,
  dash = '6 9',
  hidePlaneWhenReduced = true,
  onComplete,
  className,
}) {
  const reduce = useReducedMotion()
  const maskId = `trail-${useId().replace(/[^a-zA-Z0-9-_]/g, '')}`
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const planeRef = useRef(null)
  // Looping flights pause while scrolled out of view, so off-screen planes cost nothing.
  const inView = useInView(svgRef, { margin: '100px 0px' })
  const shouldRun = !loop || inView
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const progress = useMotionValue(0)
  const trailOpacity = useMotionValue(1)
  const planeOpacity = useMotionValue(loop ? 0 : 1)

  usePathFollower(pathRef, planeRef, progress, d)

  useEffect(() => {
    if (reduce) {
      progress.set(1)
      trailOpacity.set(1)
      planeOpacity.set(hidePlaneWhenReduced ? 0 : 1)
      onCompleteRef.current?.()
      return
    }
    if (!shouldRun) return

    if (!loop) {
      progress.set(0)
      const controls = animate(progress, 1, {
        duration,
        delay,
        ease: [0.45, 0, 0.25, 1],
        onComplete: () => onCompleteRef.current?.(),
      })
      return () => controls.stop()
    }

    // One cycle = flight + pause. Keyframe times are normalised to the full cycle.
    const cycle = duration + repeatDelay
    const f = duration / cycle
    const fadeEnd = Math.min(f + Math.min(0.9, repeatDelay * 0.8) / cycle, 1)
    const shared = { duration: cycle, delay, repeat: Infinity, ease: 'linear' }

    const flights = [
      animate(progress, [0, 1, 1], { ...shared, times: [0, f, 1], ease: [[0.45, 0, 0.3, 1], 'linear'] }),
      animate(trailOpacity, [1, 1, 0, 0], { ...shared, times: [0, f, fadeEnd, 1] }),
      animate(planeOpacity, [0, 1, 1, 0, 0], { ...shared, times: [0, f * 0.06, f * 0.94, f, 1] }),
    ]
    return () => flights.forEach((c) => c.stop())
  }, [reduce, shouldRun, loop, duration, delay, repeatDelay, hidePlaneWhenReduced, progress, trailOpacity, planeOpacity])

  const [vx, vy, vw, vh] = viewBox.split(/[\s,]+/).map(Number)

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      // Own compositor layer: the moving plane and growing trail repaint only this SVG.
      style={{ willChange: 'transform' }}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={vx - vw} y={vy - vh} width={vw * 3} height={vh * 3}>
          <motion.path
            d={d}
            stroke="#fff"
            strokeWidth={trailWidth + 8}
            strokeLinecap="butt"
            style={{ pathLength: progress }}
          />
        </mask>
      </defs>

      {track && (
        <path d={d} stroke={trailColor} strokeWidth={trailWidth} strokeDasharray={dash} strokeLinecap="round" opacity="0.45" />
      )}

      {trail && (
        <motion.path
          d={d}
          stroke={trailColor}
          strokeWidth={trailWidth}
          strokeDasharray={dash}
          strokeLinecap="round"
          mask={`url(#${maskId})`}
          style={{ opacity: trailOpacity }}
        />
      )}

      <path ref={pathRef} d={d} stroke="none" />

      <motion.g style={{ opacity: planeOpacity }}>
        <g ref={planeRef}>
          <PlaneGlyph size={planeSize} color={planeColor} badge={planeBadge} />
        </g>
      </motion.g>
    </svg>
  )
}
