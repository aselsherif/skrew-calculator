import type { Player, Turn, TurnEntry } from '../types/game'

export const MAX_TURN_POINTS = 999

export function parsePoints(raw: string): number | null {
  const trimmed = raw.trim()
  if (!/^\d+$/.test(trimmed)) {
    return null
  }
  const value = Number(trimmed)
  if (!Number.isSafeInteger(value) || value > MAX_TURN_POINTS) {
    return null
  }
  return value
}

export function effectivePoints(entry: TurnEntry): number {
  return entry.isKing ? 0 : entry.points
}

export function totalForPlayer(turns: readonly Turn[], playerId: string): number {
  return turns.reduce((total, turn) => {
    const entry = turn.entries.find((candidate) => candidate.playerId === playerId)
    return total + (entry ? effectivePoints(entry) : 0)
  }, 0)
}

export interface PlayerStanding {
  player: Player
  total: number
  rank: number
}

export function computeStandings(
  players: readonly Player[],
  turns: readonly Turn[],
): PlayerStanding[] {
  const sorted = players
    .map((player) => ({ player, total: totalForPlayer(turns, player.id) }))
    .sort((a, b) => a.total - b.total || a.player.name.localeCompare(b.player.name))

  let previousTotal: number | null = null
  let rank = 0

  return sorted.map((standing, index) => {
    if (previousTotal === null || standing.total !== previousTotal) {
      rank = index + 1
    }
    previousTotal = standing.total
    return { ...standing, rank }
  })
}

export function winnersOf(standings: readonly PlayerStanding[]): PlayerStanding[] {
  return standings.filter((standing) => standing.rank === 1)
}
