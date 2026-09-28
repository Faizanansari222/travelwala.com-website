import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { testimonials } from '../data/testimonials'
import { cn } from '../lib/utils'
import { Reveal } from './Reveal'
import SectionTitle from './SectionTitle'

const INTERVAL = 6000

const slide = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -80 : 80 }),
}

function Stars({ rating }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={18}
          aria-hidden="true"
          className={i < Math.round(rating) ? 'fill-accent-light text-accent-light' : 'text-ink/20'}
        />
      ))}
    </div>
  )
}

function SlideContent({ testimonial }) {
  return (
    <>
      <Stars rating={testimonial.rating} />
      <blockquote className="mt-5 text-lg leading-relaxed font-medium text-ink md:text-2xl md:leading-relaxed">
        “{testimonial.quote}”
      </blockquote>
      <div className="mt-8 flex items-center gap-4">
        <img
          src={testimonial.photo}
          alt={testimonial.name}
          loading="lazy"
          width="56"
          height="56"
          draggable="false"
          className="h-14 w-14 rounded-full object-cover ring-4 ring-accent/20"
        />
        <div>
          <p className="font-bold text-ink">{testimonial.name}</p>
          <p className="text-sm text-ink/60">
            {testimonial.location} · {testimonial.trip}
          </p>
        </div>
      </div>
    </>
  )
}

export default function Testimonials() {
  const [[index, direction], setState] = useState([0, 1])
  const [paused, setPaused] = useState(false)
  const current = testimonials[index]

  const go = useCallback((step) => {
    setState(([i]) => [(i + step + testimonials.length) % testimonials.length, step])
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), INTERVAL)
    return () => clearInterval(id)
  }, [paused, go, index])

  return (
    <section className="section-y" aria-labelledby="testimonials-title">
      <div className="wrap">
        <SectionTitle
          id="testimonials-title"
          eyebrow="Traveller Stories"
          title="Memories our travellers still talk about"
          subtitle="Real journeys, real smiles — a few words from the families and friends who flew with us."
        />

        <Reveal
          className="relative mx-auto max-w-4xl"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative grid overflow-hidden rounded-3xl bg-white p-8 shadow-soft md:p-12">
            <Quote size={90} className="absolute -top-2 right-6 text-brand/5" aria-hidden="true" />
            {/* Invisible copies of every quote share one grid cell, so the card is always as tall
                as the longest quote — the page never changes height as slides rotate. */}
            {testimonials.map((t) => (
              <div key={t.name} className="invisible col-start-1 row-start-1" aria-hidden="true">
                <SlideContent testimonial={t} />
              </div>
            ))}
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.figure
                key={index}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1)
                  else if (info.offset.x > 80) go(-1)
                }}
                className="relative col-start-1 row-start-1 cursor-grab active:cursor-grabbing"
                aria-live={paused ? 'polite' : 'off'}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${testimonials.length}`}
              >
                <SlideContent testimonial={current} />
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex gap-2" role="group" aria-label="Choose testimonial">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-current={i === index}
                  className="grid h-6 place-items-center"
                >
                  <span
                    className={cn(
                      'block h-2 rounded-full transition-all duration-500',
                      i === index ? 'w-8 bg-accent' : 'w-2 bg-brand/25 hover:bg-brand/50',
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-brand shadow-soft transition hover:scale-105 hover:bg-brand hover:text-white"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white shadow-soft transition hover:scale-105 hover:bg-brand-dark"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
