export type GameModeId = 'regular'

export interface Player {
  id: string
  name: string
  avatarSeed: string | null
}

export interface NewPlayerInput {
  name: string
  avatarSeed: string
}

export interface TurnEntry {
  playerId: string
  points: number
  isKing: boolean
}

export interface Turn {
  index: number
  entries: TurnEntry[]
}

export type GamePhase = 'setup' | 'playing' | 'finished'

export interface GameSession {
  modeId: GameModeId
  phase: GamePhase
  players: Player[]
  turns: Turn[]
  editingTurnIndex: number | null
}
