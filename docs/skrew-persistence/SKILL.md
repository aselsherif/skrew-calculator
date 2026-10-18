---
name: skrew-persistence
description: Use when changing what gets stored, the session schema, storage keys, load-time validation/normalization, or when integrating a backend/database instead of localStorage in the Skrew calculator.
---

# Skrew Persistence

## Storage abstraction (`src/storage/gameStorage.ts`)

```ts
interface GameStorage {
  load(): GameSession | null
  save(session: GameSession): void
  clear(): void
}
```

`LocalStorageGameStorage` is the current implementation; a singleton
`gameStorage` is passed as the default parameter of `useGameSession(storage)`.
**To add a backend:** implement `GameStorage` (e.g. async-backed adapter) and
inject it into the hook; no component changes required.

## Keys

| Key | Value | Read/written by |
| --- | --- | --- |
| `skrew:game-session:v1` | serialized `GameSession` | `gameStorage` |
| `skrew:language` | `'en' \| 'ar'` | `src/i18n/index.ts` |
| `skrew:theme` | `'light' \| 'dark' \| 'system'` | `src/theme/theme.ts` + inline script in `index.html` |

## Session persistence flow

`useGameSession` saves on every session change and clears storage when the
session becomes `null` (New Game):

```ts
useEffect(() => {
  if (session) storage.save(session)
  else storage.clear()
}, [session, storage])
```

## Load-time validation and normalization (critical rules)

All reads are defensive; **never throw, never trust the payload**:

- Everything runs inside `try/catch`; JSON parse failures or storage
  unavailability return `null` (app starts fresh).
- Shape guards check: `modeId` exists in `GAME_MODES`, phase is a known enum
  value, players are `{ id: string, name: string }`, turns are
  `{ index: number, entries: TurnEntry[] }` with typed entries.
- Normalization on load (do not remove these when editing the schema):
  - `player.avatarSeed`: keep non-empty string; otherwise fall back to
    `player.id` (covers pre-avatar sessions and the removed legacy `avatarId`
    field). Output players are rebuilt explicitly, dropping unknown keys.
  - `editingTurnIndex`: keep only if integer within
    `[0, turns.length)`; otherwise `null`.
- Unknown extra fields on stored sessions are ignored (forward compatible).

## Schema evolution rules

1. Adding an optional field: accept missing on load and normalize to a default
   (like `avatarSeed` / `editingTurnIndex` do). Do not bump the key.
2. Changing an existing field's meaning: add a new field, migrate in
   `load()` from the old one, then stop writing the old one.
3. Only bump `GAME_SESSION_STORAGE_KEY` (v2) if data cannot be migrated;
   old sessions then silently reset to the setup screen.

## Practical checks before shipping storage changes

- Old session (missing new field) loads and plays.
- Corrupt JSON / wrong types → app loads to setup without crashing.
- Out-of-range values (e.g. `editingTurnIndex: 99`) → normalized to `null`.
- After change: `yarn lint && yarn build`, plus an SSR check with a fake
  `window.localStorage` (see `skrew-dev-workflow`).
