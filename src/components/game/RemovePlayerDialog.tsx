import { useTranslation } from 'react-i18next'
import type { Player } from '../../types/game'
import { ConfirmDialog } from '../ui/ConfirmDialog'

interface RemovePlayerDialogProps {
  player: Player | null
  onConfirm: (player: Player) => void
  onCancel: () => void
}

export function RemovePlayerDialog({ player, onConfirm, onCancel }: RemovePlayerDialogProps) {
  const { t } = useTranslation()

  return (
    <ConfirmDialog
      open={player !== null}
      title={t('removePlayer.title', { name: player?.name ?? '' })}
      message={t('removePlayer.message')}
      confirmLabel={t('removePlayer.confirm')}
      cancelLabel={t('common.cancel')}
      onConfirm={() => {
        if (player) {
          onConfirm(player)
        }
      }}
      onCancel={onCancel}
    />
  )
}
