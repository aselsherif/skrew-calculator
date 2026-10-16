import type { GameModeId } from '../types/game'

export interface GameModeDefinition {
  id: GameModeId
  turnCount: number
  allowMultipleKings: boolean
  ranking: 'ascending' | 'descending'
}

export const GAME_MODES: readonly GameModeDefinition[] = [
  {
    id: 'regular',
    turnCount: 5,
    allowMultipleKings: true,
    ranking: 'ascending',
  },
]

export const DEFAULT_MODE_ID: GameModeId = 'regular'

export function getGameMode(id: GameModeId): GameModeDefinition {
  const mode = GAME_MODES.find((candidate) => candidate.id === id)
  if (!mode) {
    throw new Error(`Unknown game mode: ${id}`)
  }
  return mode
}
