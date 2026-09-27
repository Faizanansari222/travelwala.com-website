import { motion } from 'framer-motion'
import { Building2, Bus, FileCheck2, Landmark, Plane } from 'lucide-react'
import { hotelDistances, umrahDetails } from '../../data/umrah'
import { RevealGroup, RevealItem } from '../Reveal'
import SectionTitle from '../SectionTitle'

const ICONS = { flights: Plane, hotels: Building2, transport: Bus, ziyarat: Landmark, visa: FileCheck2 }
const MAX_DISTANCE = 1000

function DistanceBars() {
  return (
    <ul className="mt-6 space-y-4" aria-label="Walking distance from the Haram by tier">
      {hotelDistances.map(({ tier, metres }, i) => (
        <li key={tier}>
          <div className="mb-1.5 flex justify-between text-sm font-semibold text-white">
            <span>{tier}</span>
            <span className="text-gold-light">≈ {metres} m</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full origin-left rounded-full bg-linear-to-r from-gold to-gold-light"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: metres / MAX_DISTANCE }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function PackageDetails() {
  return (
    <section className="section-y bg-linear-to-br from-brand-deep via-brand-dark to-brand" aria-labelledby="details-title">
      <div className="wrap">
        <SectionTitle
          id="details-title"
          light
          eyebrow="What’s Included"
          title="Every detail of your pilgrimage, handled"
          subtitle="Focus on your ibadah — we take care of the logistics from the moment you leave home."
        />
        <RevealGroup as="ul" stagger={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {umrahDetails.map((item) => {
            const Icon = ICONS[item.key]
            const isHotels = item.key === 'hotels'
            return (
              <RevealItem
                as="li"
                key={item.key}
                className={
                  isHotels
                    ? 'rounded-2xl bg-white/10 p-7 ring-1 ring-gold/40 backdrop-blur-sm md:row-span-2 lg:col-start-2 lg:row-start-1'
                    : 'rounded-2xl bg-white/5 p-7 ring-1 ring-white/10 transition duration-300 hover:scale-[1.03] hover:bg-white/10'
                }
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold-light">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-white/70">{item.text}</p>
                {isHotels && <DistanceBars />}
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
