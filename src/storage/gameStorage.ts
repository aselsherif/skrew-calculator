import { isAvatarId } from '../game/avatars'
import { GAME_MODES } from '../game/modes'
import type { GamePhase, GameSession, Player, Turn, TurnEntry } from '../types/game'

export const GAME_SESSION_STORAGE_KEY = 'skrew:game-session:v1'

export interface GameStorage {
  load(): GameSession | null
  save(session: GameSession): void
  clear(): void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

type StoredPlayer = Omit<Player, 'avatarId'> & { avatarId?: unknown }

function isPlayer(value: unknown): value is StoredPlayer {
  return (
    isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string'
  )
}

function isTurnEntry(value: unknown): value is TurnEntry {
  return (
    isRecord(value) &&
    typeof value.playerId === 'string' &&
    typeof value.points === 'number' &&
    typeof value.isKing === 'boolean'
  )
}

function isTurn(value: unknown): value is Turn {
  return (
    isRecord(value) &&
    typeof value.index === 'number' &&
    Array.isArray(value.entries) &&
    value.entries.every(isTurnEntry)
  )
}

function isGamePhase(value: unknown): value is GamePhase {
  return value === 'setup' || value === 'playing' || value === 'finished'
}

type StoredGameSession = Omit<GameSession, 'editingTurnIndex' | 'players'> & {
  editingTurnIndex?: unknown
  players: StoredPlayer[]
}

function isGameSession(value: unknown): value is StoredGameSession {
  return (
    isRecord(value) &&
    typeof value.modeId === 'string' &&
    GAME_MODES.some((mode) => mode.id === value.modeId) &&
    isGamePhase(value.phase) &&
    Array.isArray(value.players) &&
    value.players.every(isPlayer) &&
    Array.isArray(value.turns) &&
    value.turns.every(isTurn)
  )
}

export class LocalStorageGameStorage implements GameStorage {
  constructor(private readonly key: string = GAME_SESSION_STORAGE_KEY) {}

  load(): GameSession | null {
    try {
      const raw = window.localStorage.getItem(this.key)
      if (!raw) {
        return null
      }
      const parsed: unknown = JSON.parse(raw)
      if (!isGameSession(parsed)) {
        return null
      }
      const players = parsed.players.map((player) => ({
        ...player,
        avatarId: isAvatarId(player.avatarId) ? player.avatarId : null,
      }))
      const editingTurnIndex =
        typeof parsed.editingTurnIndex === 'number' &&
        parsed.editingTurnIndex >= 0 &&
        parsed.editingTurnIndex < parsed.turns.length
          ? parsed.editingTurnIndex
          : null
      return { ...parsed, players, editingTurnIndex }
    } catch {
      // Corrupted or unavailable storage: start a fresh session instead of crashing.
      return null
    }
  }

  save(session: GameSession): void {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(session))
    } catch {
      // Quota or privacy-mode errors are ignored; the game keeps working in memory.
    }
  }

  clear(): void {
    try {
      window.localStorage.removeItem(this.key)
    } catch {
      // Nothing to do if storage is unavailable.
    }
  }
}

export const gameStorage: GameStorage = new LocalStorageGameStorage()
