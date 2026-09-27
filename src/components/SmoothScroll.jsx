import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import { LenisContext } from '../hooks/useLenis'

/** Provides Lenis smooth scrolling (skipped entirely for reduced-motion users). */
export default function SmoothScroll({ children }) {
  const reduce = useReducedMotion()
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if (reduce) return
    const instance = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -80 } })
    let frame = requestAnimationFrame(function raf(time) {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    })
    setLenis(instance)
    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      setLenis(null)
    }
  }, [reduce])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
