import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight, House } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'
import { EASE_OUT, fadeUp, staggerContainer } from '../lib/motion'
import PathFlight from './PathFlight'
import SmartImage from './SmartImage'

const HERO_ROUTE = 'M-80 300 C 200 280, 360 120, 640 150 S 1080 60, 1300 40'

/** Inner-page hero with background image, parallax, breadcrumb and a flying plane. */
export default function PageHero({ title, subtitle, image, eyebrow, crumb, children, className, overlayClassName, accent = 'text-accent-light' }) {
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 600], [0, 140])

  return (
    <section className={cn('relative isolate flex min-h-[62svh] items-end overflow-hidden bg-brand-dark pt-36 pb-16 md:min-h-[68svh] md:pb-24', className)}>
      <motion.div style={{ y: imageY }} className="absolute -inset-y-24 inset-x-0 -z-20 will-change-transform">
        <SmartImage src={image} alt="" priority className="h-full w-full" />
      </motion.div>
      <div className={cn('absolute inset-0 -z-10 bg-linear-to-t from-brand-deep/95 via-brand-dark/75 to-brand/40', overlayClassName)} />

      <PathFlight
        d={HERO_ROUTE}
        viewBox="0 0 1200 340"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        duration={5.5}
        repeatDelay={3}
        delay={0.8}
        planeSize={40}
        trailColor="rgba(255,255,255,0.55)"
      />

      <motion.div variants={staggerContainer(0.12, 0.3)} initial="hidden" animate="show" className="wrap">
        <motion.nav variants={fadeUp} aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-white/75">
            <li>
              <Link to="/" className="inline-flex items-center gap-1.5 rounded hover:text-white">
                <House size={15} aria-hidden="true" /> Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={15} />
            </li>
            <li aria-current="page" className="text-white">
              {crumb ?? title}
            </li>
          </ol>
        </motion.nav>
        {eyebrow && (
          <motion.p variants={fadeUp} className={cn('mb-3 text-xs font-bold tracking-[0.25em] uppercase', accent)}>
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } } }}
          className="max-w-3xl text-4xl leading-[1.08] font-extrabold text-white sm:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {subtitle}
          </motion.p>
        )}
        {children && <motion.div variants={fadeUp}>{children}</motion.div>}
      </motion.div>
    </section>
  )
}
