import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CrownIcon } from './ui/CrownIcon'

function SwordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
      <g transform="rotate(45 12 12)">
        <path d="M12 2l1 2v9h-2V4zM8.5 13h7v1.8h-7zM11.4 14.8h1.2v4.4h-1.2zM12 19.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 1 0 0-2.4z" />
      </g>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="M12 2l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5z" />
    </svg>
  )
}

interface RankMeta {
  labelKey: string
  toneClasses: string
  icon: ReactNode
}

const RANK_META: Partial<Record<number, RankMeta>> = {
  1: {
    labelKey: 'ranks.king',
    toneClasses:
      'bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300',
    icon: <CrownIcon className="h-3.5 w-3.5" />,
  },
  2: {
    labelKey: 'ranks.prince',
    toneClasses: 'bg-sky-100 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300',
    icon: <SwordIcon />,
  },
  3: {
    labelKey: 'ranks.knight',
    toneClasses:
      'bg-violet-100 text-violet-700 dark:bg-violet-400/20 dark:text-violet-300',
    icon: <ShieldIcon />,
  },
}

interface RankBadgeProps {
  rank: number
  compact?: boolean
  className?: string
}

export function RankBadge({ rank, compact = false, className = '' }: RankBadgeProps) {
  const { t } = useTranslation()
  const meta = RANK_META[rank]

  if (!meta) {
    return null
  }

  const label = t(meta.labelKey)

  if (compact) {
    return (
      <span
        role="img"
        title={label}
        aria-label={label}
        className={`inline-flex items-center justify-center rounded-full p-1 ${meta.toneClasses} ${className}`}
      >
        {meta.icon}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.toneClasses} ${className}`}
    >
      {meta.icon}
      {label}
    </span>
  )
}
