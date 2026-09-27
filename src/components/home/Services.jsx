import { motion } from 'framer-motion'
import { services } from '../../data/services'
import { RevealGroup, RevealItem } from '../Reveal'
import SectionTitle from '../SectionTitle'

export default function Services() {
  return (
    <section className="section-y" aria-labelledby="services-title">
      <div className="wrap">
        <SectionTitle
          id="services-title"
          eyebrow="What We Do"
          title="Everything your journey needs, under one roof"
          subtitle="From the first ticket to the last transfer home, one team takes care of it all."
        />
        <RevealGroup as="ul" stagger={0.09} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, text, icon: Icon }) => (
            <RevealItem as="li" key={title}>
              <motion.article
                whileHover="hover"
                initial="rest"
                animate="rest"
                variants={{ rest: { y: 0, scale: 1 }, hover: { y: -6, scale: 1.03 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-2xl bg-white p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift"
              >
                <span className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent/5 transition-transform duration-700 group-hover:scale-[2.2]" />
                <motion.span
                  variants={{ rest: { rotate: 0 }, hover: { rotate: -8, scale: 1.1 } }}
                  className="relative grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-brand to-brand-dark text-white shadow-lg shadow-brand/30"
                >
                  <Icon size={26} aria-hidden="true" />
                </motion.span>
                <h3 className="relative mt-6 text-xl font-bold text-ink">{title}</h3>
                <p className="relative mt-2 leading-relaxed text-ink/65">{text}</p>
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-linear-to-r from-accent to-accent-light transition-transform duration-500 group-hover:scale-x-100" />
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
