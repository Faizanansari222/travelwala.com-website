import { useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Mail, Phone, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { NAV_LINKS, SITE } from '../data/site'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { cn } from '../lib/utils'
import BookNowButton from './BookNowButton'
import Logo from './Logo'
import Plane from './Plane'

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
}

export default function MobileMenu({ id, open, onClose }) {
  const panelRef = useRef(null)
  const reduce = useReducedMotion()
  useLockBodyScroll(open)
  useFocusTrap(panelRef, open, onClose)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          tabIndex={-1}
          initial={{ opacity: 0, y: '-100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-linear-to-br from-brand-deep via-brand-dark to-brand text-white lg:hidden"
        >
          {/* A small plane crossing the top of the menu */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute top-22 left-0 flex items-center text-accent-light"
              initial={{ x: '-20vw' }}
              animate={{ x: '110vw' }}
              transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
            >
              <span className="h-px w-24 border-t-2 border-dashed border-white/40" />
              <Plane size={26} />
            </motion.div>
          )}

          <div className="wrap flex h-18 items-center justify-between">
            <Logo onClick={onClose} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="wrap mt-14 flex-1">
            <motion.ul variants={listVariants} initial="hidden" animate="show" className="space-y-2">
              {NAV_LINKS.map((link, i) => (
                <motion.li key={link.to} variants={itemVariants}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-baseline gap-4 rounded-xl py-2 text-3xl font-extrabold transition-colors sm:text-4xl',
                        isActive ? 'text-accent-light' : 'text-white hover:text-accent-light',
                      )
                    }
                  >
                    <span className="text-sm font-semibold text-white/40">0{i + 1}</span>
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.55 } }}
            className="wrap space-y-4 pt-10 pb-10"
          >
            <BookNowButton size="lg" onClick={onClose} className="w-full sm:w-auto" />
            <div className="flex flex-col gap-2 text-sm text-white/75 sm:flex-row sm:gap-6">
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2 hover:text-white">
                <Phone size={16} aria-hidden="true" /> {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail size={16} aria-hidden="true" /> {SITE.email}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
