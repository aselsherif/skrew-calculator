import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar.json'
import en from './locales/en.json'

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

const RTL_LANGUAGES: readonly Language[] = ['ar']
const LANGUAGE_STORAGE_KEY = 'skrew:language'

function isSupportedLanguage(value: string | null): value is Language {
  return value !== null && (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}

function getInitialLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isSupportedLanguage(stored)) {
      return stored
    }
  } catch {
    // Storage unavailable; fall back to the default language.
  }
  return 'en'
}

function applyLanguageToDocument(language: string) {
  const isRtl = RTL_LANGUAGES.includes(language as Language)
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', language)
  document.title = i18n.t('app.title')
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  initAsync: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

applyLanguageToDocument(i18n.language)

i18n.on('languageChanged', (language) => {
  applyLanguageToDocument(language)
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Storage unavailable; the language still applies for this session.
  }
})

export default i18n
