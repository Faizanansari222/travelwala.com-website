import { forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

const fieldBase =
  'peer block w-full rounded-xl border-2 bg-white px-4 pt-6 pb-2 text-ink transition-colors focus:outline-none focus:ring-4'

/**
 * Input / textarea / select with a floating label and inline validation message.
 * Works with react-hook-form's `register()` (ref is forwarded).
 */
const FloatingField = forwardRef(function FloatingField(
  { id, label, as = 'input', error, options = [], className, rows = 5, ...rest },
  ref,
) {
  const errorId = `${id}-error`
  const stateClasses = error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
    : 'border-brand/15 hover:border-brand/30 focus:border-brand focus:ring-brand/10'
  const shared = {
    id,
    ref,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
    ...rest,
  }

  return (
    <div className={cn('relative', className)}>
      {as === 'select' ? (
        <>
          <select {...shared} className={cn(fieldBase, stateClasses, 'appearance-none pr-10')}>
            <option value="">Choose a service…</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink/50" aria-hidden="true" />
          <label htmlFor={id} className="pointer-events-none absolute top-2 left-4 text-xs font-semibold text-brand">
            {label}
          </label>
        </>
      ) : (
        <>
          {as === 'textarea' ? (
            <textarea {...shared} rows={rows} placeholder=" " className={cn(fieldBase, stateClasses, 'resize-y')} />
          ) : (
            <input {...shared} placeholder=" " className={cn(fieldBase, stateClasses)} />
          )}
          <label
            htmlFor={id}
            className={cn(
              'pointer-events-none absolute left-4 origin-left font-medium transition-all duration-200',
              'top-2 text-xs font-semibold text-brand',
              'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-ink/50',
              'peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-brand',
            )}
          >
            {label}
          </label>
        </>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-1.5 pl-1 text-sm font-medium text-red-600"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
})

export default FloatingField
