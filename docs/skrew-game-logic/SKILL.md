---
name: skrew-game-logic
description: Use when changing game rules, scoring, turn handling, king toggles, ranking, winner calculation, score validation, or adding new game modes in the Skrew calculator. Covers src/game/*, src/types/game.ts, and the session state machine in useGameSession.
---

# Skrew Game Logic

## Domain model (`src/types/game.ts`)

```ts
interface Player { id: string; name: string; avatarSeed: string | null }
interface TurnEntry { playerId: string; points: number; isKing: boolean }
interface Turn { index: number; entries: TurnEntry[] }
interface GameSession {
  modeId: GameModeId                       // 'regular'
  phase: 'setup' | 'playing' | 'finished'
  players: Player[]
  turns: Turn[]                            // submitted turns, index = position
  editingTurnIndex: number | null          // non-null while updating a turn
}
```

## Game modes (`src/game/modes.ts`)

Modes are data, not branches. To add a mode:

1. Add its id to `GameModeId` in `src/types/game.ts`.
2. Add an entry to `GAME_MODES` with `turnCount`, `allowMultipleKings`,
   `ranking` (`'ascending'` = lowest wins, `'descending'` = highest wins).
3. Add translations under `modes.<id>.name` / `modes.<id>.description` in both
   locale files. Setup and Game screens render from the registry automatically.

Regular mode: `turnCount: 5`, `allowMultipleKings: true`, `ranking: 'ascending'`.

## Rules (`src/game/rules.ts`) — keep pure, no React imports

- `MAX_TURN_POINTS = 999`; `parsePoints(raw)` returns `number | null` —
  accepts only whole numbers `0..999` (rejects empty, negatives, decimals,
  non-numeric).
- `effectivePoints(entry)` = `entry.isKing ? 0 : entry.points`. A king always
  scores 0 for that turn regardless of typed points.
- `totalForPlayer(turns, playerId)` — sum of effective points across turns.
- `computeStandings(players, turns)` — ascending by total, ties share a
  **competition rank** (1, 1, 3), name is a stable tiebreaker. Lowest total =
  rank 1 = winner.
- `winnersOf(standings)` — all rank-1 players (ties produce multiple winners;
  ResultsScreen shows a tie banner).
- Ranks map to titles in the UI (`ranks.king` / `ranks.prince` / `ranks.knight`
  via `RankBadge`): rank 1 King, 2 Prince, 3 Knight.

## King behavior

- Toggling is per-player; multiple kings per turn are allowed
  (`mode.allowMultipleKings`). If a future mode sets it `false`, GameScreen
  keeps the exclusive-king path (turning one on clears others).
- King rows skip score validation entirely; when submitted, king entries are
  stored with `points: 0, isKing: true`. Toggling a king off restores normal
  entry (previously submitted kings lose their typed points — that is expected).

## Turn lifecycle (`src/hooks/useGameSession.ts`)

- `submitTurn(entries)` decides append vs update based on
  `editingTurnIndex`:
  - editing → replaces that turn's entries in place; later turns are NOT lost.
  - not editing → appends as `{ index: turns.length, entries }`.
  - Either way `withPhaseForTurns` recomputes `phase`
    (`turns.length >= turnCount ? 'finished' : 'playing'`) and clears
    `editingTurnIndex`.
- `startEditingTurn(index)` / `cancelEditingTurn()` manage the editing flag
  (persisted, so refresh keeps you in the editor).
- `removePlayer(playerId)` — mid-game removal. Refuses when
  `players.length <= MIN_PLAYERS` (4, from `src/game/players.ts`); otherwise
  drops the player and filters their entries out of every submitted turn.
  Session shape stays compatible with storage (no schema change).
- `resetGame()` sets session to `null` → back to setup. Always confirm via
  `ConfirmDialog` before calling (see GameScreen/ResultsScreen).

## Editing + navigation semantics (GameScreen)

- Position model: `activePosition = editingTurn ? editingTurn.index : turns.length`.
  - Previous is enabled when `activePosition > 0`.
  - Next is enabled while editing; moving past the last submitted turn calls
    `cancelEditingTurn()` (back to new-turn entry). From a finished game,
    closing the editor returns to Results.
- In-progress drafts are preserved per turn in GameScreen state, keyed
  `'new'` for the entry form and `'edit-<index>'` for editors. Drafts are
  deleted on successful submit so saved values reload fresh. Validation errors
  live in GameScreen too (`errors`, `showSummary`) and clear on edit/navigation.

## Gotchas

- Never mutate `turns` or `entries`; always produce new arrays/objects.
- Validation counts: a turn can only be submitted when every non-king player
  has a valid whole number; error messages come from `game.errors.*` keys.
- The history table shows `effectivePoints`, so kings render as crown + `0`.
