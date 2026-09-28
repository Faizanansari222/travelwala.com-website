import { useId, useRef, useState } from 'react'
import { MapPin, Search, X } from 'lucide-react'
import { formatPrice } from '../../data/site'
import { cn } from '../../lib/utils'
import Popover from './Popover'
import { searchFieldClass, searchLabelClass } from './styles'

/**
 * Type-ahead destination field (WAI-ARIA combobox with list autocomplete).
 * Free text is allowed; suggestions show a photo, country and starting price.
 * options: [{ id, name, country, image, price }]
 */
export default function DestinationCombobox({ id, label, icon: Icon = MapPin, value, onChange, options, placeholder = 'City or country' }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const shellRef = useRef(null)
  const inputRef = useRef(null)
  const listId = `${id}-listbox`
  const labelId = `${useId()}-label`
  const optionId = (i) => `${id}-option-${i}`

  const query = value.trim().toLowerCase()
  const results = query
    ? options.filter((o) => o.name.toLowerCase().includes(query) || o.country.toLowerCase().includes(query))
    : options

  const choose = (option) => {
    onChange(option.name)
    setOpen(false)
    setActive(-1)
  }

  const onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) setOpen(true)
        setActive((a) => Math.min(a + 1, results.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
        break
      case 'Enter':
        if (open && active >= 0 && results[active]) {
          event.preventDefault()
          choose(results[active])
        }
        break
      case 'Escape':
        if (open) setOpen(false)
        else onChange('')
        break
      case 'Tab':
        setOpen(false)
        break
      default:
    }
  }

  return (
    <div ref={shellRef} className={cn(searchFieldClass(open), 'cursor-text')} onClick={() => inputRef.current?.focus()}>
      <label id={labelId} htmlFor={id} className={searchLabelClass}>
        <Icon size={13} className="text-brand" aria-hidden="true" />
        {label}
      </label>
      <div className="mt-0.5 flex items-center gap-2">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck="false"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
            setActive(e.target.value ? 0 : -1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full min-w-0 bg-transparent text-[0.95rem] font-semibold text-ink placeholder:font-medium placeholder:text-ink/40 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange('')
              setActive(-1)
              inputRef.current?.focus()
            }}
            aria-label="Clear destination"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink/10 text-ink/60 transition hover:bg-ink/20 hover:text-ink"
          >
            <X size={13} aria-hidden="true" />
          </button>
        )}
      </div>

      <Popover open={open} onClose={() => setOpen(false)} anchorRef={shellRef} minWidth={320} maxHeight={380}>
        <p className="px-4 pt-3.5 pb-1.5 text-[0.7rem] font-bold tracking-wider text-ink/45 uppercase">
          {query ? `${results.length} match${results.length === 1 ? '' : 'es'}` : 'Popular destinations'}
        </p>
        <ul id={listId} role="listbox" aria-labelledby={labelId} className="px-1.5 pb-1.5">
          {results.map((option, i) => (
            <li
              key={option.id}
              id={optionId(i)}
              role="option"
              aria-selected={option.name === value}
              onPointerDown={(e) => e.preventDefault()}
              onPointerMove={() => active !== i && setActive(i)}
              onClick={() => choose(option)}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 transition-colors select-none',
                i === active && 'bg-brand/[0.07]',
              )}
            >
              <img src={option.image} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-ink">{option.name}</span>
                <span className="block truncate text-xs text-ink/55">{option.country}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[0.65rem] font-medium text-ink/45 uppercase">from</span>
                <span className="block text-xs font-extrabold text-brand">{formatPrice(option.price)}</span>
              </span>
            </li>
          ))}
        </ul>
        {query && results.length === 0 && (
          <div className="flex items-start gap-3 px-4 pt-1 pb-4 text-sm text-ink/65">
            <Search size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            <p>
              No ready-made package for <span className="font-semibold text-ink">“{value}”</span> yet. Search anyway and our team
              will plan it for you.
            </p>
          </div>
        )}
      </Popover>
    </div>
  )
}
