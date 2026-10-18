---
name: skrew-avatars
description: Use when working on player avatars — BigHead configs, deterministic seeds, the 20 preset options, the avatar picker dialog, avatar rendering sizes, or the @bigheads/core integration in the Skrew calculator.
---

# Skrew Avatars (@bigheads/core)

Players store a compact `avatarSeed: string`. The BigHead config is derived
deterministically from that seed, so refresh/reload always renders the same
character without storing the full config.

## Pipeline

`src/game/bigHeads.ts`:

1. `createAvatarSeed()` → `crypto.randomUUID()` (new players get a fresh seed).
2. `bigHeadConfigFromSeed(seed)`:
   - `hashString` (FNV-1a 32-bit) → `createRandom` (mulberry32 PRNG).
   - Picks every part from curated value lists (weighted by repetition, e.g.
     `'none'` appears multiple times in `ACCESSORIES`, `GRAPHICS`, `HATS`).
   - Neutral fixed choices: `body: 'chest'`, `faceMask: false`, `mask: true`
     (keeps the blue circle backdrop), clothing limited to
     `shirt/dressShirt/vneck/tankTop` (no `naked`/`dress`).
3. `AVATAR_PRESETS` — 20 fixed seed strings (`skrew-avatar-N`) curated so the
   whole set covers every hairstyle, skin tone, eye, eyebrow, mouth, hair
   color, clothing, clothing color, lip color, and accessory variant at least
   once (verified by an automated coverage check).

## Determinism requirement (important)

`@bigheads/core`'s `BigHead` picks **random parts per render** for any prop it
does not receive (`Math.random()` in default parameters). Therefore
`PlayerAvatar` must pass the complete `Required<AvatarProps>` config — never
render `<BigHead />` without the full config or avatars will flicker/change.

Note: every BigHead renders an internal `<mask id="mask">`; ids repeat across
avatars, but all masks are identical so browsers resolve correctly. Do not
rename or dedupe without testing.

## Rendering (`src/components/PlayerAvatar.tsx`)

- Props: `seed?: string | null`, `name`, `className` (size via classes, e.g.
  `h-8 w-8`). The SVG has no width/height; a wrapper span with
  `overflow-hidden rounded-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full`
  controls the size and circular crop. Config is memoized per seed.
- `seed` missing/empty → initials fallback (first character, works for
  Arabic) on a neutral slate circle. Normalization guarantees seeds for stored
  sessions, so the fallback is defensive only.
- Sizes in use: setup cards `h-14 w-14`, picker `h-14 w-14`, game rows `h-8 w-8`,
  history `h-6 w-6`, results `h-8 w-8`.

## Picker (`src/components/AvatarPickerDialog.tsx`)

- Shows the 20 `AVATAR_PRESETS` in a scrollable grid
  (`max-h-[60vh] overflow-y-auto`, `grid-cols-4 sm:grid-cols-5`).
- If the player's current seed is not a preset (legacy/random), it is
  prepended and marked as selected (`aria-pressed`, indigo ring).
- Selecting an option stores that seed and closes the dialog.
- **Shuffle is hidden, not removed**: `const SHOW_SHUFFLE = false` at the top.
  Flip it to `true` to swap the grid to 8 random seeds from
  `createAvatarSeed()` plus the Shuffle button (`buildShuffledOptions`).
  Keep both builders (`buildPresetOptions`, `buildShuffledOptions`).

## Package notes

- Dependency: `@bigheads/core@0.3.3` (MIT, peer `react >=16`; works with
  React 19). Use `import { BigHead } from '@bigheads/core'`; types ship via
  `dist/index.d.ts` (`AvatarProps`).
- Do **not** switch to the renamed `beanheads` package: it declares a broken
  ESM entry (`module: dist/core.esm.js` missing on disk) and needed a Vite
  alias. `@bigheads/core` resolves natively; there is intentionally no alias
  in `vite.config.ts`.

## Changing or regenerating presets

Curate by seed, never by hand-editing configs (storage only holds seeds):
write a throwaway tsx script that scores candidate seeds by how many
uncovered values they add per field, greedily select 20, verify coverage, then
paste the chosen seeds into `AVATAR_PRESETS` (keep them sorted for readability).
