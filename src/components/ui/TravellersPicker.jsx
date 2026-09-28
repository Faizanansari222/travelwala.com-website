import { useRef, useState } from 'react'
import { ChevronDown, Minus, Plus, Users } from 'lucide-react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { cn } from '../../lib/utils'
import Popover from './Popover'
import { searchFieldClass, searchLabelClass, searchValueClass } from './styles'

export const CABIN_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First']
const MAX_SEATS = 9

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

export function travellersSummary({ adults, children, infants }) {
  const total = adults + children + infants
  return plural(total, 'Traveller', 'Travellers')
}

function Stepper({ id, title, hint, value, min, max, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p id={`${id}-title`} className="font-semibold text-ink">
          {title}
        </p>
        <p className="text-xs text-ink/55">{hint}</p>
      </div>
      <div className="flex items-center gap-3" role="group" aria-labelledby={`${id}-title`}>
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          aria-label={`Fewer ${title.toLowerCase()}`}
          className="grid h-9 w-9 place-items-center rounded-full border-2 border-brand/20 text-brand transition hover:border-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/25 disabled:hover:bg-transparent"
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-6 text-center text-lg font-bold text-ink tabular-nums">
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={`More ${title.toLowerCase()}`}
          className="grid h-9 w-9 place-items-center rounded-full border-2 border-brand/20 text-brand transition hover:border-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/25 disabled:hover:bg-transparent"
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/**
 * Travellers & cabin picker. value = { adults, children, infants, cabin }.
 * Rules: 1–9 seats (adults + children), at most one infant per adult.
 */
export default function TravellersPicker({ id, label, icon: Icon = Users, value, onChange }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const closeReason = useRef('escape')
  const dialogId = `${id}-dialog`
  const { adults, children, infants, cabin } = value

  const close = (reason = 'escape') => {
    closeReason.current = reason
    setOpen(false)
  }
  useFocusTrap(panelRef, open, () => close('escape'), {
    shouldRestoreFocus: () => closeReason.current !== 'outside',
  })

  const update = (patch) => {
    const next = { ...value, ...patch }
    next.infants = Math.min(next.infants, next.adults)
    onChange?.(next)
  }

  return (
    <div className="relative min-w-0">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
        className={searchFieldClass(open)}
      >
        <span className={searchLabelClass}>
          <Icon size={13} className="text-brand" aria-hidden="true" />
          {label}
        </span>
        <span className={searchValueClass}>
          <span className="truncate text-ink">
            {travellersSummary(value)}
            <span className="font-medium text-ink/50">, {cabin}</span>
          </span>
          <ChevronDown size={18} aria-hidden="true" className={cn('shrink-0 text-ink/45 transition-transform duration-300', open && 'rotate-180 text-brand')} />
        </span>
      </button>

      <Popover
        open={open}
        onClose={(reason) => close(reason)}
        anchorRef={triggerRef}
        panelRef={panelRef}
        id={dialogId}
        role="dialog"
        label="Travellers & cabin class"
        matchWidth={false}
        minWidth={340}
        maxHeight={560}
        align="end"
        sheetOnMobile
      >
        <div className="divide-y divide-brand/10 px-5">
          <Stepper
            id={`${id}-adults`}
            title="Adults"
            hint="12 years and above"
            value={adults}
            min={1}
            max={MAX_SEATS - children}
            onChange={(n) => update({ adults: n })}
          />
          <Stepper
            id={`${id}-children`}
            title="Children"
            hint="2 to 11 years"
            value={children}
            min={0}
            max={MAX_SEATS - adults}
            onChange={(n) => update({ children: n })}
          />
          <Stepper
            id={`${id}-infants`}
            title="Infants"
            hint="Under 2, on an adult's lap"
            value={infants}
            min={0}
            max={adults}
            onChange={(n) => update({ infants: n })}
          />
        </div>

        <fieldset className="border-t border-brand/10 px-5 pt-4 pb-2">
          <legend className="float-left mb-3 w-full text-sm font-bold text-ink">Cabin class</legend>
          <div className="clear-both grid grid-cols-2 gap-2">
            {CABIN_CLASSES.map((option) => (
              <label key={option} className="cursor-pointer">
                <input
                  type="radio"
                  name={`${id}-cabin`}
                  value={option}
                  checked={cabin === option}
                  onChange={() => update({ cabin: option })}
                  className="peer sr-only"
                />
                <span className="block rounded-xl border-2 border-brand/15 px-3 py-2 text-center text-sm font-semibold text-ink/75 transition peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-brand/40">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-4 px-5 pt-3 pb-4">
          <p className="text-xs leading-snug text-ink/55">
            Up to {MAX_SEATS} seats per booking.
            <br />
            Bigger group? Ask us for group fares.
          </p>
          <button
            type="button"
            onClick={() => close('done')}
            className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/30 transition hover:scale-[1.03] hover:bg-[#e67e17]"
          >
            Done
          </button>
        </div>
      </Popover>
    </div>
  )
}
