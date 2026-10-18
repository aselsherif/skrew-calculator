---
name: skrew-ui-screens
description: Use when editing screens, shared components, the sticky turn action bar, turn history table, dialogs, or layout/responsive/routing behavior in the Skrew calculator. Covers src/screens/*, src/components/*, and App.tsx.
---

# Skrew UI and Screens

## Routing (no router library)

`src/App.tsx` picks the screen purely from session state:

```ts
const isEditing = session !== null && session.editingTurnIndex !== null
const showGameScreen = session !== null && (session.phase === 'playing' || isEditing)
const showResults = session !== null && session.phase === 'finished' && !isEditing
// no session or phase 'setup' → SetupScreen
```

Header: screw logo badge + translated title, `LanguageSwitcher`, `ThemeSwitcher`
(wraps below the title on small screens). Page container is `max-w-3xl`, padded
`px-4 py-6 sm:px-6 sm:py-10`. Footer gets `pb-20` while GameScreen is visible
so the fixed action bar never covers it.

## Screens

### SetupScreen (`src/screens/SetupScreen.tsx`)
- Mode cards rendered from `GAME_MODES` (radio-style buttons with `aria-pressed`).
- Player input with validation: required, max 20 chars, case-insensitive
  duplicates; Enter key adds. Errors shown under the input via `setup.errors.*`.
- Constants live in `src/game/players.ts`: `MIN_PLAYERS = 4`,
  `MAX_PLAYERS = 10`, `MAX_NAME_LENGTH = 20` (shared with the GameScreen
  removal guard).
- Added players render as small cards in a `grid grid-cols-2 sm:grid-cols-3`:
  avatar on top, truncated name below. Tapping the card opens the avatar
  picker; a floating ✕ button (absolute, `end-1.5`) removes the player.
- Start button disabled until `MIN_PLAYERS`; hint text shows the requirement.

### GameScreen (`src/screens/GameScreen.tsx`)
- Thin shell (~120 lines): resolves the active turn (new vs edit), delegates
  all form state to `useTurnDraft`, owns layout and the restart/remove dialogs.
- `useTurnDraft` (`src/hooks/useTurnDraft.ts`) — drafts/errors/showSummary
  state, `changePoints`, `toggleKing`, `checkKing` (validates first, then
  `crownLowestScorers`), `submit` (validates, builds entries, clears the
  draft, calls `onSubmitTurn`), `clearFeedback`.
- Game-specific components in `src/components/game/`:
  - `TurnHeader` — title ("Turn X of Y" / "Editing Turn N"), restart button,
    king hint, progress bar, Check King button.
  - `ScoreEntryForm` — computes projected totals (excluding the edited turn)
    and renders one `PlayerScoreRow` per player + the validation summary.
  - `PlayerScoreRow` — avatar, name, amber King badge, king toggle pill,
    remove (✕) button, points input, projected total, inline error.
  - `RestartGameDialog` / `RemovePlayerDialog` — thin translation wrappers
    around `ConfirmDialog`.
- `pb-28` on the root so the fixed bar clears the last card.

### ResultsScreen (`src/screens/ResultsScreen.tsx`)
- Winner banner (crown badge, winner name + score, tie variant listing all
  rank-1 names joined with `common.listSeparator`).
- Ranked list: rank circle, avatar, name, rank badge, total. Winner rows are
  amber-highlighted.
- Top-3 rows show `RankBadge` medals (rank 1 King / amber, rank 2 Prince /
  sky, rank 3 Knight / violet; labels from `ranks.*`). In `TurnHistory` the
  labeled badge sits beside the player name and a compact icon-only badge
  (title + aria-label) marks the total cell, so current standing is visible
  mid-game too.
- `TurnHistory` with edit affordances; "New Game" confirmed via `ConfirmDialog`.

## Sticky TurnActionBar (`src/components/TurnActionBar.tsx`)

- Fixed bottom bar: `fixed inset-x-0 bottom-0 z-40`, translucent
  `bg-white/95 backdrop-blur-sm dark:bg-slate-900/95`, safe-area padding
  `pb-[max(0.75rem,env(safe-area-inset-bottom))]`.
- Contents: grouped previous/next chevron buttons (disabled at bounds), center
  position label, cancel (✕) button only while editing, primary
  submit/save button.
- Chevrons carry `rtl:rotate-180` so "back" points the right way in Arabic.
- All buttons have translated `aria-label` + `title` (`game.previousTurn`,
  `game.nextTurn`, `common.cancel`).

## TurnHistory (`src/components/TurnHistory.tsx`)

- Returns `null` when there are no submitted turns.
- Horizontally scrollable table (`overflow-x-auto`, `min-w-[28rem]`): player
  column (avatar + name + King/Prince/Knight label for top-3 ranks), one
  column per turn, total column.
- When `onEditTurn` is provided, turn headers are buttons
  (`game.editTurn` aria-label) and the column being edited is tinted
  (`bg-indigo-50 dark:bg-indigo-500/10`).

## Reusable UI (`src/components/ui/`)

- `Button` — variants `primary | secondary | ghost | danger`, sizes
  `sm | md | lg`, focus-visible ring with `ring-offset` pair for dark mode.
- `Card` — optional `title`/`description`, rounded-2xl bordered surface.
- `Badge` — tones `amber | emerald | indigo | slate` with dark variants.
- `Modal` — the dialog shell: backdrop click + Escape close, body scroll lock,
  `role="dialog"` + `aria-labelledby` via `useId`.
- `ConfirmDialog` — Modal + message + cancel (autoFocus) / danger confirm.
- `CrownIcon` — used for kings and winners.
- `RankBadge` — medal chip/icon for ranks 1-3 (King/Prince/Knight) with its
  own sword and shield SVG icons; renders nothing for rank 4+.

## Conventions

- Mobile-first; buttons full width on mobile (`w-full sm:w-auto`).
- Inputs stay 16px effective font size (avoid iOS zoom); score input is
  `w-24`, `inputMode="numeric"`, spinners hidden globally in `index.css`.
- Use logical utilities only: `ps-/pe-/ms-/me-/text-start/end-*` — never
  `pl/pr/ml/mr`, so RTL mirrors automatically.
- Every color class has a `dark:` counterpart (see `skrew-theming`).
- Interactive controls need `aria-pressed` (toggles) or translated
  `aria-label`; validation summaries use `role="alert"`.
