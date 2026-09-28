import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import {
  addDays,
  addMonths,
  formatLong,
  formatMonth,
  formatShort,
  fromISODate,
  isSameDay,
  monthGrid,
  shiftMonths,
  startOfDay,
  startOfMonth,
  toISODate,
  weekdayLabels,
} from '../../lib/date'
import { cn } from '../../lib/utils'
import Popover from './Popover'
import { searchFieldClass, searchLabelClass, searchValueClass } from './styles'

const WEEKDAYS = weekdayLabels(1)

function Month({ month, selected, today, minDate, tabbable, onSelect, onFocusDay, onKeyDown }) {
  const days = monthGrid(month, 1)
  return (
    <div className="w-full min-w-0">
      <p className="mb-3 text-center text-sm font-bold text-ink">{formatMonth(month)}</p>
      <table role="grid" aria-label={formatMonth(month)} className="w-full border-collapse" onKeyDown={onKeyDown}>
        <thead>
          <tr>
            {WEEKDAYS.map((d) => (
              <th key={d} scope="col" className="pb-2 text-center text-[0.7rem] font-bold tracking-wide text-ink/45 uppercase">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, week) => (
            <tr key={week}>
              {days.slice(week * 7, week * 7 + 7).map((day) => {
                if (day.getMonth() !== month.getMonth()) return <td key={day.toISOString()} role="gridcell" className="p-0.5" />
                const disabled = day < minDate
                const isSelected = isSameDay(day, selected)
                const isToday = isSameDay(day, today)
                const isFocusTarget = isSameDay(day, tabbable)
                return (
                  <td key={day.toISOString()} role="gridcell" aria-selected={isSelected} className="p-0.5 text-center">
                    <button
                      type="button"
                      data-date={toISODate(day)}
                      tabIndex={isFocusTarget ? 0 : -1}
                      disabled={disabled}
                      aria-label={`${formatLong(day)}${isToday ? ', today' : ''}`}
                      aria-pressed={isSelected}
                      onClick={() => onSelect(day)}
                      onFocus={() => onFocusDay(day)}
                      className={cn(
                        'relative mx-auto grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition-colors',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                        disabled && 'cursor-not-allowed text-ink/25',
                        !disabled && !isSelected && 'text-ink hover:bg-brand/10 hover:text-brand',
                        isSelected && 'bg-accent text-white shadow-md shadow-accent/40',
                        isToday && !isSelected && 'text-brand ring-1 ring-brand/40',
                      )}
                    >
                      {day.getDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Calendar date picker. Two months side by side from 768px, one month (bottom sheet) on phones.
 * Keyboard: arrows move by day/week, Home/End to week start/end, PageUp/PageDown by month,
 * Enter/Space selects, Escape closes. `value` / `onChange` use 'YYYY-MM-DD' strings.
 */
export default function DatePicker({ id, label, icon: Icon = CalendarDays, value, onChange, placeholder = 'Add date', minDate: minDateProp }) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const minDate = minDateProp ?? today
  const selected = fromISODate(value)
  const twoMonths = useMediaQuery('(min-width: 768px)')
  const monthsShown = twoMonths ? 2 : 1

  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => startOfMonth(selected ?? today))
  const [direction, setDirection] = useState(1)
  const [focusDate, setFocusDate] = useState(selected ?? today)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const closeReason = useRef('escape')
  const wantsFocus = useRef(false)
  const dialogId = `${id}-dialog`

  const lastVisible = addMonths(view, monthsShown)
  const canGoBack = addMonths(view, -1) >= startOfMonth(minDate)

  const openPicker = () => {
    const base = selected && selected >= minDate ? selected : minDate
    setFocusDate(base)
    setView(startOfMonth(base))
    closeReason.current = 'escape'
    setOpen(true)
  }
  const close = (reason = 'escape') => {
    closeReason.current = reason
    setOpen(false)
  }

  useFocusTrap(panelRef, open, () => close('escape'), {
    initialFocus: () => panelRef.current?.querySelector('button[data-date][tabindex="0"]'),
    shouldRestoreFocus: () => closeReason.current !== 'outside',
  })

  // After keyboard navigation, move real focus to the newly focused day.
  useLayoutEffect(() => {
    if (!open || !wantsFocus.current) return
    wantsFocus.current = false
    panelRef.current?.querySelector(`button[data-date="${toISODate(focusDate)}"]`)?.focus({ preventScroll: true })
  }, [open, focusDate, view])

  const goToMonth = (next) => {
    setDirection(next > view ? 1 : -1)
    setView(next)
  }

  const moveFocus = (next) => {
    const clamped = next < minDate ? minDate : next
    setFocusDate(clamped)
    if (clamped < view) goToMonth(startOfMonth(clamped))
    else if (clamped >= lastVisible) goToMonth(addMonths(startOfMonth(clamped), -(monthsShown - 1)))
    wantsFocus.current = true
  }

  // The one day reachable with Tab: the focused day if visible, else the first selectable day shown.
  const tabbable = focusDate >= view && focusDate < lastVisible ? focusDate : view < minDate ? minDate : view

  const onGridKeyDown = (event) => {
    const from = tabbable
    const weekday = (from.getDay() + 6) % 7
    const moves = {
      ArrowLeft: () => addDays(from, -1),
      ArrowRight: () => addDays(from, 1),
      ArrowUp: () => addDays(from, -7),
      ArrowDown: () => addDays(from, 7),
      Home: () => addDays(from, -weekday),
      End: () => addDays(from, 6 - weekday),
      PageUp: () => shiftMonths(from, event.shiftKey ? -12 : -1),
      PageDown: () => shiftMonths(from, event.shiftKey ? 12 : 1),
    }
    if (moves[event.key]) {
      event.preventDefault()
      moveFocus(moves[event.key]())
    }
  }

  const select = (day) => {
    onChange?.(toISODate(day))
    close('select')
  }

  const months = Array.from({ length: monthsShown }, (_, i) => addMonths(view, i))

  return (
    <div className="relative min-w-0">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={() => (open ? close() : openPicker())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault()
            openPicker()
          }
        }}
        className={searchFieldClass(open)}
      >
        <span className={searchLabelClass}>
          <Icon size={13} className="text-brand" aria-hidden="true" />
          {label}
        </span>
        <span className={searchValueClass}>
          <span className={cn('truncate', selected ? 'text-ink' : 'font-medium text-ink/40')}>
            {selected ? formatShort(selected) : placeholder}
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
        label={`Choose ${label.toLowerCase()}`}
        matchWidth={false}
        minWidth={twoMonths ? 640 : 340}
        maxHeight={520}
        sheetOnMobile
      >
        <div className="relative px-4 pt-4 pb-3 sm:px-5">
          <div className="absolute inset-x-3 top-4 flex justify-between sm:inset-x-4">
            <button
              type="button"
              onClick={() => goToMonth(addMonths(view, -1))}
              disabled={!canGoBack}
              aria-label="Previous month"
              className="grid h-8 w-8 place-items-center rounded-full text-ink transition hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goToMonth(addMonths(view, 1))}
              aria-label="Next month"
              className="grid h-8 w-8 place-items-center rounded-full text-ink transition hover:bg-brand/10"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          <motion.div
            key={toISODate(view)}
            initial={{ opacity: 0, x: direction * 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn('grid gap-6', twoMonths && 'grid-cols-2')}
          >
            {months.map((month) => (
              <Month
                key={month.toISOString()}
                month={month}
                selected={selected}
                today={today}
                minDate={minDate}
                tabbable={tabbable}
                onSelect={select}
                onFocusDay={(day) => !isSameDay(day, focusDate) && setFocusDate(day)}
                onKeyDown={onGridKeyDown}
              />
            ))}
          </motion.div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-brand/10 px-5 py-3">
          <p className="min-w-0 truncate text-sm text-ink/60" aria-live="polite">
            {selected ? (
              <>
                Departing <span className="font-semibold text-ink">{formatShort(selected)}</span>
              </>
            ) : (
              'Select your departure date'
            )}
          </p>
          <div className="flex shrink-0 gap-2">
            {selected && (
              <button
                type="button"
                onClick={() => onChange?.('')}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink/60 transition hover:bg-surface hover:text-ink"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => select(minDate)}
              className="rounded-full bg-brand/10 px-3.5 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white"
            >
              Today
            </button>
          </div>
        </div>
      </Popover>
    </div>
  )
}
