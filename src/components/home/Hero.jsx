import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IMAGES } from '../../data/images'
import { EASE_OUT, fadeUp, staggerContainer } from '../../lib/motion'
import Clouds from '../Clouds'
import PathFlight from '../PathFlight'
import SmartImage from '../SmartImage'
import SearchCard from './SearchCard'

const HERO_FLIGHT = 'M-120 700 C 220 660, 420 330, 760 360 S 1180 170, 1580 90'

const headline = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
}

export default function Hero() {
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 800], [0, 220])
  const contentY = useTransform(scrollY, [0, 600], [0, -60])

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-brand-dark pt-28 pb-32 md:pb-40"
    >
      <motion.div style={{ y: bgY }} className="absolute -inset-y-32 inset-x-0 -z-30 will-change-transform">
        <SmartImage src={IMAGES.heroHome} alt="" priority className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-0 -z-20 bg-linear-to-br from-brand-deep/95 via-brand-dark/80 to-brand-light/45" />
      <Clouds className="-z-10" />
      <PathFlight
        d={HERO_FLIGHT}
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        duration={5}
        repeatDelay={3}
        delay={0.6}
        planeSize={60}
        trailWidth={2.5}
        dash="10 12"
        trailColor="rgba(255,255,255,0.7)"
      />

      <motion.div style={{ y: contentY }} className="wrap will-change-transform">
        <motion.div variants={staggerContainer(0.14, 0.25)} initial="hidden" animate="show" className="max-w-3xl">
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white ring-1 ring-white/20 sm:text-sm"
          >
            <ShieldCheck size={16} className="text-accent-light" aria-hidden="true" />
            Licensed agency · 10,000+ happy travellers
          </motion.p>
          <motion.h1
            id="hero-title"
            variants={headline}
            className="mt-6 text-[2.6rem] leading-[1.05] font-extrabold text-white sm:text-6xl lg:text-7xl"
          >
            Explore the World, <span className="text-accent-light">Travel with Trust</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            Handcrafted holidays, international tours and Umrah journeys — planned with care from Karachi, with real
            people on call 24/7 wherever you land.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/packages"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-white shadow-lg shadow-accent/30 transition hover:scale-[1.03] hover:bg-[#e67e17]"
            >
              Explore Packages
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/umrah"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/15 px-7 py-3.5 font-semibold text-white ring-1 ring-white/30 transition hover:scale-[1.03] hover:bg-white/20"
            >
              Umrah Packages
            </Link>
          </motion.div>
        </motion.div>

        <SearchCard />
      </motion.div>
    </section>
  )
}
