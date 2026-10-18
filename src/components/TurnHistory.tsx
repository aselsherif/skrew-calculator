import { useTranslation } from 'react-i18next'
import { computeStandings, effectivePoints, totalForPlayer } from '../game/rules'
import type { GameSession } from '../types/game'
import { PlayerAvatar } from './PlayerAvatar'
import { RankBadge } from './RankBadge'
import { Card } from './ui/Card'
import { CrownIcon } from './ui/CrownIcon'

interface TurnHistoryProps {
  session: GameSession
  onEditTurn?: (index: number) => void
}

export function TurnHistory({ session, onEditTurn }: TurnHistoryProps) {
  const { t } = useTranslation()

  if (session.turns.length === 0) {
    return null
  }

  const standings = computeStandings(session.players, session.turns)
  const rankByPlayer = new Map(standings.map((standing) => [standing.player.id, standing.rank]))

  return (
    <Card title={t('game.history')}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-sm">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400">
              <th className="py-2 pe-3 text-start font-medium">{t('common.player')}</th>
              {session.turns.map((turn) => {
                const isBeingEdited = turn.index === session.editingTurnIndex
                return (
                  <th
                    key={turn.index}
                    className={`px-2 py-2 text-center font-medium ${
                      isBeingEdited ? 'rounded-t-lg bg-indigo-50 dark:bg-indigo-500/10' : ''
                    }`}
                  >
                    {onEditTurn ? (
                      <button
                        type="button"
                        onClick={() => onEditTurn(turn.index)}
                        aria-label={t('game.editTurn', { number: turn.index + 1 })}
                        title={t('game.editTurn', { number: turn.index + 1 })}
                        className="rounded px-1.5 py-0.5 font-medium text-indigo-600 transition-colors hover:bg-indigo-50 hover:underline dark:text-indigo-400 dark:hover:bg-indigo-500/10"
                      >
                        {t('game.turnShort', { number: turn.index + 1 })}
                      </button>
                    ) : (
                      t('game.turnShort', { number: turn.index + 1 })
                    )}
                  </th>
                )
              })}
              <th className="py-2 ps-3 text-center font-medium">{t('common.total')}</th>
            </tr>
          </thead>
          <tbody>
            {session.players.map((player) => (
              <tr key={player.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-2 pe-3 text-start font-medium text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <PlayerAvatar
                      seed={player.avatarSeed}
                      name={player.name}
                      className="h-6 w-6 text-xs"
                    />
                    <span className="min-w-0 truncate">{player.name}</span>
                    <RankBadge
                      rank={rankByPlayer.get(player.id) ?? 0}
                      className="shrink-0"
                    />
                  </span>
                </td>
                {session.turns.map((turn) => {
                  const entry = turn.entries.find(
                    (candidate) => candidate.playerId === player.id,
                  )
                  const isBeingEdited = turn.index === session.editingTurnIndex
                  return (
                    <td
                      key={turn.index}
                      className={`px-2 py-2 text-center text-slate-600 dark:text-slate-300 ${
                        isBeingEdited ? 'bg-indigo-50 dark:bg-indigo-500/10' : ''
                      }`}
                    >
                      {entry ? (
                        entry.isKing ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                            <CrownIcon className="h-3.5 w-3.5" />0
                          </span>
                        ) : (
                          effectivePoints(entry)
                        )
                      ) : (
                        '—'
                      )}
                    </td>
                  )
                })}
                <td className="py-2 ps-3 text-center font-bold text-slate-900 dark:text-slate-100">
                  <span className="inline-flex items-center justify-center gap-1.5">
                    {totalForPlayer(session.turns, player.id)}
                    <RankBadge rank={rankByPlayer.get(player.id) ?? 0} compact />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
