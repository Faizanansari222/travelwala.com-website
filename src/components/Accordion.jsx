import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '../lib/utils'

/**
 * Accessible accordion. `items` = [{ title, content, meta? }].
 * Only one panel is open at a time; `defaultOpen` sets the initially open index.
 */
export default function Accordion({ items, defaultOpen = 0, variant = 'light', className }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)
  const baseId = useId()

  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item, index) => {
        const open = openIndex === index
        const buttonId = `${baseId}-button-${index}`
        const panelId = `${baseId}-panel-${index}`
        return (
          <li
            key={index}
            className={cn(
              'overflow-hidden rounded-2xl border transition-colors duration-300',
              variant === 'light' ? 'border-brand/10 bg-white' : 'border-white/10 bg-white/5',
              open && (variant === 'light' ? 'border-brand/25 shadow-soft' : 'border-gold/40'),
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? -1 : index)}
                className={cn(
                  'flex w-full items-center gap-4 px-5 py-4 text-left text-base font-semibold md:px-6 md:text-lg',
                  variant === 'light' ? 'text-ink' : 'text-white',
                )}
              >
                {item.meta && (
                  <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">{item.meta}</span>
                )}
                <span className="flex-1">{item.title}</span>
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full',
                    open ? 'bg-accent text-white' : variant === 'light' ? 'bg-brand/10 text-brand' : 'bg-white/10 text-white',
                  )}
                  aria-hidden="true"
                >
                  <Plus size={18} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={cn(
                      'px-5 pb-5 text-sm leading-relaxed md:px-6 md:text-base',
                      variant === 'light' ? 'text-ink/75' : 'text-white/75',
                    )}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
