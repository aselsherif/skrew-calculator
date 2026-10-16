import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TurnHistory } from '../components/TurnHistory'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CrownIcon } from '../components/ui/CrownIcon'
import type { GameModeDefinition } from '../game/modes'
import { MAX_TURN_POINTS, parsePoints, totalForPlayer } from '../game/rules'
import type { GameSession, Player, Turn, TurnEntry } from '../types/game'

interface GameScreenProps {
  session: GameSession
  mode: GameModeDefinition
  onSubmitTurn: (entries: TurnEntry[]) => void
  onStartEditingTurn: (index: number) => void
  onCancelEditingTurn: () => void
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
  onRestart,
}: GameScreenProps) {
  const { t } = useTranslation()
  const [confirmRestartOpen, setConfirmRestartOpen] = useState(false)

  const editingTurn =
    session.editingTurnIndex !== null ? session.turns[session.editingTurnIndex] : null
  const turnNumber = session.turns.length + 1
  const progress = (session.turns.length / mode.turnCount) * 100

  return (
    <div className="space-y-6">
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

        <TurnForm
          key={editingTurn ? `edit-${editingTurn.index}` : `new-${session.turns.length}`}
          session={session}
          allowMultipleKings={mode.allowMultipleKings}
          editingTurn={editingTurn}
          onSubmitTurn={onSubmitTurn}
          onStartEditingTurn={onStartEditingTurn}
          onCancelEditingTurn={onCancelEditingTurn}
        />
      </Card>

      <TurnHistory session={session} onEditTurn={onStartEditingTurn} />

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
    </div>
  )
}

interface TurnFormProps {
  session: GameSession
  allowMultipleKings: boolean
  editingTurn: Turn | null
  onSubmitTurn: (entries: TurnEntry[]) => void
  onStartEditingTurn: (index: number) => void
  onCancelEditingTurn: () => void
}

function TurnForm({
  session,
  allowMultipleKings,
  editingTurn,
  onSubmitTurn,
  onStartEditingTurn,
  onCancelEditingTurn,
}: TurnFormProps) {
  const { t } = useTranslation()
  const isEditing = editingTurn !== null
  const [draft, setDraft] = useState<DraftState>(() =>
    createDraft(session.players, editingTurn?.entries),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSummary, setShowSummary] = useState(false)

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

  function clearError(playerId: string) {
    if (errors[playerId]) {
      setErrors((previous) => {
        const next = { ...previous }
        delete next[playerId]
        return next
      })
    }
    setShowSummary(false)
  }

  function updatePoints(playerId: string, value: string) {
    setDraft((previous) => ({
      ...previous,
      [playerId]: { ...previous[playerId], points: value },
    }))
    clearError(playerId)
  }

  function toggleKing(playerId: string) {
    setDraft((previous) => {
      const entry = previous[playerId]
      if (allowMultipleKings) {
        return { ...previous, [playerId]: { ...entry, isKing: !entry.isKing } }
      }
      const turningOn = !entry.isKing
      const next: DraftState = {}
      for (const [id, candidate] of Object.entries(previous)) {
        next[id] = { ...candidate, isKing: turningOn && id === playerId }
      }
      return next
    })
    clearError(playerId)
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

    onSubmitTurn(
      session.players.map((player) => {
        const entry = draft[player.id]
        return {
          playerId: player.id,
          points: entry?.isKing ? 0 : (parsePoints(entry?.points ?? '') ?? 0),
          isKing: entry?.isKing ?? false,
        }
      }),
    )
  }

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
                <button
                  type="button"
                  aria-pressed={entry.isKing}
                  aria-label={`${t('common.king')}: ${player.name}`}
                  onClick={() => toggleKing(player.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    entry.isKing
                      ? 'border-amber-400 bg-amber-400 text-amber-950'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-amber-400/60 dark:hover:text-amber-300'
                  }`}
                >
                  <CrownIcon className="h-3.5 w-3.5" />
                  {t('common.king')}
                </button>
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
                    onChange={(event) => updatePoints(player.id, event.target.value)}
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

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button size="lg" onClick={handleSubmit} className="w-full sm:w-auto">
            {isEditing ? t('game.saveTurn') : t('game.submitTurn')}
          </Button>
          {isEditing ? (
            <Button
              variant="secondary"
              size="lg"
              onClick={onCancelEditingTurn}
              className="w-full sm:w-auto"
            >
              {t('common.cancel')}
            </Button>
          ) : session.turns.length > 0 ? (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onStartEditingTurn(session.turns.length - 1)}
              className="w-full sm:w-auto"
            >
              {t('game.editPrevious')}
            </Button>
          ) : null}
        </div>
        {showSummary && (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
            {t('game.errors.turnIncomplete')}
          </p>
        )}
      </div>
    </div>
  )
}
