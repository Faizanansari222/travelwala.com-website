import { useRef } from 'react'
import { motion, useReducedMotion, useTransform } from 'framer-motion'
import { milestones } from '../../data/about'
import { useElementSize } from '../../hooks/useElementSize'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { cn } from '../../lib/utils'
import { EASE_OUT } from '../../lib/motion'
import Plane from '../Plane'
import SectionTitle from '../SectionTitle'

function Milestone({ milestone, index }) {
  const onLeft = index % 2 === 0
  return (
    <li className="relative grid grid-cols-[3rem_1fr] md:grid-cols-[1fr_4rem_1fr]">
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -35% 0px' }}
        transition={{ type: 'spring', stiffness: 400, damping: 16 }}
        className="relative z-10 col-start-1 row-start-1 mt-6 h-5 w-5 justify-self-center rounded-full border-4 border-surface bg-accent shadow-glow md:col-start-2"
        aria-hidden="true"
      />
      <motion.article
        initial={{ opacity: 0, x: onLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className={cn(
          'col-start-2 row-start-1 mb-10 rounded-2xl bg-white p-6 shadow-soft transition duration-300 hover:scale-[1.03] hover:shadow-lift',
          onLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-3',
        )}
      >
        <p className="text-sm font-extrabold tracking-widest text-accent">{milestone.year}</p>
        <h3 className="mt-1 text-xl font-bold text-ink">{milestone.title}</h3>
        <p className="mt-2 leading-relaxed text-ink/65">{milestone.text}</p>
      </motion.article>
    </li>
  )
}

/** Vertical milestone timeline whose line draws with scroll, with a plane riding the tip. */
export default function Timeline() {
  const listRef = useRef(null)
  const reduce = useReducedMotion()
  const { height } = useElementSize(listRef)
  const progress = useScrollProgress(listRef, ['start 70%', 'end 60%'])
  const lineScale = reduce ? 1 : progress
  const planeY = useTransform(progress, (v) => v * height)

  return (
    <section className="section-y" aria-labelledby="timeline-title">
      <div className="wrap">
        <SectionTitle
          id="timeline-title"
          eyebrow="Our Journey"
          title="Milestones along the way"
          subtitle="Fifteen years, thousands of boarding passes and one promise that has never changed."
        />
        <div className="relative mx-auto max-w-5xl">
          {/* Track + animated line (scaleY only, so it stays on the compositor) */}
          <div className="absolute inset-y-0 left-6 w-1 -translate-x-1/2 rounded-full bg-brand/10 md:left-1/2" aria-hidden="true">
            <motion.div
              style={{ scaleY: lineScale }}
              className="h-full w-full origin-top rounded-full bg-linear-to-b from-brand-light via-brand to-accent"
            />
            {!reduce && (
              <motion.div style={{ y: planeY }} className="absolute top-0 left-1/2 -translate-x-1/2">
                <span className="-mt-5 grid h-10 w-10 place-items-center rounded-full bg-white text-accent shadow-soft">
                  <Plane size={24} className="rotate-90" />
                </span>
              </motion.div>
            )}
          </div>

          <ol ref={listRef} className="relative">
            {milestones.map((milestone, index) => (
              <Milestone key={milestone.year} milestone={milestone} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
