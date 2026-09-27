import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '../lib/utils'

/**
 * Lazy-loaded image that fades in once decoded and falls back to a
 * branded gradient if the URL fails (handy while using placeholder images).
 */
export default function SmartImage({ src, alt = '', className, imgClassName, loading = 'lazy', priority = false, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className={cn('relative overflow-hidden bg-linear-to-br from-brand/40 to-brand-dark/60', className)}>
      {failed ? (
        <div role={alt ? 'img' : undefined} aria-label={alt || undefined} className="grid h-full w-full place-items-center text-white/60">
          <ImageOff aria-hidden="true" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : loading}
          decoding="async"
          fetchpriority={priority ? 'high' : undefined}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn('h-full w-full object-cover transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0', imgClassName)}
          {...rest}
        />
      )}
    </div>
  )
}
