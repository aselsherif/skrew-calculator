import { useCallback, useEffect, useState } from 'react'
import {
  applyTheme,
  getStoredTheme,
  persistTheme,
  type ThemePreference,
} from '../theme/theme'

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(getStoredTheme)

  useEffect(() => {
    applyTheme(preference)
    persistTheme(preference)

    if (preference !== 'system') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [preference])

  const setThemePreference = useCallback((next: ThemePreference) => {
    setPreference(next)
  }, [])

  return { preference, setThemePreference }
}
