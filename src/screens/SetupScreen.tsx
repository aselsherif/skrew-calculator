import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AvatarPickerDialog } from '../components/AvatarPickerDialog'
import { PlayerAvatar } from '../components/PlayerAvatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { createAvatarSeed } from '../game/bigHeads'
import { DEFAULT_MODE_ID, GAME_MODES } from '../game/modes'
import { MAX_NAME_LENGTH, MAX_PLAYERS, MIN_PLAYERS } from '../game/players'
import type { GameModeId, NewPlayerInput } from '../types/game'

type NameError = 'nameRequired' | 'nameTooLong' | 'nameDuplicate'

interface SetupPlayer {
  id: string
  name: string
  avatarSeed: string
}

interface SetupScreenProps {
  onStart: (modeId: GameModeId, players: NewPlayerInput[]) => void
}

function validateName(
  rawName: string,
  players: readonly SetupPlayer[],
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
  const [players, setPlayers] = useState<SetupPlayer[]>([])
  const [nameInput, setNameInput] = useState('')
  const [nameError, setNameError] = useState<NameError | null>(null)
  const [pickerPlayerId, setPickerPlayerId] = useState<string | null>(null)

  const canStart = players.length >= MIN_PLAYERS
  const pickerPlayer = players.find((player) => player.id === pickerPlayerId) ?? null

  function handleAddPlayer() {
    const result = validateName(nameInput, players)
    if (result.error) {
      setNameError(result.error)
      return
    }
    setPlayers((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name: result.name,
        avatarSeed: createAvatarSeed(),
      },
    ])
    setNameInput('')
    setNameError(null)
  }

  function handleRemovePlayer(playerId: string) {
    setPlayers((previous) => previous.filter((player) => player.id !== playerId))
    setNameError(null)
    if (pickerPlayerId === playerId) {
      setPickerPlayerId(null)
    }
  }

  function handleSelectSeed(seed: string) {
    if (pickerPlayerId !== null) {
      setPlayers((previous) =>
        previous.map((player) =>
          player.id === pickerPlayerId ? { ...player, avatarSeed: seed } : player,
        ),
      )
    }
    setPickerPlayerId(null)
  }

  function handleStart() {
    if (!canStart) {
      return
    }
    onStart(
      modeId,
      players.map((player) => ({ name: player.name, avatarSeed: player.avatarSeed })),
    )
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
          <>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              {t('avatars.setupHint')}
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="relative rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/60"
                >
                  <button
                    type="button"
                    onClick={() => setPickerPlayerId(player.id)}
                    aria-label={t('avatars.change', { name: player.name })}
                    title={t('avatars.change', { name: player.name })}
                    className="flex w-full flex-col items-center gap-2 rounded-xl p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <PlayerAvatar
                      seed={player.avatarSeed}
                      name={player.name}
                      className="h-14 w-14 text-xl"
                    />
                    <span className="w-full truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {player.name}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player.id)}
                    aria-label={t('setup.removePlayer', { name: player.name })}
                    className="absolute top-1.5 end-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </>
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

      <AvatarPickerDialog
        open={pickerPlayer !== null}
        playerName={pickerPlayer?.name ?? ''}
        selectedSeed={pickerPlayer?.avatarSeed ?? null}
        onSelect={handleSelectSeed}
        onClose={() => setPickerPlayerId(null)}
      />
    </div>
  )
}
