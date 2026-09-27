// Shared Framer Motion variants so every section reveals the same way.
export const EASE_OUT = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT = [0.76, 0, 0.24, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE_OUT } },
}

export const staggerContainer = (stagger = 0.12, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
})

export const viewportOnce = { once: true, amount: 0.2 }

export const hoverLift = {
  whileHover: { scale: 1.03, y: -4 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
}
