import type { Player, TurnEntry } from '../types/game'
import { parsePoints } from './rules'

export interface DraftEntry {
  points: string
  isKing: boolean
}

export type DraftState = Record<string, DraftEntry>

export function createDraft(
  players: readonly Player[],
  entries?: readonly TurnEntry[],
): DraftState {
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

export function crownLowestScorers(
  draft: DraftState,
  playerIds: readonly string[],
  allowMultipleKings: boolean,
): DraftState {
  const parsed = new Map<string, number>()
  for (const playerId of playerIds) {
    const entry = draft[playerId]
    const value = entry ? parsePoints(entry.points) : null
    if (value !== null) {
      parsed.set(playerId, value)
    }
  }

  if (parsed.size === 0) {
    return draft
  }

  const lowest = Math.min(...parsed.values())
  const lowestIds = playerIds.filter((playerId) => parsed.get(playerId) === lowest)
  const kingIds = allowMultipleKings ? lowestIds : lowestIds.slice(0, 1)

  const next: DraftState = {}
  for (const [playerId, entry] of Object.entries(draft)) {
    next[playerId] = { ...entry, isKing: kingIds.includes(playerId) }
  }
  return next
}
