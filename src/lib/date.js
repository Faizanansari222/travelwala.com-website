// Small date helpers (local time, no library needed).

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1)
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1)

/** Same day-of-month n months away, clamped to the target month's length. */
export function shiftMonths(d, n) {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay))
}

export const isSameDay = (a, b) =>
  Boolean(a && b) && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const toISODate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function fromISODate(value) {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 42 dates (6 weeks) covering `month`, weeks starting on Monday by default. */
export function monthGrid(month, weekStartsOn = 1) {
  const first = startOfMonth(month)
  const offset = (first.getDay() - weekStartsOn + 7) % 7
  const start = addDays(first, -offset)
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

const weekdayFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'short' })
// 1 Jan 2024 was a Monday.
export const weekdayLabels = (weekStartsOn = 1) =>
  Array.from({ length: 7 }, (_, i) => weekdayFormat.format(new Date(2024, 0, 1 + ((i + weekStartsOn - 1 + 7) % 7))).slice(0, 2))

export const formatShort = (d) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(d)
export const formatLong = (d) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d)
export const formatMonth = (d) => new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(d)
