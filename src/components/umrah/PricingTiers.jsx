import { motion, useReducedMotion } from 'framer-motion'
import { Check, Clock3, Crown, Hotel } from 'lucide-react'
import { formatPrice, whatsappLink } from '../../data/site'
import { umrahTiers } from '../../data/umrah'
import { cn } from '../../lib/utils'
import { RevealGroup, RevealItem } from '../Reveal'
import SectionTitle from '../SectionTitle'

function TierContent({ tier }) {
  return (
    <div className={cn('flex h-full flex-col rounded-[1.4rem] p-8', tier.popular ? 'bg-brand-deep text-white' : 'bg-white text-ink')}>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-extrabold">{tier.name}</h3>
        {tier.popular && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-brand-deep">
            <Crown size={14} aria-hidden="true" /> Most Popular
          </span>
        )}
      </div>
      <p className="mt-6">
        <span className={cn('text-4xl font-extrabold', tier.popular ? 'text-gold-light' : 'text-brand')}>{formatPrice(tier.price)}</span>
        <span className={cn('ml-1 text-sm', tier.popular ? 'text-white/60' : 'text-ink/55')}>/ person</span>
      </p>
      <div className={cn('mt-4 flex flex-wrap gap-2 text-xs font-semibold', tier.popular ? 'text-white/80' : 'text-ink/70')}>
        <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1', tier.popular ? 'bg-white/10' : 'bg-brand/5')}>
          <Clock3 size={13} aria-hidden="true" /> {tier.duration}
        </span>
        <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1', tier.popular ? 'bg-white/10' : 'bg-brand/5')}>
          <Hotel size={13} aria-hidden="true" /> {tier.hotel}
        </span>
      </div>
      <dl className={cn('mt-6 grid grid-cols-2 gap-3 rounded-2xl p-4 text-center', tier.popular ? 'bg-white/5' : 'bg-surface')}>
        <div>
          <dt className={cn('text-xs', tier.popular ? 'text-white/60' : 'text-ink/55')}>Makkah hotel</dt>
          <dd className="text-lg font-bold">{tier.makkahDistance}</dd>
        </div>
        <div>
          <dt className={cn('text-xs', tier.popular ? 'text-white/60' : 'text-ink/55')}>Madinah hotel</dt>
          <dd className="text-lg font-bold">{tier.madinahDistance}</dd>
        </div>
      </dl>
      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <Check size={18} className={cn('shrink-0', tier.popular ? 'text-gold-light' : 'text-brand-light')} aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <a
        href={whatsappLink(`Assalam o Alaikum! I'm interested in the ${tier.name} Umrah package (${formatPrice(tier.price)}).`)}
        target="_blank"
        rel="noreferrer"
        className={cn(
          'mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 font-semibold transition hover:scale-[1.03]',
          tier.popular ? 'bg-gold text-brand-deep hover:bg-gold-light' : 'bg-brand text-white hover:bg-brand-dark',
        )}
      >
        Book {tier.name}
        <span className="sr-only"> Umrah package</span>
      </a>
    </div>
  )
}

/** The popular tier gets a rotating conic-gradient border plus a breathing glow. */
function GlowingFrame({ children }) {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-full">
      <motion.div
        aria-hidden="true"
        className="absolute -inset-2 rounded-[2rem] bg-gold/40 blur-2xl"
        animate={reduce ? undefined : { opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative h-full overflow-hidden rounded-3xl p-[3px]">
        <motion.div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#C9A13B,#FFB547,#124A52,#23927A,#C9A13B)]"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  )
}

export default function PricingTiers() {
  return (
    <section id="umrah-packages" className="section-y scroll-mt-20" aria-labelledby="tiers-title">
      <div className="wrap">
        <SectionTitle
          id="tiers-title"
          eyebrow="Umrah Packages"
          title="Choose the journey that suits your family"
          subtitle="Every tier includes flights, visa, hotels and transport — the difference is comfort and closeness to the Haram."
        />
        <RevealGroup as="ul" stagger={0.14} className="grid items-stretch gap-8 lg:grid-cols-3">
          {umrahTiers.map((tier) => (
            <RevealItem as="li" key={tier.id} className={cn(tier.popular && 'lg:-translate-y-4')}>
              <motion.div
                whileHover={{ scale: 1.03, y: -6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className={cn('h-full rounded-3xl', !tier.popular && 'shadow-soft transition-shadow hover:shadow-lift')}
              >
                {tier.popular ? (
                  <GlowingFrame>
                    <TierContent tier={tier} />
                  </GlowingFrame>
                ) : (
                  <div className="h-full rounded-3xl ring-1 ring-brand/10">
                    <TierContent tier={tier} />
                  </div>
                )}
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
