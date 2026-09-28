import { motion, useReducedMotion } from 'framer-motion'
import { whatsappLink } from '../data/site'
import { WhatsAppIcon } from './SocialIcons'

export default function WhatsAppButton() {
  const reduce = useReducedMotion()
  return (
    <motion.a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Travel Wala on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-4 bottom-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 sm:right-6 sm:bottom-6"
    >
      {!reduce &&
        [0, 1].map((ring) => (
          <span
            key={ring}
            aria-hidden="true"
            className="absolute inset-0 animate-ring rounded-full bg-whatsapp"
            style={{ animationDelay: `${ring}s` }}
          />
        ))}
      <WhatsAppIcon size={30} className="relative" />
    </motion.a>
  )
}
