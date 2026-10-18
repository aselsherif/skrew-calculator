import { useTranslation } from 'react-i18next'
import type { Turn } from '../../types/game'
import { Button } from '../ui/Button'
import { CrownIcon } from '../ui/CrownIcon'

interface TurnHeaderProps {
  editingTurn: Turn | null
  turnNumber: number
  totalTurns: number
  progress: number
  onCheckKing: () => void
  onRequestRestart: () => void
}

export function TurnHeader({
  editingTurn,
  turnNumber,
  totalTurns,
  progress,
  onCheckKing,
  onRequestRestart,
}: TurnHeaderProps) {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {editingTurn
            ? t('game.editingTurn', { number: editingTurn.index + 1 })
            : t('game.turn', { current: turnNumber, total: totalTurns })}
        </h2>
        <Button variant="danger" size="sm" onClick={onRequestRestart}>
          {t('game.restart')}
        </Button>
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('game.kingHint')}</p>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all dark:bg-indigo-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 flex">
        <Button variant="secondary" onClick={onCheckKing} className="w-full sm:w-auto">
          <CrownIcon className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          {t('game.checkKing')}
        </Button>
      </div>
    </>
  )
}
