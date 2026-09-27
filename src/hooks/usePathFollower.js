import { useCallback, useLayoutEffect } from 'react'
import { useMotionValueEvent } from 'framer-motion'
import { clamp } from '../lib/utils'

/**
 * Moves an SVG element along an SVG path as `progress` (a 0→1 MotionValue) changes,
 * rotating it to follow the curve's tangent. Writes the transform attribute directly,
 * so it never triggers a React render and stays at 60fps.
 *
 * @param pathRef   ref to the <path> being followed
 * @param targetRef ref to the <g> to move (its content should be centred on 0,0 and face right)
 * @param progress  MotionValue<number> between 0 and 1
 * @param pathKey   change this (e.g. the path `d`) to force a re-measure
 */
export function usePathFollower(pathRef, targetRef, progress, pathKey) {
  const update = useCallback(
    (value) => {
      const path = pathRef.current
      const target = targetRef.current
      if (!path || !target) return
      const total = path.getTotalLength()
      if (!total) return

      const length = clamp(value) * total
      const point = path.getPointAtLength(length)
      const behind = path.getPointAtLength(Math.max(0, length - 1))
      const ahead = path.getPointAtLength(Math.min(total, length + 1))
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI

      target.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`)
    },
    [pathRef, targetRef],
  )

  useMotionValueEvent(progress, 'change', update)

  useLayoutEffect(() => {
    update(progress.get())
  }, [update, progress, pathKey])
}
