import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DEFAULT_MODE_ID, GAME_MODES } from '../game/modes'
import type { GameModeId, Player } from '../types/game'

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 10
export const MAX_NAME_LENGTH = 20

type NameError = 'nameRequired' | 'nameTooLong' | 'nameDuplicate'

interface SetupScreenProps {
  onStart: (modeId: GameModeId, playerNames: string[]) => void
}

function validateName(
  rawName: string,
  players: readonly Player[],
): { error: NameError } | { error: null; name: string } {
  const name = rawName.trim()
  if (name.length === 0) {
    return { error: 'nameRequired' }
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { error: 'nameTooLong' }
  }
  const duplicate = players.some(
    (player) => player.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
  )
  if (duplicate) {
    return { error: 'nameDuplicate' }
  }
  return { error: null, name }
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const { t } = useTranslation()
  const [modeId, setModeId] = useState<GameModeId>(DEFAULT_MODE_ID)
  const [players, setPlayers] = useState<Player[]>([])
  const [nameInput, setNameInput] = useState('')
  const [nameError, setNameError] = useState<NameError | null>(null)

  const canStart = players.length >= MIN_PLAYERS

  function handleAddPlayer() {
    const result = validateName(nameInput, players)
    if (result.error) {
      setNameError(result.error)
      return
    }
    setPlayers((previous) => [...previous, { id: crypto.randomUUID(), name: result.name }])
    setNameInput('')
    setNameError(null)
  }

  function handleRemovePlayer(playerId: string) {
    setPlayers((previous) => previous.filter((player) => player.id !== playerId))
    setNameError(null)
  }

  function handleStart() {
    if (!canStart) {
      return
    }
    onStart(modeId, players.map((player) => player.name))
  }

  return (
    <div className="space-y-6">
      <Card title={t('setup.modeTitle')}>
        <div className="grid gap-3 sm:grid-cols-2">
          {GAME_MODES.map((mode) => {
            const active = mode.id === modeId
            return (
              <button
                key={mode.id}
                type="button"
                aria-pressed={active}
                onClick={() => setModeId(mode.id)}
                className={`rounded-xl border p-4 text-start transition-colors ${
                  active
                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:border-indigo-400 dark:bg-indigo-500/10 dark:ring-indigo-400'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600'
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {t(`modes.${mode.id}.name`)}
                  </span>
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? 'border-indigo-600 dark:border-indigo-400' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                  {t(`modes.${mode.id}.description`)}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      <Card
        title={t('setup.playersTitle')}
        description={t('setup.playersHint', { min: MIN_PLAYERS, max: MAX_PLAYERS })}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={nameInput}
            onChange={(event) => {
              setNameInput(event.target.value)
              setNameError(null)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAddPlayer()
              }
            }}
            placeholder={t('setup.playerNamePlaceholder')}
            aria-invalid={nameError !== null}
            aria-label={t('setup.playerNamePlaceholder')}
            className={`w-full rounded-xl border bg-white px-4 py-2.5 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              nameError
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-500 dark:focus:border-rose-400 dark:focus:ring-rose-500/30'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 dark:border-slate-700 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/30'
            }`}
          />
          <Button
            onClick={handleAddPlayer}
            disabled={players.length >= MAX_PLAYERS}
            className="sm:w-auto"
          >
            {t('setup.addPlayer')}
          </Button>
        </div>

        {nameError && (
          <p role="alert" className="mt-2 text-sm text-rose-600 dark:text-rose-400">
            {t(`setup.errors.${nameError}`, { max: MAX_NAME_LENGTH })}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {t('setup.playersTitle')}
          </span>
          <Badge tone={canStart ? 'indigo' : 'slate'}>
            {t('setup.playerCount', { count: players.length })}
          </Badge>
        </div>

        {players.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 ps-3 pe-1 dark:border-slate-700 dark:bg-slate-800"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {player.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(player.id)}
                  aria-label={t('setup.removePlayer', { name: player.name })}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex flex-col items-stretch gap-2 sm:items-end">
        <Button size="lg" onClick={handleStart} disabled={!canStart} className="w-full sm:w-auto">
          {t('setup.start')}
        </Button>
        {!canStart && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('setup.playersHint', { min: MIN_PLAYERS, max: MAX_PLAYERS })}
          </p>
        )}
      </div>
    </div>
  )
}
