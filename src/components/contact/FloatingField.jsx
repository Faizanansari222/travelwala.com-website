import { forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { formFieldClass } from '../ui/styles'

/**
 * Input or textarea with a floating label and inline validation message.
 * Works with react-hook-form's `register()` (ref is forwarded).
 * For dropdowns use <Select variant="form"> from components/ui.
 */
const FloatingField = forwardRef(function FloatingField({ id, label, as = 'input', error, className, rows = 5, ...rest }, ref) {
  const errorId = `${id}-error`
  const shared = {
    id,
    ref,
    placeholder: ' ',
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
    className: cn('peer', formFieldClass(error), as === 'textarea' && 'resize-y'),
    ...rest,
  }

  return (
    <div className={cn('relative', className)}>
      {as === 'textarea' ? <textarea {...shared} rows={rows} /> : <input {...shared} />}
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute top-2 left-4 text-xs font-semibold text-brand transition-all duration-200',
          'peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-ink/50',
          'peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-brand',
        )}
      >
        {label}
      </label>

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
