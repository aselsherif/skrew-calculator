import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '../ui/ConfirmDialog'

interface RestartGameDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function RestartGameDialog({ open, onConfirm, onCancel }: RestartGameDialogProps) {
  const { t } = useTranslation()

  return (
    <ConfirmDialog
      open={open}
      title={t('restart.title')}
      message={t('restart.message')}
      confirmLabel={t('restart.confirm')}
      cancelLabel={t('common.cancel')}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
