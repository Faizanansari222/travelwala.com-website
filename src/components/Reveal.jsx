import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

/** Fades + slides its content up once it scrolls into view. */
export function Reveal({ as = 'div', variants = fadeUp, delay = 0, className, children, ...rest }) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </Component>
  )
}

/** Parent that staggers the reveal of every <RevealItem> inside it. */
export function RevealGroup({ as = 'div', stagger = 0.12, delay = 0, className, children, ...rest }) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </Component>
  )
}

export function RevealItem({ as = 'div', variants = fadeUp, className, children, ...rest }) {
  const Component = motion[as]
  return (
    <Component className={className} variants={variants} {...rest}>
      {children}
    </Component>
  )
}
