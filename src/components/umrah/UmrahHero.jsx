import { motion, useReducedMotion } from 'framer-motion'
import { Moon } from 'lucide-react'
import { IMAGES } from '../../data/images'
import { whatsappLink } from '../../data/site'
import PageHero from '../PageHero'
import { WhatsAppIcon } from '../SocialIcons'

/** Eight-point star outline used as a slowly rotating gold ornament. */
function StarOrnament({ className }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false" fill="none">
      <g stroke="currentColor" strokeWidth="1.2">
        <rect x="45" y="45" width="110" height="110" />
        <rect x="45" y="45" width="110" height="110" transform="rotate(45 100 100)" />
        <circle cx="100" cy="100" r="36" />
        <circle cx="100" cy="100" r="92" strokeDasharray="2 6" />
      </g>
    </svg>
  )
}

export default function UmrahHero() {
  const reduce = useReducedMotion()
  return (
    <div className="relative">
      <PageHero
        title="Answer the call with complete peace of mind"
        subtitle="Carefully planned Umrah and Hajj packages with hotels close to the Haram, trusted flights, visa processing and scholar-guided ziyarat."
        eyebrow="Umrah & Hajj 2026 – 27"
        crumb="Umrah & Hajj"
        image={IMAGES.heroUmrah}
        accent="text-gold-light"
        overlayClassName="from-[#07262b]/95 via-brand-deep/85 to-brand-dark/50"
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#umrah-packages"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-brand-deep shadow-lg shadow-gold/30 transition hover:scale-[1.03] hover:bg-gold-light"
          >
            <Moon size={18} aria-hidden="true" /> View Packages
          </a>
          <a
            href={whatsappLink('Assalam o Alaikum! I would like details about your Umrah packages.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white ring-1 ring-gold/50 transition hover:scale-[1.03] hover:bg-white/10"
          >
            <WhatsAppIcon size={20} /> Talk to a specialist
          </a>
        </div>
      </PageHero>

      <motion.div
        className="pointer-events-none absolute top-24 -right-24 w-[420px] text-gold/30 md:-right-10 md:w-[520px]"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        <StarOrnament className="h-full w-full" />
      </motion.div>
      <div className="h-1 bg-linear-to-r from-transparent via-gold to-transparent" aria-hidden="true" />
    </div>
  )
}
