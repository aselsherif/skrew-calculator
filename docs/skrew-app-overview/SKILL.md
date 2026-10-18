---
name: skrew-app-overview
description: Use when you need the big picture of the Skrew calculator app — stack, directory layout, app flow (setup → playing → finished), and where each concern lives. Load this before making changes that span multiple areas.
---

# Skrew Calculator — App Overview

Web app to track scores for the card game **Skrew** (Regular mode: 5 turns,
lowest total wins). Built with Vite + React 19 + TypeScript, styled with
Tailwind CSS v4, internationalized with react-i18next (EN/AR + RTL), and
persisted to localStorage behind a storage interface.

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite 6 (`vite.config.ts`, dev server port 4000) |
| UI | React 19, function components + hooks only |
| Types | TypeScript strict (`noUnusedLocals`, `noUnusedParameters`) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` (no tailwind.config file) |
| i18n | i18next + react-i18next, synchronous init, EN + AR |
| Avatars | `@bigheads/core` (BigHead component), seeded deterministically |
| Persistence | `localStorage` behind `GameStorage` interface |

## App flow

`GameSession.phase` drives the screen rendered by `src/App.tsx`:

- **setup** (or no session) → `SetupScreen` (`src/screens/SetupScreen.tsx`):
  choose mode, add players with avatars, start.
- **playing** → `GameScreen` (`src/screens/GameScreen.tsx`): enter/save turn
  scores, king toggles, sticky turn action bar, turn history.
- **finished** → `ResultsScreen` (`src/screens/ResultsScreen.tsx`): ranked
  standings (ascending), winner highlight, per-turn breakdown, New Game.

Editing override: when `session.editingTurnIndex !== null`, `GameScreen` is
shown even if `phase === 'finished'` (editing a submitted turn from results).

## Directory map

```
src/
  main.tsx                  entry; imports ./index.css and ./i18n
  App.tsx                   shell: header (logo/title/switchers), routing by phase
  index.css                 Tailwind import, dark variant, base styles
  types/game.ts             Player, TurnEntry, Turn, GameSession, AvatarSeed types
  game/
    modes.ts                GAME_MODES registry (turn count, king rule, ranking)
    rules.ts                pure scoring: parsePoints, effectivePoints, totals,
                            computeStandings, winnersOf
    bigHeads.ts             seed → BigHead config, AVATAR_PRESETS
  storage/gameStorage.ts    GameStorage interface + localStorage impl + validation
  hooks/
    useGameSession.ts       session state machine + persistence
    useTheme.ts             theme preference state
  theme/theme.ts            theme preference helpers (light/dark/system)
  i18n/
    index.ts                i18next init, direction handling, language persistence
    locales/en.json, ar.json
  components/
    PlayerAvatar.tsx        renders BigHead from seed (initials fallback)
    AvatarPickerDialog.tsx  20 preset options (shuffle hidden behind flag)
    TurnActionBar.tsx       sticky prev/next/cancel/submit bar
    TurnHistory.tsx         submitted turns table with edit affordances
    LanguageSwitcher.tsx, ThemeSwitcher.tsx, ScrewIcon.tsx
    ui/                     Button, Card, Badge, Modal, ConfirmDialog, CrownIcon
  screens/
    SetupScreen.tsx, GameScreen.tsx, ResultsScreen.tsx
public/screw.svg            favicon (screw logo)
docs/                       these skills
```

## Architecture rules

- Game rules and score math live in `src/game/*` and are pure functions; UI
  never re-implements them.
- Every persisted shape is validated and normalized on load (see
  `skrew-persistence`). Never throw on bad data — fall back to `null`.
- All user-facing text goes through i18n keys (see `skrew-i18n-rtl`).
- Colors always come in light+dark pairs (see `skrew-theming`).

## Related skills

`skrew-game-logic`, `skrew-ui-screens`, `skrew-persistence`,
`skrew-i18n-rtl`, `skrew-theming`, `skrew-avatars`, `skrew-dev-workflow`.
