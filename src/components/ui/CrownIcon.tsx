interface CrownIconProps {
  className?: string
}

export function CrownIcon({ className = 'h-4 w-4' }: CrownIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M2.5 7.5 7 11l5-7 5 7 4.5-3.5L19 18H5L2.5 7.5ZM5 20h14v1.5H5V20Z" />
    </svg>
  )
}
