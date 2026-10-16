import { useTranslation } from 'react-i18next'
import { Button } from './ui/Button'

interface TurnActionBarProps {
  positionLabel: string
  submitLabel: string
  isEditing: boolean
  canGoPrevious: boolean
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
  onCancelEdit: () => void
  onSubmit: () => void
}

const iconButtonClasses =
  'flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800'

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 rtl:rotate-180"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 rtl:rotate-180"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function TurnActionBar({
  positionLabel,
  submitLabel,
  isEditing,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onCancelEdit,
  onSubmit,
}: TurnActionBarProps) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="flex shrink-0 items-center rounded-full border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            aria-label={t('game.previousTurn')}
            title={t('game.previousTurn')}
            className={iconButtonClasses}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            aria-label={t('game.nextTurn')}
            title={t('game.nextTurn')}
            className={iconButtonClasses}
          >
            <ChevronRightIcon />
          </button>
        </div>

        <span className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
          {positionLabel}
        </span>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            aria-label={t('common.cancel')}
            title={t('common.cancel')}
            className={`${iconButtonClasses} shrink-0 border border-slate-200 dark:border-slate-700`}
          >
            <CloseIcon />
          </button>
        )}

        <Button onClick={onSubmit} className="shrink-0">
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
