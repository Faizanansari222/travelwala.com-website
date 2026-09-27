import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock3, MapPin, Star } from 'lucide-react'
import { formatPrice } from '../data/site'
import SmartImage from './SmartImage'

const PackageCard = forwardRef(function PackageCard({ pkg, onOpen }, ref) {
  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="list-none"
    >
      <motion.article
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition-shadow duration-500 hover:shadow-lift"
      >
        <div className="relative aspect-[16/11] overflow-hidden">
          <SmartImage
            src={pkg.image}
            alt={pkg.title}
            className="h-full w-full"
            imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/45 to-transparent" />
          <ul className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {pkg.categories.map((category) => (
              <li key={category} className="rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-bold text-brand capitalize">
                {category}
              </li>
            ))}
          </ul>
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <Clock3 size={13} aria-hidden="true" /> {pkg.duration}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="inline-flex items-center gap-1 text-ink/60">
              <MapPin size={14} aria-hidden="true" /> {pkg.location}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 font-bold text-ink">
              <Star size={15} className="fill-accent-light text-accent-light" aria-hidden="true" />
              {pkg.rating.toFixed(1)}
              <span className="font-medium text-ink/50">({pkg.reviews})</span>
            </span>
          </div>
          <h3 className="mt-2 text-xl font-bold text-ink">{pkg.title}</h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink/65">{pkg.summary}</p>

          <div className="mt-5 flex items-end justify-between gap-3 border-t border-brand/10 pt-4">
            <p>
              <span className="block text-xs text-ink/55">Starting from</span>
              <span className="text-lg font-extrabold text-brand">{formatPrice(pkg.price)}</span>
            </p>
            <button
              type="button"
              onClick={() => onOpen(pkg)}
              aria-haspopup="dialog"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              View Details
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              <span className="sr-only">for {pkg.title}</span>
            </button>
          </div>
        </div>
      </motion.article>
    </motion.li>
  )
})

export default PackageCard
