import type { AvatarId } from '../types/game'

export interface AvatarPath {
  d: string
  tone?: 'fg' | 'bg'
}

export interface AvatarDefinition {
  id: AvatarId
  bg: string
  fg: string
  fillRule?: 'evenodd' | 'nonzero'
  paths: readonly (string | AvatarPath)[]
}

export const AVATARS: readonly AvatarDefinition[] = [
  {
    id: 'cat',
    bg: '#ffedd5',
    fg: '#ea580c',
    paths: [
      'M12 6a7.5 7.5 0 1 0 0 15a7.5 7.5 0 1 0 0-15z',
      'M5 4l1.6 6 3.6-3.2z',
      'M19 4l-1.6 6-3.6-3.2z',
      { d: 'M9.3 11.6a1.2 1.2 0 1 0 0 2.4a1.2 1.2 0 1 0 0-2.4z', tone: 'bg' },
      { d: 'M14.7 11.6a1.2 1.2 0 1 0 0 2.4a1.2 1.2 0 1 0 0-2.4z', tone: 'bg' },
      { d: 'M11.1 16.2h1.8L12 17.6z', tone: 'bg' },
    ],
  },
  {
    id: 'dog',
    bg: '#e0f2fe',
    fg: '#0284c7',
    paths: [
      'M4.8 8.2a2.4 4.4 0 1 0 0 8.8a2.4 4.4 0 1 0 0-8.8z',
      'M19.2 8.2a2.4 4.4 0 1 0 0 8.8a2.4 4.4 0 1 0 0-8.8z',
      'M12 6.5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z',
      { d: 'M12 14.7a3.1 2.1 0 1 0 0 4.2a3.1 2.1 0 1 0 0-4.2z', tone: 'bg' },
      { d: 'M9.4 11.4a1.1 1.1 0 1 0 0 2.2a1.1 1.1 0 1 0 0-2.2z', tone: 'bg' },
      { d: 'M14.6 11.4a1.1 1.1 0 1 0 0 2.2a1.1 1.1 0 1 0 0-2.2z', tone: 'bg' },
      { d: 'M11.2 15.7a0.9 0.9 0 1 0 0 1.8a0.9 0.9 0 1 0 0-1.8z' },
    ],
  },
  {
    id: 'bear',
    bg: '#f5f5f4',
    fg: '#78716c',
    paths: [
      'M7 4a2.6 2.6 0 1 0 0 5.2a2.6 2.6 0 1 0 0-5.2z',
      'M17 4a2.6 2.6 0 1 0 0 5.2a2.6 2.6 0 1 0 0-5.2z',
      'M12 6.6a7.2 7.2 0 1 0 0 14.4a7.2 7.2 0 1 0 0-14.4z',
      { d: 'M7 5.4a1.2 1.2 0 1 0 0 2.4a1.2 1.2 0 1 0 0-2.4z', tone: 'bg' },
      { d: 'M17 5.4a1.2 1.2 0 1 0 0 2.4a1.2 1.2 0 1 0 0-2.4z', tone: 'bg' },
      { d: 'M12 14.6a3.2 2.2 0 1 0 0 4.4a3.2 2.2 0 1 0 0-4.4z', tone: 'bg' },
      { d: 'M9.4 11.5a1.1 1.1 0 1 0 0 2.2a1.1 1.1 0 1 0 0-2.2z', tone: 'bg' },
      { d: 'M14.6 11.5a1.1 1.1 0 1 0 0 2.2a1.1 1.1 0 1 0 0-2.2z', tone: 'bg' },
      { d: 'M11.1 15.6a0.9 0.9 0 1 0 0 1.8a0.9 0.9 0 1 0 0-1.8z' },
    ],
  },
  {
    id: 'rabbit',
    bg: '#fce7f3',
    fg: '#db2777',
    paths: [
      'M9.4 1.2a1.8 4.6 0 1 0 0 9.2a1.8 4.6 0 1 0 0-9.2z',
      'M14.6 1.2a1.8 4.6 0 1 0 0 9.2a1.8 4.6 0 1 0 0-9.2z',
      'M12 8.6a6.6 6.6 0 1 0 0 13.2a6.6 6.6 0 1 0 0-13.2z',
      { d: 'M9.4 3a0.9 2.8 0 1 0 0 5.6a0.9 2.8 0 1 0 0-5.6z', tone: 'bg' },
      { d: 'M14.6 3a0.9 2.8 0 1 0 0 5.6a0.9 2.8 0 1 0 0-5.6z', tone: 'bg' },
      { d: 'M9.6 13.1a1.1 1.1 0 1 0 0 2.2a1.1 1.1 0 1 0 0-2.2z', tone: 'bg' },
      { d: 'M14.4 13.1a1.1 1.1 0 1 0 0 2.2a1.1 1.1 0 1 0 0-2.2z', tone: 'bg' },
      { d: 'M11.2 17.2h1.6L12 18.4z', tone: 'bg' },
    ],
  },
  {
    id: 'fox',
    bg: '#fee2e2',
    fg: '#dc2626',
    paths: [
      'M4.6 3.6l2.2 6.4 4-2.8z',
      'M19.4 3.6l-2.2 6.4-4-2.8z',
      'M12 7a7 7 0 1 0 0 14a7 7 0 1 0 0-14z',
      { d: 'M12 21.5l-4-4.5h8z', tone: 'bg' },
      { d: 'M9.3 11.5a1.1 1.1 0 1 0 0 2.2a1.1 1.1 0 1 0 0-2.2z', tone: 'bg' },
      { d: 'M14.7 11.5a1.1 1.1 0 1 0 0 2.2a1.1 1.1 0 1 0 0-2.2z', tone: 'bg' },
      { d: 'M11.1 17.8a0.9 0.9 0 1 0 0 1.8a0.9 0.9 0 1 0 0-1.8z' },
    ],
  },
  {
    id: 'penguin',
    bg: '#ccfbf1',
    fg: '#0f766e',
    paths: [
      'M12 4.6a6.6 8.4 0 1 0 0 16.8a6.6 8.4 0 1 0 0-16.8z',
      { d: 'M12 10a3.8 5.2 0 1 0 0 10.4a3.8 5.2 0 1 0 0-10.4z', tone: 'bg' },
      { d: 'M9.6 8.4a1 1 0 1 0 0 2a1 1 0 1 0 0-2z', tone: 'bg' },
      { d: 'M14.4 8.4a1 1 0 1 0 0 2a1 1 0 1 0 0-2z', tone: 'bg' },
      { d: 'M10.9 11.6h2.2L12 13.8z' },
    ],
  },
  {
    id: 'star',
    bg: '#fef3c7',
    fg: '#d97706',
    paths: [
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    ],
  },
  {
    id: 'heart',
    bg: '#ffe4e6',
    fg: '#e11d48',
    paths: [
      'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    ],
  },
  {
    id: 'bolt',
    bg: '#fef9c3',
    fg: '#ca8a04',
    paths: ['M13 2 3 14h9l-1 8 10-12h-9l1-8z'],
  },
  {
    id: 'moon',
    bg: '#e0e7ff',
    fg: '#4f46e5',
    paths: ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'],
  },
  {
    id: 'drop',
    bg: '#cffafe',
    fg: '#0891b2',
    paths: ['M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'],
  },
  {
    id: 'leaf',
    bg: '#d1fae5',
    fg: '#059669',
    paths: [
      'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z',
    ],
  },
  {
    id: 'gem',
    bg: '#ede9fe',
    fg: '#7c3aed',
    paths: ['M6 3h12l4 6-10 12L2 9l4-6z'],
  },
  {
    id: 'shield',
    bg: '#dbeafe',
    fg: '#2563eb',
    paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  },
  {
    id: 'cloud',
    bg: '#e2e8f0',
    fg: '#475569',
    paths: ['M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z'],
  },
  {
    id: 'smile',
    bg: '#ffedd5',
    fg: '#ea580c',
    fillRule: 'evenodd',
    paths: [
      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.6 9.6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3zM15.4 9.6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3zM7 14.5a5.5 5.5 0 0 1 10 0 6.5 6.5 0 0 0-10 0z',
    ],
  },
  {
    id: 'flame',
    bg: '#fee2e2',
    fg: '#dc2626',
    paths: [
      'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
    ],
  },
  {
    id: 'sparkles',
    bg: '#fae8ff',
    fg: '#c026d3',
    paths: [
      'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
    ],
  },
]

export const AVATAR_IDS: readonly AvatarId[] = AVATARS.map((avatar) => avatar.id)

export function getAvatar(id: AvatarId | null | undefined): AvatarDefinition | null {
  if (!id) {
    return null
  }
  return AVATARS.find((avatar) => avatar.id === id) ?? null
}

export function isAvatarId(value: unknown): value is AvatarId {
  return typeof value === 'string' && AVATARS.some((avatar) => avatar.id === value)
}

export function pickNextAvatarId(usedIds: Iterable<AvatarId>): AvatarId {
  const used = new Set(usedIds)
  const available = AVATARS.find((avatar) => !used.has(avatar.id))
  return available ? available.id : AVATAR_IDS[0]
}
