import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../i18n'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {SUPPORTED_LANGUAGES.map((language) => {
        const active = i18n.resolvedLanguage === language
        return (
          <button
            key={language}
            type="button"
            aria-pressed={active}
            onClick={() => void i18n.changeLanguage(language)}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors ${
              active
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {t(`language.${language}`)}
          </button>
        )
      })}
    </div>
  )
}
