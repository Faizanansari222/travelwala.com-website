import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { Award, Globe2, Star, Users } from 'lucide-react'
import { STATS } from '../data/site'
import { RevealGroup, RevealItem } from './Reveal'

const ICONS = { users: Users, globe: Globe2, award: Award, star: Star }

const format = (value, decimals) =>
  value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

function Stat({ value, decimals = 0, suffix = '', label, icon }) {
  const ref = useRef(null)
  const numberRef = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const Icon = ICONS[icon]

  useEffect(() => {
    if (!inView || !numberRef.current) return
    if (reduce) {
      numberRef.current.textContent = format(value, decimals)
      return
    }
    // Write straight to the DOM so counting never re-renders React.
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (numberRef.current) numberRef.current.textContent = format(latest, decimals)
      },
    })
    return () => controls.stop()
  }, [inView, reduce, value, decimals])

  return (
    <RevealItem className="flex flex-col items-center text-center">
      <span ref={ref} className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-accent-light ring-1 ring-white/15">
        <Icon size={26} aria-hidden="true" />
      </span>
      <p className="text-4xl font-extrabold text-white md:text-5xl">
        <span className="sr-only">
          {format(value, decimals)}
          {suffix} {label}
        </span>
        <span aria-hidden="true">
          <span ref={numberRef}>{format(0, decimals)}</span>
          <span className="text-accent-light">{suffix}</span>
        </span>
      </p>
      <p className="mt-2 text-sm font-medium text-white/75 md:text-base" aria-hidden="true">
        {label}
      </p>
    </RevealItem>
  )
}

export default function StatsCounter() {
  return (
    <section aria-label="Travel Wala in numbers" className="wrap relative z-10 -mt-16 md:-mt-20">
      <RevealGroup
        stagger={0.12}
        className="grid grid-cols-2 gap-x-6 gap-y-10 rounded-3xl bg-linear-to-br from-brand to-brand-dark px-6 py-10 shadow-lift md:grid-cols-4 md:px-10 md:py-12"
      >
        {STATS.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </RevealGroup>
    </section>
  )
}
