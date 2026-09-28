import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import Popover from './Popover'
import { formFieldClass, searchFieldClass, searchLabelClass, searchValueClass } from './styles'

/**
 * Accessible custom select (WAI-ARIA "select-only combobox" pattern).
 * Focus stays on the trigger; ↑/↓, Home/End, PageUp/PageDown move, Enter/Space choose,
 * Escape closes and typing jumps to a matching option.
 *
 * options: [{ value, label, description?, icon?, badge?, disabled? }]
 * variant: 'search' (hero search card) | 'form' (floating-label form field)
 * Works with react-hook-form's <Controller> (ref, onChange, onBlur).
 */
const Select = forwardRef(function Select(
  { id, label, icon: Icon, options, value, onChange, onBlur, placeholder = 'Select…', variant = 'search', error, className },
  ref,
) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const buttonRef = useRef(null)
  const typeahead = useRef({ text: '', timer: 0 })

  const listId = `${id}-listbox`
  const labelId = `${id}-label`
  const valueId = `${id}-value`
  const errorId = `${id}-error`
  const optionId = (i) => `${id}-option-${i}`
  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = options[selectedIndex]
  const last = options.length - 1

  const setRefs = (node) => {
    buttonRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const openList = (index) => {
    setActive(index ?? (selectedIndex >= 0 ? selectedIndex : 0))
    setOpen(true)
  }
  const close = useCallback(() => setOpen(false), [])
  const commit = (index) => {
    const option = options[index]
    if (!option || option.disabled) return
    onChange?.(option.value)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const matchTypeahead = (char) => {
    const t = typeahead.current
    clearTimeout(t.timer)
    t.text += char.toLowerCase()
    t.timer = setTimeout(() => (t.text = ''), 600)
    const from = (open ? active : selectedIndex) + (t.text.length > 1 ? 0 : 1)
    for (let step = 0; step < options.length; step++) {
      const i = (from + step + options.length) % options.length
      if (!options[i].disabled && options[i].label.toLowerCase().startsWith(t.text)) return i
    }
    return -1
  }

  // Keep the highlighted option visible while moving with the keyboard.
  useEffect(() => {
    if (open && active >= 0) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, id])

  const onKeyDown = (event) => {
    const { key } = event
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        event.preventDefault()
        openList()
      } else if (key.length === 1 && /\S/.test(key)) {
        const match = matchTypeahead(key)
        if (match >= 0) openList(match)
      }
      return
    }
    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((a) => Math.min(a + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(last)
        break
      case 'PageDown':
        event.preventDefault()
        setActive((a) => Math.min(a + 10, last))
        break
      case 'PageUp':
        event.preventDefault()
        setActive((a) => Math.max(a - 10, 0))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        commit(active)
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'Tab':
        close()
        break
      default:
        if (key.length === 1) {
          const match = matchTypeahead(key)
          if (match >= 0) setActive(match)
        }
    }
  }

  const triggerProps = {
    ref: setRefs,
    id,
    type: 'button',
    role: 'combobox',
    'aria-haspopup': 'listbox',
    'aria-expanded': open,
    'aria-controls': open ? listId : undefined,
    'aria-activedescendant': open && active >= 0 ? optionId(active) : undefined,
    'aria-labelledby': `${labelId} ${valueId}`,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    onClick: () => (open ? close() : openList()),
    onKeyDown,
    onBlur,
  }

  const chevron = (
    <ChevronDown
      size={18}
      aria-hidden="true"
      className={cn('shrink-0 text-ink/45 transition-transform duration-300', open && 'rotate-180 text-brand')}
    />
  )

  return (
    <div className={cn('relative min-w-0', className)}>
      {variant === 'search' ? (
        <button {...triggerProps} className={searchFieldClass(open)}>
          <span id={labelId} className={searchLabelClass}>
            {Icon && <Icon size={13} className="text-brand" aria-hidden="true" />}
            {label}
          </span>
          <span className={searchValueClass}>
            <span id={valueId} className={cn('truncate', selected ? 'text-ink' : 'font-medium text-ink/40')}>
              {selected ? (
                <>
                  {selected.label}
                  {selected.badge && <span className="ml-1.5 text-xs font-bold text-ink/45">{selected.badge}</span>}
                </>
              ) : (
                placeholder
              )}
            </span>
            {chevron}
          </span>
        </button>
      ) : (
        <button {...triggerProps} className={cn(formFieldClass(error, open), 'flex items-center justify-between gap-3')}>
          <span
            id={labelId}
            className={cn(
              'pointer-events-none absolute left-4 transition-all duration-200',
              selected || open ? 'top-2 text-xs font-semibold text-brand' : 'top-4 text-base font-medium text-ink/50',
            )}
          >
            {label}
          </span>
          <span id={valueId} className={cn('flex min-h-6 min-w-0 items-center gap-2 truncate', !selected && 'text-transparent')}>
            {selected?.icon && <selected.icon size={16} className="shrink-0 text-brand" aria-hidden="true" />}
            {selected ? selected.label : placeholder}
          </span>
          {chevron}
        </button>
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

      <Popover open={open} onClose={close} anchorRef={buttonRef} minWidth={variant === 'search' ? 320 : 260} maxHeight={340}>
        <ul id={listId} role="listbox" aria-labelledby={labelId} className="p-1.5">
          {options.map((option, i) => {
            const isSelected = option.value === value
            const isActive = i === active
            const OptionIcon = option.icon
            return (
              <li
                key={option.value}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                onPointerDown={(e) => e.preventDefault()}
                onPointerMove={() => active !== i && setActive(i)}
                onClick={() => commit(i)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors select-none',
                  isActive && 'bg-brand/[0.07]',
                  isSelected ? 'font-semibold text-brand' : 'text-ink',
                  option.disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                {OptionIcon && (
                  <span
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors',
                      isSelected ? 'bg-brand text-white' : 'bg-brand/10 text-brand',
                    )}
                  >
                    <OptionIcon size={17} aria-hidden="true" />
                  </span>
                )}
                {option.badge && (
                  <span
                    className={cn(
                      'w-11 shrink-0 rounded-md py-1 text-center text-[0.7rem] font-extrabold tracking-wide',
                      isSelected ? 'bg-brand text-white' : 'bg-brand/10 text-brand',
                    )}
                  >
                    {option.badge}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{option.label}</span>
                  {option.description && (
                    <span className="block truncate text-xs font-normal text-ink/55">{option.description}</span>
                  )}
                </span>
                {isSelected && <Check size={17} className="shrink-0 text-accent" aria-hidden="true" />}
              </li>
            )
          })}
        </ul>
      </Popover>
    </div>
  )
})

export default Select
