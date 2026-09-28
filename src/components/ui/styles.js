import { cn } from '../../lib/utils'

/** Shell for the hero search-card fields (label on top, value below). */
export const searchFieldClass = (active) =>
  cn(
    'group relative flex w-full min-w-0 flex-col rounded-xl bg-surface px-4 pt-2.5 pb-2 text-left ring-1 ring-brand/10 transition',
    'hover:bg-white hover:ring-brand/25 focus-within:bg-white focus-within:ring-2 focus-within:ring-accent focus-visible:outline-none',
    active && 'bg-white ring-2 ring-accent',
  )

export const searchLabelClass = 'flex items-center gap-1.5 text-[0.7rem] font-bold tracking-wider text-ink/55 uppercase'

export const searchValueClass = 'mt-0.5 flex min-w-0 items-center justify-between gap-2 text-[0.95rem] font-semibold'

/** Bordered, floating-label shell used by the contact form fields. */
export const formFieldClass = (error, active) =>
  cn(
    'relative block w-full rounded-xl border-2 bg-white px-4 pt-6 pb-2 text-left text-ink transition-colors focus:outline-none focus:ring-4',
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : active
        ? 'border-brand ring-4 ring-brand/10'
        : 'border-brand/15 hover:border-brand/30 focus:border-brand focus:ring-brand/10',
  )
