---
name: skrew-theming
description: Use when working on light/dark mode, the theme switcher, the no-flash script, or adding dark styles to new/existing components in the Skrew calculator.
---

# Skrew Theming (Light / Dark / System)

## Pieces

| Piece | Responsibility |
| --- | --- |
| `src/theme/theme.ts` | Pure helpers: storage key `skrew:theme`, `getStoredTheme()`, `resolveTheme()` (system via `matchMedia`), `applyTheme()` (toggles `.dark` on `<html>`), `persistTheme()` |
| `src/hooks/useTheme.ts` | `preference` state + effect that applies/persists, and listens to OS changes while in `system` mode |
| `src/components/ThemeSwitcher.tsx` | 3-button segmented control (light/dark/system) with translated labels |
| `src/index.css` | `@custom-variant dark (&:where(.dark, .dark *));`, `html { color-scheme: light }`, `html.dark { color-scheme: dark }`, body background per theme |
| `index.html` | Inline no-flash script: reads `skrew:theme` before first paint and toggles `.dark` |

## How dark mode works

Tailwind v4 is configured for the **class strategy**, not media queries:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

So `dark:` utilities activate when `<html class="dark">` is present — which is
managed by `applyTheme()` / the inline script. "System" resolves to dark/light
via `prefers-color-scheme` and live-updates through the `useTheme` media
listener.

## Style conventions

- Every color utility gets a dark counterpart, e.g.
  `bg-white dark:bg-slate-900`, `text-slate-900 dark:text-slate-100`,
  `border-slate-200 dark:border-slate-800`.
- Accent tints use low-opacity fills in dark mode, e.g.
  `bg-indigo-50 dark:bg-indigo-500/10`,
  `bg-amber-50 dark:bg-amber-400/10`.
- Focus rings: pair ring offset with the surface:
  `focus-visible:ring-offset-slate-100 dark:focus-visible:ring-offset-slate-950`.
- Disabled inputs: `disabled:bg-slate-100 dark:disabled:bg-slate-800`,
  `disabled:text-slate-400 dark:disabled:text-slate-500`.
- Input placeholders: `placeholder:text-slate-400 dark:placeholder:text-slate-500`.
- Body/overscroll background comes from `index.css` (`--color-slate-100` /
  `--color-slate-950`); the App root repeats the colors for the main surface.
- Fixed layers (action bar, modals) need their own translucent dark surface,
  e.g. `bg-white/95 dark:bg-slate-900/95` and
  `bg-slate-950/60` backdrops.

## When adding a component

1. Copy dark pairs from a sibling component (Button/Card/Badge are the
   canonical references in `src/components/ui/`).
2. Check both themes mentally for: surfaces, borders, text tiers
   (900/500/400), error tones (`text-rose-600 dark:text-rose-400`), and
   focus rings.
3. Colored elements that carry their own background (e.g. avatar circles,
   indigo logo badge, amber winner rows) usually work on both themes — verify
   they keep enough contrast but don't blanket-add dark overrides.

## Do not

- Do not use `dark:` with opacity-only tricks on text (poor contrast).
- Do not reintroduce the old media-query behavior (`@media prefers-color-scheme`)
  — the manual switcher must always win; only the `system` preference consults
  the OS.
