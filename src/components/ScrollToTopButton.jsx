import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { scrollToTop, useLenis } from '../hooks/useLenis'
import Plane from './Plane'

export default function ScrollToTopButton() {
  const lenis = useLenis()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => scrollToTop(lenis)}
          aria-label="Scroll back to top"
          initial={{ opacity: 0, y: 30, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.6 }}
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: 0.92 }}
          className="fixed right-4 bottom-22 z-40 grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-brand text-white shadow-lg shadow-brand-dark/30 ring-2 ring-white/70 sm:right-7 sm:bottom-24"
        >
          <motion.span
            className="inline-flex"
            variants={{ hover: { y: [0, -34, 34, 0], transition: { duration: 0.8, times: [0, 0.45, 0.46, 1] } } }}
          >
            <Plane size={26} className="-rotate-90" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
