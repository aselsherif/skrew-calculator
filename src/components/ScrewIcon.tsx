interface ScrewIconProps {
  className?: string
}

const SCREW_PATH =
  'M9 2h6a1.4 1.4 0 0 1 1.4 1.4v1.2a1.4 1.4 0 0 1-1.4 1.4H9a1.4 1.4 0 0 1-1.4-1.4V3.4A1.4 1.4 0 0 1 9 2zM9.2 3.35h5.6v1.3H9.2zM9.9 6h4.2l-1.05 11.4L12 21.6l-1.05-4.2zM10.35 8.6h3.3v1.1h-3.3zM10.75 11.9h2.5v1.05h-2.5zM11.15 14.9h1.7v1h-1.7z'

export function ScrewIcon({ className = 'h-5 w-5' }: ScrewIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      className={className}
    >
      <g transform="rotate(45 12 12)">
        <path d={SCREW_PATH} />
      </g>
    </svg>
  )
}
