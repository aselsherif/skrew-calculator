import { getAvatar } from '../game/avatars'
import type { AvatarId } from '../types/game'

interface PlayerAvatarProps {
  avatarId?: AvatarId | null
  name: string
  className?: string
}

export function PlayerAvatar({
  avatarId,
  name,
  className = 'h-8 w-8 text-sm',
}: PlayerAvatarProps) {
  const avatar = getAvatar(avatarId)

  if (!avatar) {
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
    <svg viewBox="0 0 48 48" aria-hidden="true" className={`shrink-0 rounded-full ${className}`}>
      <circle cx="24" cy="24" r="24" fill={avatar.bg} />
      <g transform="translate(13 13) scale(0.9167)" fill={avatar.fg} fillRule={avatar.fillRule}>
        {avatar.paths.map((path, index) => {
          const { d, tone } = typeof path === 'string' ? { d: path, tone: undefined } : path
          return <path key={index} d={d} fill={tone === 'bg' ? avatar.bg : undefined} />
        })}
      </g>
    </svg>
  )
}
