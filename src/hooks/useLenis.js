import { createContext, useContext } from 'react'

export const LenisContext = createContext(null)

/** Returns the active Lenis instance, or null when smooth scrolling is disabled. */
export const useLenis = () => useContext(LenisContext)

/** Scrolls to top using Lenis when available, falling back to native scrolling. */
export function scrollToTop(lenis, { immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(0, { immediate })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}
