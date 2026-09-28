import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/utils'

const GAP = 8
const EDGE = 12
const NAVBAR = 72

/**
 * Floating panel anchored to a trigger. Rendered in a portal so it is never clipped by
 * `overflow: hidden` parents (like the hero). Flips above the trigger when there is no
 * room below, follows the trigger on scroll/resize, and closes on outside click or Escape.
 * With `sheetOnMobile`, phones get a bottom sheet instead.
 *
 * onClose receives a reason: 'outside' | 'escape'.
 */
export default function Popover({
  open,
  onClose,
  anchorRef,
  panelRef: externalPanelRef,
  children,
  id,
  role,
  label,
  minWidth = 240,
  matchWidth = true,
  maxHeight = 360,
  align = 'start',
  sheetOnMobile = false,
  className,
}) {
  const isPhone = useMediaQuery('(max-width: 639px)')
  const asSheet = sheetOnMobile && isPhone
  const localRef = useRef(null)
  const panelRef = externalPanelRef ?? localRef
  const [placement, setPlacement] = useState('bottom')
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useLockBodyScroll(open && asSheet)

  // Anchor positioning (desktop / tablet). Writes styles directly — no re-render per scroll.
  useLayoutEffect(() => {
    if (!open || asSheet) return
    let frame = 0
    const place = () => {
      const anchor = anchorRef.current
      const panel = panelRef.current
      if (!anchor || !panel) return
      const rect = anchor.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (rect.bottom < NAVBAR || rect.top > vh) {
        onCloseRef.current?.('outside')
        return
      }
      const width = Math.min(matchWidth ? Math.max(rect.width, minWidth) : minWidth, vw - EDGE * 2)
      const spaceBelow = vh - rect.bottom - GAP - EDGE
      const spaceAbove = rect.top - GAP - EDGE
      const natural = Math.min(panel.scrollHeight, maxHeight)
      const up = natural > spaceBelow && spaceAbove > spaceBelow
      const room = Math.min(maxHeight, up ? spaceAbove : spaceBelow)
      const left = Math.min(Math.max(align === 'end' ? rect.right - width : rect.left, EDGE), vw - width - EDGE)

      panel.style.width = `${width}px`
      panel.style.maxHeight = `${Math.max(room, 180)}px`
      panel.style.left = `${left}px`
      panel.style.top = up ? 'auto' : `${rect.bottom + GAP}px`
      panel.style.bottom = up ? `${vh - rect.top + GAP}px` : 'auto'
      setPlacement(up ? 'top' : 'bottom')
    }
    place()
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(place)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [open, asSheet, anchorRef, panelRef, matchWidth, minWidth, maxHeight, align])

  // Outside click + Escape
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      const target = event.target
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return
      onCloseRef.current?.('outside')
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current?.('escape')
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, anchorRef, panelRef])

  const dialogProps = role === 'dialog' ? { role, 'aria-modal': asSheet || undefined, 'aria-label': label } : {}

  return createPortal(
    <AnimatePresence>
      {open &&
        (asSheet ? (
          <motion.div key="sheet" className="fixed inset-0 z-[90]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
            <motion.div
              className="absolute inset-0 bg-brand-deep/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
            />
            <motion.div
              ref={panelRef}
              id={id}
              {...dialogProps}
              data-lenis-prevent
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className={cn(
                'absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto overscroll-contain rounded-t-3xl bg-white pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl',
                className,
              )}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand/10 bg-white px-5 pt-5 pb-3">
                <span className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-ink/15" aria-hidden="true" />
                <p className="text-base font-bold text-ink">{label}</p>
                <button
                  type="button"
                  onClick={() => onCloseRef.current?.('escape')}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink transition hover:bg-brand/10"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              {children}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="popover"
            ref={panelRef}
            id={id}
            {...dialogProps}
            data-lenis-prevent
            initial={{ opacity: 0, y: placement === 'top' ? 8 : -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: placement === 'top' ? 'bottom center' : 'top center' }}
            className={cn(
              'fixed z-[66] overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-[0_24px_60px_-18px_rgba(18,74,82,0.4)] ring-1 ring-brand/10',
              className,
            )}
          >
            {children}
          </motion.div>
        ))}
    </AnimatePresence>,
    document.body,
  )
}
