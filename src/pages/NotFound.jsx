import { motion } from 'framer-motion'
import { Compass, House } from 'lucide-react'
import { Link } from 'react-router-dom'
import Clouds from '../components/Clouds'
import PathFlight from '../components/PathFlight'
import Seo from '../components/Seo'

// A wobbly figure-eight: the plane circles, clearly lost.
const LOST_ROUTE =
  'M200 100 C 250 30, 340 30, 340 100 S 250 170, 200 100 S 150 30, 90 40 S 30 140, 90 160 S 170 140, 200 100'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="This flight seems to have lost its way. Head back home to find your next journey with Travel Wala." />
      <section className="relative isolate flex min-h-svh items-center overflow-hidden bg-linear-to-br from-brand-deep via-brand-dark to-brand pt-28 pb-20 text-center text-white">
        <Clouds className="-z-10" />
        <div className="wrap">
          <div className="relative mx-auto max-w-2xl">
            <p
              className="pointer-events-none text-[9rem] leading-none font-extrabold text-white/10 select-none sm:text-[13rem]"
              aria-hidden="true"
            >
              404
            </p>
            <PathFlight
              d={LOST_ROUTE}
              viewBox="0 0 400 200"
              className="absolute inset-0 m-auto h-full w-full"
              duration={6}
              repeatDelay={0.8}
              planeSize={30}
              trailColor="rgba(255,181,71,0.85)"
              hidePlaneWhenReduced={false}
            />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">Oops — this flight got lost</h1>
            <p className="mx-auto mt-4 max-w-md text-white/75">
              The page you’re looking for has taken off without us. Let’s get you back on course.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-white shadow-lg shadow-accent/30 transition hover:scale-[1.03]"
              >
                <House size={18} aria-hidden="true" /> Back to Home
              </Link>
              <Link
                to="/packages"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold ring-1 ring-white/30 transition hover:scale-[1.03] hover:bg-white/10"
              >
                <Compass size={18} aria-hidden="true" /> Explore Packages
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
