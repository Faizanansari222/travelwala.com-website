import { useCallback, useLayoutEffect, useRef } from 'react'
import { useMotionValueEvent } from 'framer-motion'
import { clamp } from '../lib/utils'

/**
 * Samples a path once into a flat [x0, y0, x1, y1, …] table. Reading a point from the
 * table is O(1), whereas SVGPathElement.getPointAtLength() walks the whole path on every
 * call — far too slow to do several times per frame.
 */
function samplePath(path) {
  const total = path.getTotalLength()
  if (!total) return null
  // One sample every ~10px; linear interpolation between samples is visually exact.
  const count = Math.min(600, Math.max(100, Math.ceil(total / 10)))
  const points = new Float32Array((count + 1) * 2)
  for (let i = 0; i <= count; i++) {
    const p = path.getPointAtLength((total * i) / count)
    points[i * 2] = p.x
    points[i * 2 + 1] = p.y
  }
  return { count, points }
}

/**
 * Moves an element along an SVG path as `progress` (a 0→1 MotionValue) changes,
 * rotating it to follow the curve. Writes the transform directly, so it never
 * triggers a React render.
 *
 * @param pathRef   ref to the <path> being followed
 * @param targetRef ref to the element to move (content centred on 0,0, facing right)
 * @param progress  MotionValue<number> between 0 and 1
 * @param pathKey   change this (e.g. the path `d`) to re-sample the path
 * @param mode      'svg' → sets the transform attribute of an SVG <g>
 *                  'css' → sets style.transform with translate3d (for GPU-layered HTML)
 * @param onMove    optional (x, y, angle) callback, called after every move
 */
export function usePathFollower(pathRef, targetRef, progress, pathKey, mode = 'svg', onMove) {
  const tableRef = useRef(null)
  const onMoveRef = useRef(onMove)
  onMoveRef.current = onMove

  const update = useCallback(
    (value) => {
      const table = tableRef.current
      if (!table) return
      const target = targetRef.current
      const { count, points } = table

      const f = clamp(value) * count
      const i = Math.min(Math.floor(f), count - 1)
      const t = f - i
      const x = points[i * 2] + (points[i * 2 + 2] - points[i * 2]) * t
      const y = points[i * 2 + 1] + (points[i * 2 + 3] - points[i * 2 + 1]) * t

      // Tangent from the neighbouring samples gives a stable heading.
      const a = Math.max(i - 1, 0)
      const b = Math.min(i + 2, count)
      const angle = (Math.atan2(points[b * 2 + 1] - points[a * 2 + 1], points[b * 2] - points[a * 2]) * 180) / Math.PI

      if (target && mode === 'css') {
        target.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`
      } else if (target) {
        target.setAttribute('transform', `translate(${x} ${y}) rotate(${angle})`)
      }
      onMoveRef.current?.(x, y, angle)
    },
    [targetRef, mode],
  )

  useMotionValueEvent(progress, 'change', update)

  useLayoutEffect(() => {
    tableRef.current = pathRef.current ? samplePath(pathRef.current) : null
    update(progress.get())
  }, [pathRef, update, progress, pathKey])
}
