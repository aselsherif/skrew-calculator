import { useTranslation } from 'react-i18next'
import { AVATARS } from '../game/avatars'
import type { AvatarId } from '../types/game'
import { PlayerAvatar } from './PlayerAvatar'
import { Modal } from './ui/Modal'

interface AvatarPickerDialogProps {
  open: boolean
  playerName: string
  selectedAvatarId: AvatarId | null
  onSelect: (avatarId: AvatarId) => void
  onClose: () => void
}

export function AvatarPickerDialog({
  open,
  playerName,
  selectedAvatarId,
  onSelect,
  onClose,
}: AvatarPickerDialogProps) {
  const { t } = useTranslation()

  return (
    <Modal open={open} title={t('avatars.title', { name: playerName })} onClose={onClose}>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('avatars.hint')}</p>
      <ul className="mt-4 grid max-h-[60vh] grid-cols-4 gap-3 overflow-y-auto pe-1 sm:grid-cols-6">
        {AVATARS.map((avatar) => {
          const selected = avatar.id === selectedAvatarId
          const label = t(`avatars.names.${avatar.id}`)
          return (
            <li key={avatar.id}>
              <button
                type="button"
                aria-pressed={selected}
                aria-label={label}
                title={label}
                onClick={() => onSelect(avatar.id)}
                className={`flex w-full items-center justify-center rounded-full p-0.5 transition-opacity ${
                  selected
                    ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900'
                    : 'hover:opacity-75'
                }`}
              >
                <PlayerAvatar
                  avatarId={avatar.id}
                  name={playerName}
                  className="h-11 w-11 text-base"
                />
              </button>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}
