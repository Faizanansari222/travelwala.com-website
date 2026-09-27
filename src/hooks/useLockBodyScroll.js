import { useEffect } from 'react'
import { useLenis } from './useLenis'

/** Prevents the page behind a modal / menu / loader from scrolling while `locked` is true. */
export function useLockBodyScroll(locked) {
  const lenis = useLenis()

  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      document.body.style.overflow = previous
      lenis?.start()
    }
  }, [locked, lenis])
}
