/** Join truthy class names. */
export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)
