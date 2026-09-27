import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../data/site'
import { useScrolled } from '../hooks/useScrollProgress'
import { cn } from '../lib/utils'
import BookNowButton from './BookNowButton'
import Logo from './Logo'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const scrolled = useScrolled(40)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-500',
          scrolled
            ? 'border-transparent bg-brand shadow-lg shadow-brand-dark/25'
            : 'border-white/10 bg-white/10 backdrop-blur-md',
        )}
      >
        <div className="wrap flex h-18 items-center justify-between gap-6 md:h-20">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'relative block rounded-full px-4 py-2 text-[0.95rem] font-semibold transition-colors',
                        isActive ? 'text-white' : 'text-white/80 hover:text-white',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            className="absolute inset-x-4 -bottom-0.5 h-[3px] rounded-full bg-accent"
                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <BookNowButton />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 lg:hidden"
            >
              <Menu aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu id="mobile-menu" open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
