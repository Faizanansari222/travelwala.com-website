import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, RotateCcw } from 'lucide-react'

// Paper-plane facets (viewBox 0 0 120 120, nose top-right).
const FACETS = [
  { points: '8,58 112,14 50,72', fill: '#ffffff' },
  { points: '50,72 112,14 58,108', fill: '#d9ebea' },
  { points: '50,72 58,108 42,86', fill: '#9cc5c2' },
]

/**
 * Stage 1 "fold": a sheet collapses while the plane's facets fold into place.
 * Stage 2 "fly": the plane swoops up and off-screen leaving a dashed trail.
 * Stage 3 "done": the success message appears.
 */
export default function PaperPlaneSuccess({ name, onReset }) {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState(reduce ? 'done' : 'fold')

  useEffect(() => {
    if (reduce) return
    const toFly = setTimeout(() => setStage('fly'), 1300)
    const toDone = setTimeout(() => setStage('done'), 2250)
    return () => {
      clearTimeout(toFly)
      clearTimeout(toDone)
    }
  }, [reduce])

  return (
    <div className="relative flex min-h-[460px] flex-col items-center justify-center text-center">
      <AnimatePresence>
        {stage !== 'done' && (
          <motion.div
            key="plane"
            className="relative h-40 w-40"
            aria-hidden="true"
            animate={
              stage === 'fly'
                ? { x: [0, -30, 700], y: [0, 30, -520], rotate: [0, -12, -8], scale: [1, 1.05, 0.5] }
                : { x: 0, y: 0, rotate: 0, scale: 1 }
            }
            transition={stage === 'fly' ? { duration: 1.1, times: [0, 0.2, 1], ease: 'easeIn' } : undefined}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible drop-shadow-[0_18px_22px_rgba(18,74,82,0.25)]">
              {/* The flat sheet folds away… */}
              <motion.rect
                x="20"
                y="20"
                width="80"
                height="80"
                rx="4"
                fill="#ffffff"
                stroke="#1B6E73"
                strokeOpacity="0.15"
                initial={{ opacity: 1, scaleX: 1, rotate: 0 }}
                animate={{ opacity: [1, 1, 0], scaleX: [1, 0.55, 0.1], rotate: [0, 12, 40] }}
                transition={{ duration: 0.8, times: [0, 0.5, 1], ease: 'easeInOut' }}
              />
              {/* …while each facet of the plane folds in. */}
              {FACETS.map((facet, i) => (
                <motion.polygon
                  key={facet.points}
                  points={facet.points}
                  fill={facet.fill}
                  stroke="#1B6E73"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0.2, rotate: i % 2 ? 60 : -60 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.45 + i * 0.18, type: 'spring', stiffness: 220, damping: 16 }}
                />
              ))}
            </svg>
            {stage === 'fly' && (
              <motion.span
                className="absolute top-1/2 right-full h-0.5 w-40 origin-right border-t-2 border-dashed border-brand/40"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {stage === 'fold' && (
        <p className="mt-6 text-sm font-semibold text-ink/60" aria-hidden="true">
          Folding your message…
        </p>
      )}

      <AnimatePresence>
        {stage === 'done' && (
          <motion.div
            key="message"
            role="status"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.15 }}
              className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-light/15 text-brand-light"
            >
              <CheckCircle2 size={44} aria-hidden="true" />
            </motion.span>
            <h3 className="mt-6 text-2xl font-extrabold text-ink md:text-3xl">Message sent{name ? `, ${name}` : ''}!</h3>
            <p className="mt-3 leading-relaxed text-ink/70">
              Your enquiry is on its way. One of our travel experts will get back to you within a few hours — usually much
              sooner on WhatsApp.
            </p>
            <button
              type="button"
              onClick={onReset}
              className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-brand px-6 py-3 font-semibold text-brand transition hover:scale-[1.03] hover:bg-brand hover:text-white"
            >
              <RotateCcw size={18} aria-hidden="true" /> Send another message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
