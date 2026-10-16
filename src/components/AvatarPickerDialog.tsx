import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AVATAR_PRESETS, createAvatarSeed } from "../game/bigHeads";
import { PlayerAvatar } from "./PlayerAvatar";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";

interface AvatarPickerDialogProps {
  open: boolean;
  playerName: string;
  selectedSeed: string | null;
  onSelect: (seed: string) => void;
  onClose: () => void;
}

// Shuffle is kept in the code but hidden for now; flip this flag to re-enable it.
const SHOW_SHUFFLE = false;
const SHUFFLE_OPTION_COUNT = 8;

function buildPresetOptions(selectedSeed: string | null): string[] {
  const options = [...AVATAR_PRESETS];
  if (selectedSeed && !options.includes(selectedSeed)) {
    options.unshift(selectedSeed);
  }
  return options;
}

function buildShuffledOptions(selectedSeed: string | null): string[] {
  const seeds = Array.from({ length: SHUFFLE_OPTION_COUNT }, () =>
    createAvatarSeed()
  );
  if (selectedSeed) {
    seeds[0] = selectedSeed;
  }
  return seeds;
}

function ShuffleIcon() {
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
      <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  );
}

export function AvatarPickerDialog({
  open,
  playerName,
  selectedSeed,
  onSelect,
  onClose,
}: AvatarPickerDialogProps) {
  const { t } = useTranslation();
  const [options, setOptions] = useState<string[]>(() =>
    SHOW_SHUFFLE
      ? buildShuffledOptions(selectedSeed)
      : buildPresetOptions(selectedSeed)
  );

  useEffect(() => {
    if (open) {
      setOptions(
        SHOW_SHUFFLE
          ? buildShuffledOptions(selectedSeed)
          : buildPresetOptions(selectedSeed)
      );
    }
  }, [open, selectedSeed]);

  return (
    <Modal
      open={open}
      title={t("avatars.title", { name: playerName })}
      onClose={onClose}
    >
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {t("avatars.hint")}
      </p>
      <ul className="mt-4 grid max-h-[60vh] grid-cols-4 gap-3 overflow-visible pe-1 sm:grid-cols-5">
        {options.map((seed) => {
          const selected = seed === selectedSeed;
          return (
            <li key={seed}>
              <button
                type="button"
                aria-pressed={selected}
                aria-label={t("avatars.option")}
                onClick={() => onSelect(seed)}
                className={`flex items-center justify-center rounded-full p-0.5 transition-opacity ${
                  selected
                    ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                    : "hover:opacity-75"
                }`}
              >
                <PlayerAvatar
                  seed={seed}
                  name={playerName}
                  className="h-14 w-14 text-base"
                />
              </button>
            </li>
          );
        })}
      </ul>
      {SHOW_SHUFFLE ? (
        <div className="mt-4 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => setOptions(buildShuffledOptions(selectedSeed))}
          >
            <ShuffleIcon />
            {t("avatars.shuffle")}
          </Button>
        </div>
      ) : null}
    </Modal>
  );
}
