import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { SITE } from '../data/site'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { EASE_IN_OUT } from '../lib/motion'
import PathFlight from './PathFlight'

const STORAGE_KEY = 'travelwala-intro-seen'
const TAKEOFF_ROUTE = 'M10 178 L 90 178 C 170 178, 200 120, 250 88 S 350 24, 420 14'

function isFirstVisit() {
  try {
    return !window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return false
  }
}

/** First-visit intro: a plane takes off drawing its path, the logo appears, then the curtain slides up. */
export default function Loader() {
  const reduce = useReducedMotion()
  const [visible, setVisible] = useState(isFirstVisit)
  const [showLogo, setShowLogo] = useState(false)
  useLockBodyScroll(visible)

  useEffect(() => {
    if (!visible) return
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* storage unavailable — the intro simply plays again next time */
    }
    const logoTimer = setTimeout(() => setShowLogo(true), reduce ? 100 : 1250)
    const hideTimer = setTimeout(() => setVisible(false), reduce ? 900 : 2250)
    return () => {
      clearTimeout(logoTimer)
      clearTimeout(hideTimer)
    }
  }, [visible, reduce])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-label="Loading Travel Wala"
          exit={{ y: '-100%', transition: { duration: 0.8, ease: EASE_IN_OUT } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-linear-to-br from-brand via-brand-dark to-brand-deep px-6"
        >
          <PathFlight
            d={TAKEOFF_ROUTE}
            viewBox="0 0 430 200"
            loop={false}
            duration={1.3}
            delay={0.1}
            planeSize={34}
            planeColor="#ffffff"
            trailColor="#FFB547"
            trailWidth={2.5}
            dash="7 8"
            track
            className="w-[min(88vw,520px)] overflow-visible"
          />
          <div className="h-24">
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center"
                >
                  <img src="/logo-light.svg" alt="Travel Wala" width="236" height="60" className="h-14 w-auto" />
                  <p className="mt-3 text-sm font-medium tracking-[0.25em] text-white/70 uppercase">{SITE.tagline}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
