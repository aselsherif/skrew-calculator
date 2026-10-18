---
name: skrew-dev-workflow
description: Use when running builds, lint, the dev server, or verifying changes to the Skrew calculator — including the SSR-based throwaway check pattern used to validate rendering, determinism, and persistence without a test runner.
---

# Skrew Dev Workflow

## Commands

| Task | Command | Notes |
| --- | --- | --- |
| Dev server | `yarn dev` | Port **4000** (set in `vite.config.ts`) |
| Lint | `yarn lint` | ESLint 9 flat config, TS + react-hooks + react-refresh |
| Build (typecheck) | `yarn build` | `tsc -b && vite build` — the only typecheck gate |
| Preview build | `yarn preview` | |
| Add dep | `yarn add <pkg>` | Yarn 1 |

Always finish a change with `yarn lint && yarn build`. There is no test
runner installed; do not add one unless asked.

## TypeScript configuration facts

- Solution-style tsconfig: `tsconfig.app.json` (src, DOM libs) and
  `tsconfig.node.json` (vite.config.ts). `resolveJsonModule` was added for
  locale imports — keep it.
- Strict extras that bite: `noUnusedLocals`, `noUnusedParameters`,
  `noUncheckedSideEffectImports`. Hidden-behind-flag code (e.g. the avatar
  shuffle path) must still be *referenced* or it fails the build.

## Tailwind CSS v4 facts

- No `tailwind.config.js`. Theme tokens live in `src/index.css` under `@theme`.
- Dark mode uses a custom variant (class strategy):
  `@custom-variant dark (&:where(.dark, .dark *));`
- Plugin is `@tailwindcss/vite` in `vite.config.ts`.
- RTL variant (`rtl:`) and logical utilities are built in.

## Verification pattern (SSR smoke tests)

No test framework — verify behavior with throwaway scripts rendered via
`react-dom/server`. This catches runtime errors and lets you assert on markup
(string seeds → deterministic SVG, translations, dialog contents, etc.).

Recipe:

1. Create a temporary `.<name>-check.tsx` file in the **project root**.
   ESLint's flat config lints dotfiles too, so always delete the file before
   running `yarn lint`.
2. Shim the browser before importing app modules:
   ```ts
   ;(globalThis as unknown as { window: unknown }).window = {
     localStorage: { /* Map-backed fake */ },
     matchMedia: () => ({ matches: false, addEventListener: () => undefined, removeEventListener: () => undefined }),
   }
   ;(globalThis as unknown as { document: unknown }).document = {
     documentElement: { setAttribute: () => undefined, classList: { toggle: () => undefined } },
     title: '', body: { style: {} },
   }
   ```
3. `await import('./src/i18n/index.ts')` **first** (components need i18n and
   it touches `document`), then dynamically import the modules under test.
4. Run with the app tsconfig so `jsx: react-jsx` applies:
   `npx --yes tsx --tsconfig tsconfig.app.json ./.name-check.tsx`
   (running from a temp dir fails: React can't be resolved, and without the
   tsconfig you get `React is not defined`).
5. Delete the file afterwards. Remember SSR does **not** run `useEffect` —
   assert only on initial-render output, or make initial output correct (that
   is why `AvatarPickerDialog` initializes options in a lazy `useState`).

Recommended checks after risky changes:

- `renderToStaticMarkup` of the touched screen/component (no throw + key
  strings present).
- Determinism checks for seeded content (same input → identical markup).
- Storage: fake `localStorage`, feed legacy/corrupt payloads through
  `LocalStorageGameStorage.load()` and assert normalized output.
- Locale parity: key lists of `en.json` vs `ar.json` must match.
- Dev-server smoke: start `yarn dev`, `curl -s -o /dev/null -w "%{http_code}"`
  `http://localhost:4000/`, then kill vite.

## Gotchas observed so far

- An inline anti-flash script in `index.html` reads `skrew:theme`; never
  reorder it after the module script.
- `crypto.randomUUID()` is used freely (dev/prod are secure contexts).
- react-i18next is initialized synchronously; if components render `t()` keys
  instead of text, check `initAsync`/`useSuspense` settings in
  `src/i18n/index.ts` first.
- ESLint `react-refresh/only-export-components` warns when a file exports
  both components and non-components; keep constants/helpers in separate
  modules (see `src/game/*`).
