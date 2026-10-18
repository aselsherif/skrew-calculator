import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RemovePlayerDialog } from '../components/game/RemovePlayerDialog'
import { RestartGameDialog } from '../components/game/RestartGameDialog'
import { ScoreEntryForm } from '../components/game/ScoreEntryForm'
import { TurnHeader } from '../components/game/TurnHeader'
import { TurnActionBar } from '../components/TurnActionBar'
import { TurnHistory } from '../components/TurnHistory'
import { Card } from '../components/ui/Card'
import type { GameModeDefinition } from '../game/modes'
import { MIN_PLAYERS } from '../game/players'
import { useTurnDraft } from '../hooks/useTurnDraft'
import type { GameSession, Player, TurnEntry } from '../types/game'

interface GameScreenProps {
  session: GameSession
  mode: GameModeDefinition
  onSubmitTurn: (entries: TurnEntry[]) => void
  onStartEditingTurn: (index: number) => void
  onCancelEditingTurn: () => void
  onRemovePlayer: (playerId: string) => void
  onRestart: () => void
}

export function GameScreen({
  session,
  mode,
  onSubmitTurn,
  onStartEditingTurn,
  onCancelEditingTurn,
  onRemovePlayer,
  onRestart,
}: GameScreenProps) {
  const { t } = useTranslation()
  const [confirmRestartOpen, setConfirmRestartOpen] = useState(false)
  const [playerToRemove, setPlayerToRemove] = useState<Player | null>(null)

  const editingTurn =
    session.editingTurnIndex !== null ? session.turns[session.editingTurnIndex] : null
  const activeKey = editingTurn ? `edit-${editingTurn.index}` : 'new'
  const turnDraft = useTurnDraft({ session, mode, activeKey, editingTurn, onSubmitTurn })

  const turnNumber = session.turns.length + 1
  const progress = (session.turns.length / mode.turnCount) * 100
  const activePosition = editingTurn ? editingTurn.index : session.turns.length

  function navigateTo(position: number) {
    turnDraft.clearFeedback()
    if (position === session.turns.length) {
      onCancelEditingTurn()
    } else {
      onStartEditingTurn(position)
    }
  }

  return (
    <div className="space-y-6 pb-28">
      <Card>
        <TurnHeader
          editingTurn={editingTurn}
          turnNumber={turnNumber}
          totalTurns={mode.turnCount}
          progress={progress}
          onCheckKing={turnDraft.checkKing}
          onRequestRestart={() => setConfirmRestartOpen(true)}
        />
        <ScoreEntryForm
          session={session}
          editingTurn={editingTurn}
          draft={turnDraft.draft}
          errors={turnDraft.errors}
          showSummary={turnDraft.showSummary}
          canRemovePlayers={session.players.length > MIN_PLAYERS}
          onPointsChange={turnDraft.changePoints}
          onToggleKing={turnDraft.toggleKing}
          onRequestRemovePlayer={setPlayerToRemove}
        />
      </Card>

      <TurnHistory session={session} onEditTurn={onStartEditingTurn} />

      <TurnActionBar
        positionLabel={
          editingTurn
            ? t('game.editingTurn', { number: editingTurn.index + 1 })
            : t('game.turn', { current: turnNumber, total: mode.turnCount })
        }
        submitLabel={editingTurn ? t('game.saveTurn') : t('game.submitTurn')}
        isEditing={editingTurn !== null}
        canGoPrevious={activePosition > 0}
        canGoNext={editingTurn !== null}
        onPrevious={() => navigateTo(activePosition - 1)}
        onNext={() => navigateTo(activePosition + 1)}
        onCancelEdit={() => {
          turnDraft.clearFeedback()
          onCancelEditingTurn()
        }}
        onSubmit={turnDraft.submit}
      />

      <RestartGameDialog
        open={confirmRestartOpen}
        onConfirm={() => {
          setConfirmRestartOpen(false)
          onRestart()
        }}
        onCancel={() => setConfirmRestartOpen(false)}
      />

      <RemovePlayerDialog
        player={playerToRemove}
        onConfirm={(player) => {
          onRemovePlayer(player.id)
          setPlayerToRemove(null)
        }}
        onCancel={() => setPlayerToRemove(null)}
      />
    </div>
  )
}
