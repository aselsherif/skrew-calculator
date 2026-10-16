import { useCallback, useEffect, useState } from 'react'
import { getGameMode } from '../game/modes'
import { gameStorage, type GameStorage } from '../storage/gameStorage'
import type { GameModeId, GameSession, Turn, TurnEntry } from '../types/game'

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

  const startGame = useCallback((modeId: GameModeId, playerNames: readonly string[]) => {
    setSession({
      modeId,
      phase: 'playing',
      players: playerNames.map((name) => ({ id: createPlayerId(), name: name.trim() })),
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

  const resetGame = useCallback(() => {
    setSession(null)
  }, [])

  return { session, startGame, submitTurn, startEditingTurn, cancelEditingTurn, resetGame }
}
