// Top-down airliner silhouette in a 64×64 box, nose pointing right (0°).
// Coloured with `currentColor`, so `text-*` classes recolour it.
export const PLANE_PATH =
  'M60 32 C60 30 57.5 29 54 29 H40 L26 8 H20 L28 29 H14 L8 20 H4 L7 32 L4 44 H8 L14 35 H28 L20 56 H26 L40 35 H54 C57.5 35 60 34 60 32 Z'

export default function Plane({ size = 32, title, className, ...rest }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      <path d={PLANE_PATH} />
    </svg>
  )
}

/**
 * The same plane as an SVG <g>, centred on (0,0), for use inside another <svg>
 * (e.g. when following a path). Pass `badge` to draw a soft circle behind it.
 */
export function PlaneGlyph({ size = 32, color = 'currentColor', badge }) {
  const scale = size / 64
  return (
    <>
      {badge && (
        <>
          <circle r={size * 0.78} fill={badge} opacity="0.25" />
          <circle r={size * 0.62} fill={badge} />
        </>
      )}
      <g transform={`translate(${-size / 2} ${-size / 2}) scale(${scale})`}>
        <path d={PLANE_PATH} fill={color} />
      </g>
    </>
  )
}
