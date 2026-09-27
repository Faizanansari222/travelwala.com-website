import { useEffect, useState } from 'react'
import { useScroll, useSpring } from 'framer-motion'

/**
 * Smoothed 0→1 scroll progress for an element (or the whole page when no ref is given).
 * `offset` follows Framer Motion's useScroll offset syntax.
 */
export function useScrollProgress(ref, offset = ['start end', 'end start']) {
  const { scrollYProgress } = useScroll(ref ? { target: ref, offset } : undefined)
  return useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4, restDelta: 0.0005 })
}

/** True once the page has been scrolled past `threshold` pixels. */
export function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
