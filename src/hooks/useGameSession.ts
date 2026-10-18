import { useCallback, useEffect, useState } from 'react'
import { getGameMode } from '../game/modes'
import { MIN_PLAYERS } from '../game/players'
import { gameStorage, type GameStorage } from '../storage/gameStorage'
import type { GameModeId, GameSession, NewPlayerInput, Turn, TurnEntry } from '../types/game'

function createPlayerId(): string {
  return crypto.randomUUID()
}

function withPhaseForTurns(
  session: GameSession,
  turns: Turn[],
  editingTurnIndex: number | null,
): GameSession {
  const mode = getGameMode(session.modeId)
  return {
    ...session,
    turns,
    editingTurnIndex,
    phase: turns.length >= mode.turnCount ? 'finished' : 'playing',
  }
}

export function useGameSession(storage: GameStorage = gameStorage) {
  const [session, setSession] = useState<GameSession | null>(() => storage.load())

  useEffect(() => {
    if (session) {
      storage.save(session)
    } else {
      storage.clear()
    }
  }, [session, storage])

  const startGame = useCallback((modeId: GameModeId, players: readonly NewPlayerInput[]) => {
    setSession({
      modeId,
      phase: 'playing',
      players: players.map((player) => ({
        id: createPlayerId(),
        name: player.name.trim(),
        avatarSeed: player.avatarSeed,
      })),
      turns: [],
      editingTurnIndex: null,
    })
  }, [])

  const submitTurn = useCallback((entries: readonly TurnEntry[]) => {
    setSession((previous) => {
      if (!previous) {
        return previous
      }
      const mode = getGameMode(previous.modeId)

      if (previous.editingTurnIndex !== null) {
        const index = previous.editingTurnIndex
        if (index < 0 || index >= previous.turns.length) {
          return { ...previous, editingTurnIndex: null }
        }
        const turns = previous.turns.map((turn, position) =>
          position === index ? { ...turn, entries: [...entries] } : turn,
        )
        return withPhaseForTurns(previous, turns, null)
      }

      if (previous.phase !== 'playing' || previous.turns.length >= mode.turnCount) {
        return previous
      }
      const turns = [...previous.turns, { index: previous.turns.length, entries: [...entries] }]
      return withPhaseForTurns(previous, turns, null)
    })
  }, [])

  const startEditingTurn = useCallback((index: number) => {
    setSession((previous) => {
      if (!previous || index < 0 || index >= previous.turns.length) {
        return previous
      }
      return { ...previous, editingTurnIndex: index }
    })
  }, [])

  const cancelEditingTurn = useCallback(() => {
    setSession((previous) =>
      previous && previous.editingTurnIndex !== null
        ? { ...previous, editingTurnIndex: null }
        : previous,
    )
  }, [])

  const removePlayer = useCallback((playerId: string) => {
    setSession((previous) => {
      if (!previous || previous.players.length <= MIN_PLAYERS) {
        return previous
      }
      const players = previous.players.filter((player) => player.id !== playerId)
      if (players.length === previous.players.length) {
        return previous
      }
      const turns = previous.turns.map((turn) => ({
        ...turn,
        entries: turn.entries.filter((entry) => entry.playerId !== playerId),
      }))
      return { ...previous, players, turns }
    })
  }, [])

  const resetGame = useCallback(() => {
    setSession(null)
  }, [])

  return {
    session,
    startGame,
    submitTurn,
    startEditingTurn,
    cancelEditingTurn,
    removePlayer,
    resetGame,
  }
}
