/**
 * Official Burton's Reliable logo. `light` swaps in the white knockout for
 * dark/blue surfaces; `compact` shows only the flame-and-swoosh mark.
 * Assets live in public/ (logo.png, logo-white.png, logo-mark*.png).
 */
export default function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  if (compact) {
    return (
      <img
        src={light ? '/logo-mark-white.png' : '/logo-mark.png'}
        alt="Burton's Reliable"
        width={212}
        height={290}
        draggable={false}
        className="h-10 w-auto select-none"
      />
    )
  }
  return (
    <img
      src={light ? '/logo-white.png' : '/logo.png'}
      alt="Burton's Reliable Heating and Air Conditioning LLC"
      width={775}
      height={292}
      draggable={false}
      className="h-10 md:h-11 w-auto select-none"
    />
  )
}
