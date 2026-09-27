import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'

/**
 * Brand logo. Uses /public/logo-light.svg on dark backgrounds and /public/logo.svg on light ones —
 * replace those two files to rebrand.
 */
export default function Logo({ variant = 'light', className, asLink = true, onClick }) {
  const img = (
    <img
      src={variant === 'light' ? '/logo-light.svg' : '/logo.svg'}
      alt="Travel Wala"
      width="236"
      height="60"
      className={cn('h-10 w-auto md:h-11', className)}
    />
  )
  if (!asLink) return img
  return (
    <Link to="/" onClick={onClick} aria-label="Travel Wala — home" className="inline-flex shrink-0 rounded-lg">
      {img}
    </Link>
  )
}
