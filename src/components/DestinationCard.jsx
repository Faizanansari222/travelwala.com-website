import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/site'
import SmartImage from './SmartImage'

const MotionLink = motion.create(Link)

/** Destination card with pointer-driven 3D tilt, image zoom and price badge. */
export default function DestinationCard({ destination }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 200, damping: 18 }
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), spring)

  const onPointerMove = (event) => {
    if (reduce || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width)
    py.set((event.clientY - rect.top) / rect.height)
  }
  const onPointerLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <MotionLink
      to={`/packages`}
      aria-label={`${destination.name}, ${destination.country} from ${formatPrice(destination.price)}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-brand-dark shadow-soft transition-shadow duration-500 hover:shadow-lift"
    >
      <SmartImage
        src={destination.image}
        alt={`${destination.name}, ${destination.country}`}
        className="absolute inset-0 h-full w-full"
        imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-brand-deep/95 via-brand-deep/25 to-transparent" />

      <span className="absolute top-4 left-4 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white">
        {destination.tag}
      </span>
      <span className="absolute top-4 right-4 rounded-2xl bg-accent px-3 py-2 text-right text-white shadow-lg shadow-accent/40">
        <span className="block text-[0.65rem] font-medium tracking-wider uppercase opacity-85">From</span>
        <span className="block text-sm font-extrabold">{formatPrice(destination.price)}</span>
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: 'translateZ(40px)' }}>
        <h3 className="text-2xl font-extrabold text-white">{destination.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
          <MapPin size={15} aria-hidden="true" /> {destination.country}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85">
            <CalendarDays size={15} aria-hidden="true" /> {destination.days}
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-accent group-hover:text-white">
            <ArrowRight size={18} aria-hidden="true" />
          </span>
        </div>
      </div>
    </MotionLink>
  )
}
