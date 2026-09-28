import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keeps keyboard focus inside `ref` while `active`, calls `onEscape` on Escape,
 * and restores focus to the previously focused element afterwards.
 *
 * Options:
 *  - initialFocus():        element to focus first (defaults to the first focusable)
 *  - shouldRestoreFocus():  return false to skip restoring focus (e.g. after an outside click)
 */
export function useFocusTrap(ref, active, onEscape, options = {}) {
  const escapeRef = useRef(onEscape)
  escapeRef.current = onEscape
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const node = ref.current
    if (!active || !node) return

    const previouslyFocused = document.activeElement
    const focusables = () =>
      [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length > 0)

    const first = optionsRef.current.initialFocus?.() ?? focusables()[0]
    ;(first ?? node).focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        escapeRef.current?.()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusables()
      if (!items.length) {
        event.preventDefault()
        return
      }
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (optionsRef.current.shouldRestoreFocus?.() ?? true) {
        previouslyFocused?.focus?.({ preventScroll: true })
      }
    }
  }, [ref, active])
}
