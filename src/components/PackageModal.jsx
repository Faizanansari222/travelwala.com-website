import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Clock3, MapPin, Star, X } from 'lucide-react'
import { formatPrice, whatsappLink } from '../data/site'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import Accordion from './Accordion'
import SmartImage from './SmartImage'
import { WhatsAppIcon } from './SocialIcons'

function ModalBody({ pkg, onClose }) {
  const dialogRef = useRef(null)
  useFocusTrap(dialogRef, true, onClose)
  const titleId = `pkg-title-${pkg.id}`

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.1 } }}
    >
      <div className="absolute inset-0 bg-brand-deep/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-lenis-prevent
        initial={{ opacity: 0, y: 80, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="relative max-h-[92svh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl"
      >
        <div className="relative h-56 sm:h-72">
          <SmartImage src={pkg.image} alt={pkg.title} className="h-full w-full" />
          <div className="absolute inset-0 bg-linear-to-t from-brand-deep/90 via-brand-deep/20 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close package details"
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition hover:rotate-90 hover:bg-white"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h2 id={titleId} className="text-2xl font-extrabold text-white sm:text-3xl">
              {pkg.title}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} aria-hidden="true" /> {pkg.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={15} aria-hidden="true" /> {pkg.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star size={15} className="fill-accent-light text-accent-light" aria-hidden="true" /> {pkg.rating.toFixed(1)} ({pkg.reviews}{' '}
                reviews)
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          <p className="text-ink/75">{pkg.summary}</p>

          <section aria-labelledby={`${titleId}-itinerary`}>
            <h3 id={`${titleId}-itinerary`} className="mb-4 text-lg font-bold text-ink">
              Day-wise itinerary
            </h3>
            <Accordion items={pkg.itinerary.map((d) => ({ meta: d.day, title: d.title, content: d.details }))} />
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="rounded-2xl bg-brand/5 p-5">
              <h3 className="mb-3 font-bold text-ink">What’s included</h3>
              <ul className="space-y-2 text-sm text-ink/80">
                {pkg.inclusions.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check size={17} className="mt-0.5 shrink-0 text-brand-light" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl bg-accent/5 p-5">
              <h3 className="mb-3 font-bold text-ink">Not included</h3>
              <ul className="space-y-2 text-sm text-ink/80">
                {pkg.exclusions.map((item) => (
                  <li key={item} className="flex gap-2">
                    <X size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col items-start justify-between gap-4 border-t border-brand/10 bg-white/95 px-6 py-4 backdrop-blur sm:flex-row sm:items-center sm:px-8">
          <p>
            <span className="block text-xs text-ink/55">Per person, starting from</span>
            <span className="text-2xl font-extrabold text-brand">{formatPrice(pkg.price)}</span>
          </p>
          <a
            href={whatsappLink(`Hi Travel Wala! I'm interested in the "${pkg.title}" package (${pkg.duration}). Please share availability.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-white shadow-lg shadow-whatsapp/30 transition hover:scale-[1.03] sm:w-auto"
          >
            <WhatsAppIcon size={20} /> Book on WhatsApp
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PackageModal({ pkg, onClose }) {
  useLockBodyScroll(Boolean(pkg))
  return <AnimatePresence>{pkg && <ModalBody key={pkg.id} pkg={pkg} onClose={onClose} />}</AnimatePresence>
}
