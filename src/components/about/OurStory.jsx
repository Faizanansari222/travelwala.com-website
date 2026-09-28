import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { IMAGES } from '../../data/images'
import { RevealGroup, RevealItem } from '../Reveal'
import SectionTitle from '../SectionTitle'
import SmartImage from '../SmartImage'

const HIGHLIGHTS = ['Government-licensed since 2013', 'In-house Umrah & visa experts', 'Transparent, all-inclusive pricing']

export default function OurStory() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yMain = useTransform(scrollYProgress, [0, 1], [40, -40])
  const yTop = useTransform(scrollYProgress, [0, 1], [90, -90])
  const yBottom = useTransform(scrollYProgress, [0, 1], [-30, 70])

  return (
    <section ref={ref} className="section-y" aria-labelledby="story-title">
      <div className="wrap grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionTitle
            id="story-title"
            align="left"
            className="mb-8! md:mb-8!"
            eyebrow="Our Story"
            title="From a two-desk office to 10,000+ journeys"
          />
          <RevealGroup stagger={0.12} className="space-y-4 leading-relaxed text-ink/75">
            <RevealItem as="p">
              Travel Wala began in 2010 in a small Karachi office with a simple promise: honest advice and zero hidden
              charges. Word spread from family to family, and one ticket became thousands.
            </RevealItem>
            <RevealItem as="p">
              Today our team plans everything from weekend escapes up north to month-long family holidays abroad and
              once-in-a-lifetime Umrah journeys — yet we still answer every WhatsApp message like it came from a friend.
            </RevealItem>
            <RevealItem as="ul" className="space-y-3 pt-2">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3 font-semibold text-ink">
                  <CheckCircle2 size={20} className="shrink-0 text-brand-light" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </RevealItem>
          </RevealGroup>
        </div>

        <div className="relative mx-auto h-[440px] w-full max-w-lg sm:h-[520px]">
          <motion.div style={{ y: yMain }} className="will-change-transform absolute inset-y-8 right-0 left-[14%] overflow-hidden rounded-3xl shadow-lift">
            <SmartImage src={IMAGES.storyMain} alt="Mountain lake at sunrise" className="h-full w-full" />
          </motion.div>
          <motion.div
            style={{ y: yTop }}
            className="absolute top-0 left-0 h-40 w-36 will-change-transform overflow-hidden rounded-2xl border-4 border-surface shadow-lift sm:h-48 sm:w-44"
          >
            <SmartImage src={IMAGES.storyTop} alt="Temple gate in Bali" className="h-full w-full" />
          </motion.div>
          <motion.div
            style={{ y: yBottom }}
            className="absolute bottom-0 left-[4%] h-36 w-48 will-change-transform overflow-hidden rounded-2xl border-4 border-surface shadow-lift sm:h-44 sm:w-56"
          >
            <SmartImage src={IMAGES.storyBottom} alt="Swiss Alps village" className="h-full w-full" />
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.3 }}
            className="absolute top-10 -right-2 rounded-2xl bg-accent px-5 py-4 text-white shadow-glow sm:-right-6"
          >
            <p className="text-3xl font-extrabold">15+</p>
            <p className="text-xs font-semibold tracking-wide uppercase">Years flying</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
