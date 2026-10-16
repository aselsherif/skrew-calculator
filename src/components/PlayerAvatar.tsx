import { BigHead } from '@bigheads/core'
import { useMemo } from 'react'
import { bigHeadConfigFromSeed } from '../game/bigHeads'

interface PlayerAvatarProps {
  seed?: string | null
  name: string
  className?: string
}

export function PlayerAvatar({
  seed,
  name,
  className = 'h-8 w-8 text-sm',
}: PlayerAvatarProps) {
  const config = useMemo(() => (seed ? bigHeadConfigFromSeed(seed) : null), [seed])

  if (!seed || !config) {
    const initial = name.trim().charAt(0).toLocaleUpperCase() || '?'
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200 ${className}`}
      >
        {initial}
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 overflow-hidden rounded-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full ${className}`}
    >
      <BigHead {...config} />
    </span>
  )
}
