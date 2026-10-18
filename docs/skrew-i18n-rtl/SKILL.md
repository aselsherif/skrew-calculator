---
name: skrew-i18n-rtl
description: Use when adding or changing user-facing text, adding a language, or working on Arabic/RTL behavior in the Skrew calculator. Covers src/i18n/*, locale JSON files, and direction handling.
---

# Skrew i18n and RTL

## Setup (`src/i18n/index.ts`)

- i18next + react-i18next with **synchronous** init:
  `initAsync: false` and `react: { useSuspense: false }`. Do not remove these —
  translations must be ready on first paint and the app has no Suspense
  boundary.
- Resources are imported JSON: `src/i18n/locales/en.json`,
  `src/i18n/locales/ar.json` (nested `translation` namespace).
- `SUPPORTED_LANGUAGES = ['en', 'ar']`; initial language from
  `localStorage['skrew:language']`, fallback `'en'`.
- `applyLanguageToDocument` runs on init and on every `languageChanged`:
  sets `<html dir="ltr|rtl">`, `<html lang>`, and `document.title`
  (`app.title`). Language choice is persisted in the same handler.

## Adding a string

1. Add the key to `en.json` **and** `ar.json` in the same nested location.
2. Use it via `const { t } = useTranslation()` → `t('section.key', { vars })`.
3. Never hardcode text in components; never leave a key only in one locale.

Current top-level sections: `app`, `language`, `theme`, `common`, `setup`,
`modes.<id>`, `avatars`, `game`, `restart`, `results`.

## RTL rules

- Layout must mirror automatically. Use **logical utilities only**:
  `ps-/pe-` (padding), `ms-/me-` (margin), `start-/end-` (inset),
  `text-start/text-end`, `border-s/border-e`. Never `pl/pr/ml/mr/left/right`.
- Flex rows reverse automatically with `dir="rtl"` — do not reorder DOM for RTL.
- Directional icons flip with the `rtl:` variant, e.g. the sticky bar
  chevrons use `rtl:rotate-180`.
- Numbers stay Western digits; formatting is plain `String(number)`.
- Arabic joins use `common.listSeparator` (`، `) when concatenating names.

## Verification recipe

Before finishing an i18n change, assert key parity between locales, e.g. with
a throwaway tsx script: import both JSON files, diff their key sets, and fail
on any missing counterpart. (See `skrew-dev-workflow` for how to run scripts.)

## Gotcha

`document.title` is set from `app.title` on language change, so keep that key
short and product-like (`Skrew Calculator` / `حاسبة سكرو`).
