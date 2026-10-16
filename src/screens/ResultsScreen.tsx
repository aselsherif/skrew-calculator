import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlayerAvatar } from '../components/PlayerAvatar'
import { TurnHistory } from '../components/TurnHistory'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CrownIcon } from '../components/ui/CrownIcon'
import { computeStandings, winnersOf } from '../game/rules'
import type { GameSession } from '../types/game'

interface ResultsScreenProps {
  session: GameSession
  onNewGame: () => void
  onStartEditingTurn: (index: number) => void
}

export function ResultsScreen({ session, onNewGame, onStartEditingTurn }: ResultsScreenProps) {
  const { t } = useTranslation()
  const [confirmNewGameOpen, setConfirmNewGameOpen] = useState(false)

  const standings = useMemo(
    () => computeStandings(session.players, session.turns),
    [session.players, session.turns],
  )
  const winners = winnersOf(standings)

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-center shadow-sm dark:border-amber-400/40 dark:bg-amber-400/10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-amber-950">
          <CrownIcon className="h-6 w-6" />
        </span>
        <p className="mt-3 text-lg font-bold text-amber-900 dark:text-amber-300">
          {winners.length === 1
            ? t('results.winnerBanner', {
                name: winners[0].player.name,
                score: winners[0].total,
              })
            : t('results.tieBanner', {
                names: winners.map((winner) => winner.player.name).join(t('common.listSeparator')),
              })}
        </p>
      </div>

      <Card title={t('results.title')} description={t('results.editHint')}>
        <ol className="space-y-3">
          {standings.map((standing) => {
            const isWinner = standing.rank === 1
            return (
              <li
                key={standing.player.id}
                className={`flex items-center gap-3 rounded-xl border p-3 sm:p-4 ${
                  isWinner
                    ? 'border-amber-300 bg-amber-50 dark:border-amber-400/40 dark:bg-amber-400/10'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isWinner
                      ? 'bg-amber-400 text-amber-950'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {standing.rank}
                </span>
                <PlayerAvatar
                  avatarId={standing.player.avatarId}
                  name={standing.player.name}
                  className="h-8 w-8 text-sm"
                />
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
                    {standing.player.name}
                  </span>
                  {isWinner && (
                    <Badge tone="amber">
                      <CrownIcon className="h-3.5 w-3.5" />
                      {t('results.winnerBadge')}
                    </Badge>
                  )}
                </div>
                <div className="flex shrink-0 items-baseline gap-1">
                  <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {standing.total}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {t('common.points')}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </Card>

      <TurnHistory session={session} onEditTurn={onStartEditingTurn} />

      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={() => setConfirmNewGameOpen(true)}
          className="w-full sm:w-auto"
        >
          {t('results.newGame')}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmNewGameOpen}
        title={t('restart.title')}
        message={t('restart.message')}
        confirmLabel={t('restart.confirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => {
          setConfirmNewGameOpen(false)
          onNewGame()
        }}
        onCancel={() => setConfirmNewGameOpen(false)}
      />
    </div>
  )
}
