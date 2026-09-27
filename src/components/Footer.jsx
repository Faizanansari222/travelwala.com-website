import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NAV_LINKS, SITE } from '../data/site'
import { services } from '../data/services'
import Logo from './Logo'
import PathFlight from './PathFlight'
import { SocialLinks } from './SocialIcons'

const FOOTER_ROUTE = 'M-40 34 C 150 8, 300 58, 480 32 S 800 6, 980 30 S 1150 50, 1240 26'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const onSubmit = (event) => {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error')
      return
    }
    setStatus('success')
    setEmail('')
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-4">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex overflow-hidden rounded-full bg-white/10 p-1 ring-1 ring-white/15 focus-within:ring-2 focus-within:ring-accent">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setStatus('idle')
          }}
          placeholder="Your email"
          aria-invalid={status === 'error'}
          aria-describedby="newsletter-status"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/50 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Subscribe to newsletter"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white transition hover:scale-105 hover:bg-accent-light"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </div>
      <p id="newsletter-status" aria-live="polite" className="mt-2 min-h-5 text-xs">
        <AnimatePresence mode="wait">
          {status === 'success' && (
            <motion.span key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-accent-light">
              You’re on board! Deals are coming your way.
            </motion.span>
          )}
          {status === 'error' && (
            <motion.span key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-300">
              Please enter a valid email address.
            </motion.span>
          )}
        </AnimatePresence>
      </p>
    </form>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-brand-dark to-brand-deep text-white/80">
      <PathFlight
        d={FOOTER_ROUTE}
        viewBox="0 0 1200 60"
        preserveAspectRatio="xMidYMid slice"
        className="h-12 w-full"
        duration={9}
        repeatDelay={0.6}
        trail={false}
        track
        trailColor="rgba(255,255,255,0.6)"
        trailWidth={1.5}
        dash="4 8"
        planeSize={22}
        planeColor="#FFB547"
      />

      <div className="wrap grid gap-12 pt-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <Logo />
          <p className="mt-4 text-lg font-semibold text-white">{SITE.tagline}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">
            Licensed travel experts crafting holidays, tours and sacred journeys from Karachi since 2010.
          </p>
          <SocialLinks links={SITE.socials} className="mt-6" itemClassName="bg-white/10 text-white hover:bg-accent" />
        </div>

        <nav aria-label="Footer quick links">
          <h2 className="text-base font-bold text-white">Quick Links</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition hover:pl-1 hover:text-accent-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-base font-bold text-white">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((service) => (
              <li key={service.title}>{service.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-white">Get in Touch</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-accent-light" aria-hidden="true" />
              <address className="not-italic">{SITE.address}</address>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="shrink-0 text-accent-light" aria-hidden="true" />
              <a href={SITE.phoneHref} className="hover:text-white">
                {SITE.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="shrink-0 text-accent-light" aria-hidden="true" />
              <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">
                {SITE.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="shrink-0 text-accent-light" aria-hidden="true" />
              {SITE.hours}
            </li>
          </ul>
          <h3 className="mt-6 text-sm font-bold text-white">Get travel deals first</h3>
          <Newsletter />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/60 sm:flex-row">
          <p>© {year} Travel Wala. All rights reserved.</p>
          <p>Designed with ♥ for curious travellers.</p>
        </div>
      </div>
    </footer>
  )
}
