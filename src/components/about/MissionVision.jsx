import { motion } from 'framer-motion'
import { pillars } from '../../data/about'
import { RevealGroup, RevealItem } from '../Reveal'
import SectionTitle from '../SectionTitle'

export default function MissionVision() {
  return (
    <section className="section-y relative overflow-hidden bg-linear-to-br from-brand to-brand-dark" aria-labelledby="mvv-title">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-light/30 blur-3xl" aria-hidden="true" />
      <div className="wrap relative">
        <SectionTitle
          id="mvv-title"
          light
          eyebrow="What Drives Us"
          title="Mission, vision & values"
          subtitle="Three ideas guide every itinerary we build and every call we answer."
        />
        <RevealGroup as="ul" stagger={0.14} className="grid gap-6 md:grid-cols-3">
          {pillars.map(({ title, text, icon: Icon }, i) => (
            <RevealItem as="li" key={title}>
              <motion.article
                whileHover={{ scale: 1.03, y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative h-full rounded-2xl bg-white/10 p-8 text-white ring-1 ring-white/15 backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                <span className="absolute top-6 right-6 text-5xl font-extrabold text-white/10">0{i + 1}</span>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-white shadow-glow">
                  <Icon size={26} aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-white/75">{text}</p>
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
