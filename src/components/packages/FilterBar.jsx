import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

/** Category pills; the active background slides between options via a shared layoutId. */
export default function FilterBar({ filters, active, onChange, counts }) {
  return (
    <div role="group" aria-label="Filter packages" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
      {filters.map((filter) => {
        const isActive = active === filter.id
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            aria-pressed={isActive}
            className={cn(
              'relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors',
              isActive ? 'text-white' : 'bg-white text-ink/70 shadow-soft hover:text-brand',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="package-filter-pill"
                className="absolute inset-0 rounded-full bg-brand shadow-lg shadow-brand/30"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">
              {filter.label}
              <span className={cn('ml-1.5 text-xs', isActive ? 'text-white/70' : 'text-ink/40')}>{counts[filter.id]}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
