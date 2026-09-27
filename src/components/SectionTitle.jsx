import { cn } from '../lib/utils'
import Plane from './Plane'
import { RevealGroup, RevealItem } from './Reveal'

export default function SectionTitle({ eyebrow, title, subtitle, align = 'center', light = false, className, id }) {
  const centered = align === 'center'
  return (
    <RevealGroup
      className={cn('mb-12 max-w-2xl md:mb-16', centered ? 'mx-auto text-center' : 'text-left', className)}
      stagger={0.1}
    >
      {eyebrow && (
        <RevealItem
          as="p"
          className={cn(
            'mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase',
            light ? 'text-accent-light' : 'text-accent',
          )}
        >
          <Plane size={16} className="-rotate-12" />
          {eyebrow}
        </RevealItem>
      )}
      <RevealItem
        as="h2"
        id={id}
        className={cn('text-3xl leading-tight font-extrabold md:text-4xl lg:text-[2.75rem]', light ? 'text-white' : 'text-ink')}
      >
        {title}
      </RevealItem>
      {subtitle && (
        <RevealItem as="p" className={cn('mt-4 text-base leading-relaxed md:text-lg', light ? 'text-white/75' : 'text-ink/70')}>
          {subtitle}
        </RevealItem>
      )}
    </RevealGroup>
  )
}
