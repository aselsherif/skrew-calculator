import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { ThemeSwitcher } from './components/ThemeSwitcher'
import { getGameMode } from './game/modes'
import { useGameSession } from './hooks/useGameSession'
import { GameScreen } from './screens/GameScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { SetupScreen } from './screens/SetupScreen'

function App() {
  const { t } = useTranslation()
  const {
    session,
    startGame,
    submitTurn,
    startEditingTurn,
    cancelEditingTurn,
    resetGame,
  } = useGameSession()

  const isEditing = session !== null && session.editingTurnIndex !== null
  const showGameScreen = session !== null && (session.phase === 'playing' || isEditing)
  const showResults = session !== null && session.phase === 'finished' && !isEditing

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold sm:text-3xl">{t('app.title')}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('app.subtitle')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </header>

        <main className="flex-1">
          {session === null || session.phase === 'setup' ? (
            <SetupScreen onStart={startGame} />
          ) : null}
          {showGameScreen ? (
            <GameScreen
              session={session}
              mode={getGameMode(session.modeId)}
              onSubmitTurn={submitTurn}
              onStartEditingTurn={startEditingTurn}
              onCancelEditingTurn={cancelEditingTurn}
              onRestart={resetGame}
            />
          ) : null}
          {showResults ? (
            <ResultsScreen
              session={session}
              onNewGame={resetGame}
              onStartEditingTurn={startEditingTurn}
            />
          ) : null}
        </main>

        <footer className="text-center text-xs text-slate-400 dark:text-slate-500">
          {t('app.footer')}
        </footer>
      </div>
    </div>
  )
}

export default App
