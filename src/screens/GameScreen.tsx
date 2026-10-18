import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlayerAvatar } from '../components/PlayerAvatar'
import { TurnActionBar } from '../components/TurnActionBar'
import { TurnHistory } from '../components/TurnHistory'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CrownIcon } from '../components/ui/CrownIcon'
import type { GameModeDefinition } from '../game/modes'
import { MIN_PLAYERS } from '../game/players'
import { MAX_TURN_POINTS, parsePoints, totalForPlayer } from '../game/rules'
import type { GameSession, Player, Turn, TurnEntry } from '../types/game'

interface GameScreenProps {
  session: GameSession
  mode: GameModeDefinition
  onSubmitTurn: (entries: TurnEntry[]) => void
  onStartEditingTurn: (index: number) => void
  onCancelEditingTurn: () => void
  onRemovePlayer: (playerId: string) => void
  onRestart: () => void
}

interface DraftEntry {
  points: string
  isKing: boolean
}

type DraftState = Record<string, DraftEntry>

function createDraft(players: readonly Player[], entries?: readonly TurnEntry[]): DraftState {
  return Object.fromEntries(
    players.map((player) => {
      const entry = entries?.find((candidate) => candidate.playerId === player.id)
      return [
        player.id,
        { points: entry ? String(entry.points) : '', isKing: entry?.isKing ?? false },
      ]
    }),
  )
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
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSummary, setShowSummary] = useState(false)

  const editingTurn =
    session.editingTurnIndex !== null ? session.turns[session.editingTurnIndex] : null
  const activeKey = editingTurn ? `edit-${editingTurn.index}` : 'new'
  const draft = drafts[activeKey] ?? createDraft(session.players, editingTurn?.entries)

  const turnNumber = session.turns.length + 1
  const progress = (session.turns.length / mode.turnCount) * 100
  const activePosition = editingTurn ? editingTurn.index : session.turns.length
  const canGoPrevious = activePosition > 0
  const canGoNext = editingTurn !== null

  function setActiveDraft(next: DraftState) {
    setDrafts((previous) => ({ ...previous, [activeKey]: next }))
    setShowSummary(false)
  }

  function clearError(playerId: string) {
    setErrors((previous) => {
      if (!previous[playerId]) {
        return previous
      }
      const next = { ...previous }
      delete next[playerId]
      return next
    })
  }

  function handlePointsChange(playerId: string, value: string) {
    setActiveDraft({ ...draft, [playerId]: { ...draft[playerId], points: value } })
    clearError(playerId)
  }

  function handleToggleKing(playerId: string) {
    const entry = draft[playerId]
    let next: DraftState
    if (mode.allowMultipleKings) {
      next = { ...draft, [playerId]: { ...entry, isKing: !entry.isKing } }
    } else {
      const turningOn = !entry.isKing
      next = {}
      for (const [id, candidate] of Object.entries(draft)) {
        next[id] = { ...candidate, isKing: turningOn && id === playerId }
      }
    }
    setActiveDraft(next)
    clearError(playerId)
  }

  function navigateTo(position: number) {
    setErrors({})
    setShowSummary(false)
    if (position === session.turns.length) {
      onCancelEditingTurn()
    } else {
      onStartEditingTurn(position)
    }
  }

  function handleSubmit() {
    const nextErrors: Record<string, string> = {}
    for (const player of session.players) {
      const entry = draft[player.id]
      if (!entry || entry.isKing) {
        continue
      }
      if (entry.points.trim().length === 0) {
        nextErrors[player.id] = 'game.errors.pointsRequired'
      } else if (parsePoints(entry.points) === null) {
        nextErrors[player.id] = 'game.errors.pointsInvalid'
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setShowSummary(true)
      return
    }

    const entries: TurnEntry[] = session.players.map((player) => {
      const entry = draft[player.id]
      return {
        playerId: player.id,
        points: entry?.isKing ? 0 : (parsePoints(entry?.points ?? '') ?? 0),
        isKing: entry?.isKing ?? false,
      }
    })

    setDrafts((previous) => {
      const next = { ...previous }
      delete next[activeKey]
      return next
    })
    setErrors({})
    setShowSummary(false)
    onSubmitTurn(entries)
  }

  return (
    <div className="space-y-6 pb-28">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {editingTurn
              ? t('game.editingTurn', { number: editingTurn.index + 1 })
              : t('game.turn', { current: turnNumber, total: mode.turnCount })}
          </h2>
          <Button variant="danger" size="sm" onClick={() => setConfirmRestartOpen(true)}>
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

        <ScoreEntryForm
          session={session}
          editingTurn={editingTurn}
          draft={draft}
          errors={errors}
          showSummary={showSummary}
          canRemovePlayers={session.players.length > MIN_PLAYERS}
          onPointsChange={handlePointsChange}
          onToggleKing={handleToggleKing}
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
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={() => navigateTo(activePosition - 1)}
        onNext={() => navigateTo(activePosition + 1)}
        onCancelEdit={() => {
          setErrors({})
          setShowSummary(false)
          onCancelEditingTurn()
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={confirmRestartOpen}
        title={t('restart.title')}
        message={t('restart.message')}
        confirmLabel={t('restart.confirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => {
          setConfirmRestartOpen(false)
          onRestart()
        }}
        onCancel={() => setConfirmRestartOpen(false)}
      />

      <ConfirmDialog
        open={playerToRemove !== null}
        title={t('removePlayer.title', { name: playerToRemove?.name ?? '' })}
        message={t('removePlayer.message')}
        confirmLabel={t('removePlayer.confirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => {
          if (playerToRemove) {
            onRemovePlayer(playerToRemove.id)
          }
          setPlayerToRemove(null)
        }}
        onCancel={() => setPlayerToRemove(null)}
      />
    </div>
  )
}

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

function ScoreEntryForm({
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
        {session.players.map((player) => {
          const entry = draft[player.id]
          const errorKey = errors[player.id]
          return (
            <li
              key={player.id}
              className={`rounded-xl border p-3 sm:p-4 ${
                errorKey
                  ? 'border-rose-300 bg-rose-50/60 dark:border-rose-500/60 dark:bg-rose-500/10'
                  : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <PlayerAvatar
                    seed={player.avatarSeed}
                    name={player.name}
                    className="h-8 w-8 text-sm"
                  />
                  <span className="truncate font-semibold text-slate-800 dark:text-slate-100">
                    {player.name}
                  </span>
                  {entry.isKing && (
                    <Badge tone="amber">
                      <CrownIcon className="h-3.5 w-3.5" />
                      {t('common.king')}
                    </Badge>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    aria-pressed={entry.isKing}
                    aria-label={`${t('common.king')}: ${player.name}`}
                    onClick={() => onToggleKing(player.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      entry.isKing
                        ? 'border-amber-400 bg-amber-400 text-amber-950'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-amber-400/60 dark:hover:text-amber-300'
                    }`}
                  >
                    <CrownIcon className="h-3.5 w-3.5" />
                    {t('common.king')}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRequestRemovePlayer(player)}
                    disabled={!canRemovePlayers}
                    aria-label={t('game.removePlayer', { name: player.name })}
                    title={t('game.removePlayer', { name: player.name })}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 dark:hover:bg-rose-500/20 dark:hover:text-rose-300 dark:disabled:hover:text-slate-400"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {t('common.points')}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={MAX_TURN_POINTS}
                    value={entry.points}
                    disabled={entry.isKing}
                    onChange={(event) => onPointsChange(player.id, event.target.value)}
                    aria-invalid={errorKey !== undefined}
                    aria-label={`${t('common.points')}: ${player.name}`}
                    className={`w-24 rounded-xl border bg-white px-3 py-2 text-slate-900 outline-none transition-colors focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 ${
                      errorKey
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-500 dark:focus:border-rose-400 dark:focus:ring-rose-500/30'
                        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 dark:border-slate-700 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/30'
                    }`}
                  />
                </label>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {t('common.total')}:{' '}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {projectedTotals.get(player.id) ?? 0}
                  </strong>
                </span>
              </div>

              {errorKey && (
                <p role="alert" className="mt-2 text-sm text-rose-600 dark:text-rose-400">
                  {t(errorKey, { name: player.name, max: MAX_TURN_POINTS })}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {showSummary && (
        <p role="alert" className="mt-4 text-sm text-rose-600 dark:text-rose-400">
          {t('game.errors.turnIncomplete')}
        </p>
      )}
    </div>
  )
}
