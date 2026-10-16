export const THEME_STORAGE_KEY = 'skrew:theme'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system']

function isThemePreference(value: string | null): value is ThemePreference {
  return value !== null && (THEME_PREFERENCES as readonly string[]).includes(value)
}

export function getStoredTheme(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (isThemePreference(stored)) {
      return stored
    }
  } catch {
    // Storage unavailable; fall back to the system preference.
  }
  return 'system'
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return preference
}

export function applyTheme(preference: ThemePreference): void {
  document.documentElement.classList.toggle('dark', resolveTheme(preference) === 'dark')
}

export function persistTheme(preference: ThemePreference): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // Storage unavailable; the preference still applies for this session.
  }
}
