import { motion, useReducedMotion } from 'framer-motion'
import { EASE_IN_OUT } from '../lib/motion'
import Plane from './Plane'

/**
 * Wraps each routed page. On leave, a teal curtain wipes in from the left behind a plane;
 * on enter, the curtain continues off to the right as the plane exits the screen.
 * Runs under <AnimatePresence mode="wait"> in App.jsx.
 */
export default function PageTransition({ children }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
        {children}
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.35 } }}
        exit={{ opacity: 1, transition: { duration: 0.6 } }}
      >
        {children}
      </motion.div>

      {/* Teal wipe */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] bg-linear-to-r from-brand-dark via-brand to-brand-light"
        initial={{ scaleX: 1, originX: 1 }}
        animate={{ scaleX: 0, originX: 1, transition: { duration: 0.6, ease: EASE_IN_OUT, delay: 0.05 } }}
        exit={{ scaleX: [0, 1], originX: 0, transition: { duration: 0.55, ease: EASE_IN_OUT, originX: { duration: 0 } } }}
      />

      {/* Plane swooshing across, with a contrail */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 left-0 z-[71] -mt-8 flex items-center text-white"
        initial={{ x: '40vw', y: 0, opacity: 1 }}
        animate={{ x: '115vw', y: -60, opacity: 1, transition: { duration: 0.65, ease: 'easeIn' } }}
        exit={{ x: ['-30vw', '40vw'], y: [60, 0], transition: { duration: 0.55, ease: 'easeOut' } }}
      >
        <span className="h-0.5 w-[28vw] rounded-full bg-linear-to-r from-transparent to-white/80" />
        <Plane size={64} className="-ml-1 drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]" />
      </motion.div>
    </>
  )
}
