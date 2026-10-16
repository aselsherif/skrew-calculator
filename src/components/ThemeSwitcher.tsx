import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'
import { THEME_PREFERENCES, type ThemePreference } from '../theme/theme'

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8m-4-4v4" />
    </svg>
  )
}

const themeIcons: Record<ThemePreference, JSX.Element> = {
  light: <SunIcon />,
  dark: <MoonIcon />,
  system: <MonitorIcon />,
}

export function ThemeSwitcher() {
  const { t } = useTranslation()
  const { preference, setThemePreference } = useTheme()

  return (
    <div
      role="group"
      aria-label={t('theme.label')}
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {THEME_PREFERENCES.map((value) => {
        const active = preference === value
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={t(`theme.${value}`)}
            title={t(`theme.${value}`)}
            onClick={() => setThemePreference(value)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              active
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {themeIcons[value]}
          </button>
        )
      })}
    </div>
  )
}
