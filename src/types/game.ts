export type GameModeId = 'regular'

export type AvatarId =
  | 'cat'
  | 'dog'
  | 'bear'
  | 'rabbit'
  | 'fox'
  | 'penguin'
  | 'star'
  | 'heart'
  | 'bolt'
  | 'moon'
  | 'drop'
  | 'leaf'
  | 'gem'
  | 'shield'
  | 'cloud'
  | 'smile'
  | 'flame'
  | 'sparkles'

export interface Player {
  id: string
  name: string
  avatarId: AvatarId | null
}

export interface NewPlayerInput {
  name: string
  avatarId: AvatarId
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
