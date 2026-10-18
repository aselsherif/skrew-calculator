import { useTranslation } from "react-i18next";
import type { DraftEntry } from "../../game/draft";
import { MAX_TURN_POINTS } from "../../game/rules";
import type { Player } from "../../types/game";
import { PlayerAvatar } from "../PlayerAvatar";
import { Badge } from "../ui/Badge";
import { CrownIcon } from "../ui/CrownIcon";

interface PlayerScoreRowProps {
  player: Player;
  entry: DraftEntry;
  errorKey?: string;
  projectedTotal: number;
  canRemove: boolean;
  onPointsChange: (playerId: string, value: string) => void;
  onToggleKing: (playerId: string) => void;
  onRequestRemove: (player: Player) => void;
}

export function PlayerScoreRow({
  player,
  entry,
  errorKey,
  projectedTotal,
  canRemove,
  onPointsChange,
  onToggleKing,
  onRequestRemove,
}: PlayerScoreRowProps) {
  const { t } = useTranslation();

  const rowToneClasses = errorKey
    ? "border-rose-300 bg-rose-50/60 dark:border-rose-500/60 dark:bg-rose-500/10"
    : entry.isKing
    ? "border-amber-300 bg-amber-50/70 dark:border-amber-400/40 dark:bg-amber-400/10"
    : "border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40";

  return (
    <li className={`rounded-xl border p-3 sm:p-4 ${rowToneClasses}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <PlayerAvatar
            seed={player.avatarSeed}
            name={player.name}
            className="h-8 w-8 text-sm"
          />
          <span className="truncate font-semibold text-slate-800 dark:text-slate-100">
            {player.name}
          </span>
          {entry.isKing && (
            <Badge tone="amber">
              <CrownIcon className="h-3.5 w-3.5" />
              {t("common.king")}
            </Badge>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            aria-pressed={entry.isKing}
            aria-label={`${t("common.king")}: ${player.name}`}
            onClick={() => onToggleKing(player.id)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              entry.isKing
                ? "border-amber-400 bg-amber-400 text-amber-950"
                : "border-slate-300 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-amber-400/60 dark:hover:text-amber-300"
            }`}
          >
            <CrownIcon className="h-3.5 w-3.5" />
            {t("common.king")}
          </button>
          <button
            type="button"
            onClick={() => onRequestRemove(player)}
            disabled={!canRemove}
            aria-label={t("game.removePlayer", { name: player.name })}
            title={t("game.removePlayer", { name: player.name })}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 dark:hover:bg-rose-500/20 dark:hover:text-rose-300 dark:disabled:hover:text-slate-400"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {t("common.points")}
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_TURN_POINTS}
            value={entry.points}
            disabled={entry.isKing}
            onChange={(event) => onPointsChange(player.id, event.target.value)}
            aria-invalid={errorKey !== undefined}
            aria-label={`${t("common.points")}: ${player.name}`}
            className={`w-24 rounded-xl border bg-white px-3 py-2 text-slate-900 outline-none transition-colors focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 ${
              errorKey
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-500 dark:focus:border-rose-400 dark:focus:ring-rose-500/30"
                : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 dark:border-slate-700 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/30"
            }`}
          />
        </label>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {t("common.total")}:{" "}
          <strong className="text-slate-900 dark:text-slate-100">
            {projectedTotal}
          </strong>
        </span>
      </div>

      {errorKey && (
        <p
          role="alert"
          className="mt-2 text-sm text-rose-600 dark:text-rose-400"
        >
          {t(errorKey, { name: player.name, max: MAX_TURN_POINTS })}
        </p>
      )}
    </li>
  );
}
