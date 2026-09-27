import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'
import { team } from '../../data/team'
import { SITE } from '../../data/site'
import { RevealGroup, RevealItem } from '../Reveal'
import SectionTitle from '../SectionTitle'
import { SocialLinks } from '../SocialIcons'

const faceStyle = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }

/** Flips on hover (desktop), on keyboard focus, and on tap (touch). */
function TeamCard({ member }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="group aspect-[3/4] [perspective:1200px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFlipped(false)
      }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={`${member.name}, ${member.role}. Show bio`}
          className="absolute inset-0 overflow-hidden rounded-2xl text-left shadow-soft"
          style={faceStyle}
        >
          <img src={member.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-brand-deep/90 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-lg font-bold text-white">{member.name}</p>
            <p className="text-sm font-medium text-accent-light">{member.role}</p>
          </div>
          <span className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur" aria-hidden="true">
            <RotateCw size={16} />
          </span>
        </button>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-linear-to-br from-brand to-brand-dark p-6 text-white shadow-lift"
          style={{ ...faceStyle, transform: 'rotateY(180deg)' }}
          aria-hidden={!flipped}
        >
          <div>
            <img src={member.photo} alt="" loading="lazy" className="h-16 w-16 rounded-full object-cover ring-4 ring-white/20" />
            <p className="mt-4 text-lg font-bold">{member.name}</p>
            <p className="text-sm font-medium text-accent-light">{member.role}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/80">{member.bio}</p>
          </div>
          <SocialLinks
            links={SITE.socials.slice(0, 3)}
            itemClassName="bg-white/10 text-white hover:bg-accent"
            className={flipped ? '' : 'invisible'}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default function Team() {
  return (
    <section className="section-y pt-0 md:pt-0" aria-labelledby="team-title">
      <div className="wrap">
        <SectionTitle
          id="team-title"
          eyebrow="Meet the Crew"
          title="The people behind your journeys"
          subtitle="Hover, tap or tab onto a card to learn a little more about each of us."
        />
        <RevealGroup as="ul" stagger={0.12} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <RevealItem as="li" key={member.name}>
              <TeamCard member={member} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
