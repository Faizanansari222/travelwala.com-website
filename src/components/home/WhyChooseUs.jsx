import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { reasons } from '../../data/services'
import { scaleIn } from '../../lib/motion'
import Plane from '../Plane'
import { Reveal, RevealGroup, RevealItem } from '../Reveal'
import SectionTitle from '../SectionTitle'

/** Shield emblem with a plane orbiting it on a dashed ring. */
function TrustEmblem() {
  const reduce = useReducedMotion()
  return (
    <Reveal variants={scaleIn} className="relative mx-auto aspect-square w-full max-w-[420px]" aria-hidden="true">
      <div className="absolute inset-[12%] rounded-full bg-linear-to-br from-brand to-brand-dark shadow-lift" />
      <div className="absolute inset-[4%] rounded-full border-2 border-dashed border-brand/25" />
      <div className="absolute inset-[24%] rounded-full border border-white/20" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center text-white">
          <ShieldCheck size={96} strokeWidth={1.5} className="mx-auto text-accent-light" />
          <p className="mt-2 text-3xl font-extrabold">15+ Years</p>
          <p className="text-sm font-medium text-white/75">of trusted journeys</p>
        </div>
      </div>
      <motion.div
        className="absolute inset-[4%]"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-accent shadow-soft">
          <Plane size={30} />
        </span>
      </motion.div>
    </Reveal>
  )
}

export default function WhyChooseUs() {
  return (
    <section className="section-y" aria-labelledby="why-title">
      <div className="wrap grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <TrustEmblem />
        <div>
          <SectionTitle
            id="why-title"
            align="left"
            className="mb-10! md:mb-10!"
            eyebrow="Why Travel Wala"
            title="Travel with a team that has your back"
            subtitle="Thousands of families trust us with their holidays and pilgrimages. Here is why they keep coming back."
          />
          <RevealGroup as="ul" stagger={0.1} className="grid gap-5 sm:grid-cols-2">
            {reasons.map(({ title, text, icon: Icon }) => (
              <RevealItem
                as="li"
                key={title}
                className="rounded-2xl bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
