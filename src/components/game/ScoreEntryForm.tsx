import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { DraftState } from '../../game/draft'
import { parsePoints, totalForPlayer } from '../../game/rules'
import type { GameSession, Player, Turn } from '../../types/game'
import { PlayerScoreRow } from './PlayerScoreRow'

interface ScoreEntryFormProps {
  session: GameSession
  editingTurn: Turn | null
  draft: DraftState
  errors: Record<string, string>
  showSummary: boolean
  canRemovePlayers: boolean
  onPointsChange: (playerId: string, value: string) => void
  onToggleKing: (playerId: string) => void
  onRequestRemovePlayer: (player: Player) => void
}

export function ScoreEntryForm({
  session,
  editingTurn,
  draft,
  errors,
  showSummary,
  canRemovePlayers,
  onPointsChange,
  onToggleKing,
  onRequestRemovePlayer,
}: ScoreEntryFormProps) {
  const { t } = useTranslation()

  const otherTurns = useMemo(
    () =>
      editingTurn
        ? session.turns.filter((turn) => turn.index !== editingTurn.index)
        : session.turns,
    [session.turns, editingTurn],
  )

  const projectedTotals = useMemo(() => {
    const totals = new Map<string, number>()
    for (const player of session.players) {
      const entry = draft[player.id]
      const draftPoints = entry ? (entry.isKing ? 0 : (parsePoints(entry.points) ?? 0)) : 0
      totals.set(player.id, totalForPlayer(otherTurns, player.id) + draftPoints)
    }
    return totals
  }, [session.players, otherTurns, draft])

  return (
    <div className="mt-4">
      <ul className="space-y-3">
        {session.players.map((player) => (
          <PlayerScoreRow
            key={player.id}
            player={player}
            entry={draft[player.id]}
            errorKey={errors[player.id]}
            projectedTotal={projectedTotals.get(player.id) ?? 0}
            canRemove={canRemovePlayers}
            onPointsChange={onPointsChange}
            onToggleKing={onToggleKing}
            onRequestRemove={onRequestRemovePlayer}
          />
        ))}
      </ul>

      {showSummary && (
        <p role="alert" className="mt-4 text-sm text-rose-600 dark:text-rose-400">
          {t('game.errors.turnIncomplete')}
        </p>
      )}
    </div>
  )
}
