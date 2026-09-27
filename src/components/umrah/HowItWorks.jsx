import { motion } from 'framer-motion'
import { umrahSteps } from '../../data/umrah'
import { RevealGroup, RevealItem } from '../Reveal'
import SectionTitle from '../SectionTitle'

/** Dashed connector that grows into view (scale) and then "marches" continuously. */
function Connector({ vertical = false }) {
  return (
    <motion.div
      aria-hidden="true"
      className={
        vertical
          ? 'absolute top-8 bottom-8 left-8 w-1 -translate-x-1/2 origin-top md:hidden'
          : 'absolute top-8 left-[12.5%] hidden h-1 w-[75%] -translate-y-1/2 origin-left md:block'
      }
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <svg className="h-full w-full" preserveAspectRatio="none" viewBox={vertical ? '0 0 4 100' : '0 0 100 4'} focusable="false">
        <line
          x1={vertical ? 2 : 0}
          y1={vertical ? 0 : 2}
          x2={vertical ? 2 : 100}
          y2={vertical ? 100 : 2}
          stroke="var(--color-gold)"
          strokeWidth="3"
          strokeDasharray="8 8"
          vectorEffect="non-scaling-stroke"
          className="animate-dash"
        />
      </svg>
    </motion.div>
  )
}

export default function HowItWorks() {
  return (
    <section className="section-y" aria-labelledby="how-title">
      <div className="wrap">
        <SectionTitle
          id="how-title"
          eyebrow="How It Works"
          title="Four simple steps to the Haram"
          subtitle="A clear, guided process — no confusing paperwork, no last-minute surprises."
        />
        <div className="relative">
          <Connector />
          <Connector vertical />
          <RevealGroup as="ol" stagger={0.2} className="relative grid gap-10 md:grid-cols-4 md:gap-6">
            {umrahSteps.map((step, i) => (
              <RevealItem as="li" key={step.title} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
                <motion.span
                  whileHover={{ scale: 1.1, rotate: -6 }}
                  className="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-brand to-brand-dark text-2xl font-extrabold text-gold-light shadow-lift ring-4 ring-surface"
                >
                  {i + 1}
                </motion.span>
                <div>
                  <h3 className="text-lg font-bold text-ink md:mt-5">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
