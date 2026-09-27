import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'
import Plane from './Plane'

const MotionLink = motion.create(Link)

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm md:text-base',
  lg: 'px-7 py-3.5 text-base md:text-lg',
}

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
}

// On hover the plane flies out to the right, then re-enters from the left.
const planeVariants = {
  rest: { x: 0, opacity: 1, rotate: 0 },
  hover: {
    x: [0, 46, -46, 0],
    opacity: [1, 0, 0, 1],
    rotate: [0, -18, 0, 0],
    transition: { duration: 0.95, times: [0, 0.42, 0.43, 1], ease: 'easeInOut' },
  },
}

export default function BookNowButton({ to = '/contact', href, children = 'Book Now', size = 'md', className, onClick }) {
  const classes = cn(
    'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent font-semibold whitespace-nowrap text-white shadow-lg shadow-accent/30 transition-colors hover:bg-[#e67e17]',
    SIZES[size],
    className,
  )
  const content = (
    <>
      <span>{children}</span>
      <motion.span variants={planeVariants} className="inline-flex" aria-hidden="true">
        <Plane size={size === 'lg' ? 22 : 18} />
      </motion.span>
    </>
  )
  const motionProps = {
    initial: 'rest',
    animate: 'rest',
    whileHover: 'hover',
    whileFocus: 'hover',
    whileTap: { scale: 0.97 },
    variants: buttonVariants,
    className: classes,
    onClick,
  }

  if (href) {
    return (
      <motion.a href={href} target="_blank" rel="noreferrer" {...motionProps}>
        {content}
      </motion.a>
    )
  }
  return (
    <MotionLink to={to} {...motionProps}>
      {content}
    </MotionLink>
  )
}
