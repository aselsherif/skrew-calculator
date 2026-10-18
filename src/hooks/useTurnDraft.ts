import { useState } from 'react'
import { createDraft, crownLowestScorers, type DraftState } from '../game/draft'
import type { GameModeDefinition } from '../game/modes'
import { parsePoints } from '../game/rules'
import type { GameSession, Turn, TurnEntry } from '../types/game'

interface UseTurnDraftOptions {
  session: GameSession
  mode: GameModeDefinition
  activeKey: string
  editingTurn: Turn | null
  onSubmitTurn: (entries: TurnEntry[]) => void
}

export function useTurnDraft({
  session,
  mode,
  activeKey,
  editingTurn,
  onSubmitTurn,
}: UseTurnDraftOptions) {
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSummary, setShowSummary] = useState(false)

  const draft = drafts[activeKey] ?? createDraft(session.players, editingTurn?.entries)

  function setActiveDraft(next: DraftState) {
    setDrafts((previous) => ({ ...previous, [activeKey]: next }))
    setShowSummary(false)
  }

  function clearFeedback() {
    setErrors({})
    setShowSummary(false)
  }

  function clearError(playerId: string) {
    setErrors((previous) => {
      if (!previous[playerId]) {
        return previous
      }
      const next = { ...previous }
      delete next[playerId]
      return next
    })
  }

  function validateDraft(): Record<string, string> {
    const nextErrors: Record<string, string> = {}
    for (const player of session.players) {
      const entry = draft[player.id]
      if (!entry || entry.isKing) {
        continue
      }
      if (entry.points.trim().length === 0) {
        nextErrors[player.id] = 'game.errors.pointsRequired'
      } else if (parsePoints(entry.points) === null) {
        nextErrors[player.id] = 'game.errors.pointsInvalid'
      }
    }
    return nextErrors
  }

  function reportErrors(nextErrors: Record<string, string>): boolean {
    if (Object.keys(nextErrors).length === 0) {
      return false
    }
    setErrors(nextErrors)
    setShowSummary(true)
    return true
  }

  function changePoints(playerId: string, value: string) {
    setActiveDraft({
      ...draft,
      [playerId]: { ...draft[playerId], points: value },
    })
    clearError(playerId)
  }

  function toggleKing(playerId: string) {
    const entry = draft[playerId]
    let next: DraftState
    if (mode.allowMultipleKings) {
      next = { ...draft, [playerId]: { ...entry, isKing: !entry.isKing } }
    } else {
      const turningOn = !entry.isKing
      next = {}
      for (const [id, candidate] of Object.entries(draft)) {
        next[id] = { ...candidate, isKing: turningOn && id === playerId }
      }
    }
    setActiveDraft(next)
    clearError(playerId)
  }

  function checkKing() {
    if (reportErrors(validateDraft())) {
      return
    }
    setActiveDraft(
      crownLowestScorers(
        draft,
        session.players.map((player) => player.id),
        mode.allowMultipleKings,
      ),
    )
    clearFeedback()
  }

  function submit() {
    if (reportErrors(validateDraft())) {
      return
    }

    const entries: TurnEntry[] = session.players.map((player) => {
      const entry = draft[player.id]
      return {
        playerId: player.id,
        points: entry?.isKing ? 0 : (parsePoints(entry?.points ?? '') ?? 0),
        isKing: entry?.isKing ?? false,
      }
    })

    setDrafts((previous) => {
      const next = { ...previous }
      delete next[activeKey]
      return next
    })
    clearFeedback()
    onSubmitTurn(entries)
  }

  return {
    draft,
    errors,
    showSummary,
    changePoints,
    toggleKing,
    checkKing,
    submit,
    clearFeedback,
  }
}
