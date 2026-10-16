import type { AvatarProps } from '@bigheads/core'

export type BigHeadConfig = Required<AvatarProps>

export function createAvatarSeed(): string {
  return crypto.randomUUID()
}

// 20 fixed avatar options. These seeds were curated so that, across the set,
// every hairstyle, skin tone, eye, eyebrow, mouth, accessory, hat, clothing
// and color variant appears at least once.
export const AVATAR_PRESETS: readonly string[] = [
  'skrew-avatar-1',
  'skrew-avatar-2',
  'skrew-avatar-3',
  'skrew-avatar-4',
  'skrew-avatar-5',
  'skrew-avatar-6',
  'skrew-avatar-7',
  'skrew-avatar-8',
  'skrew-avatar-9',
  'skrew-avatar-10',
  'skrew-avatar-11',
  'skrew-avatar-13',
  'skrew-avatar-21',
  'skrew-avatar-158',
  'skrew-avatar-194',
  'skrew-avatar-219',
  'skrew-avatar-222',
  'skrew-avatar-441',
  'skrew-avatar-500',
  'skrew-avatar-572',
]

function hashString(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function createRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(random: () => number, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)]
}

const SKIN_TONES = ['light', 'yellow', 'brown', 'dark', 'red', 'black'] as const
const EYES = [
  'normal',
  'leftTwitch',
  'happy',
  'content',
  'squint',
  'simple',
  'dizzy',
  'wink',
  'heart',
] as const
const EYEBROWS = ['raised', 'leftLowered', 'serious', 'angry', 'concerned'] as const
const MOUTHS = ['grin', 'sad', 'openSmile', 'lips', 'open', 'serious', 'tongue'] as const
const HAIR = ['none', 'long', 'bun', 'short', 'pixie', 'balding', 'buzz', 'afro', 'bob'] as const
const FACIAL_HAIR = ['none', 'none2', 'none3', 'stubble', 'mediumBeard'] as const
const CLOTHING = ['shirt', 'dressShirt', 'vneck', 'tankTop'] as const
const ACCESSORIES = [
  'none',
  'none',
  'none',
  'roundGlasses',
  'tinyGlasses',
  'shades',
] as const
const GRAPHICS = [
  'none',
  'none',
  'none',
  'none',
  'redwood',
  'gatsby',
  'vue',
  'react',
  'graphQL',
] as const
const HATS = ['none', 'none2', 'none3', 'none4', 'none5', 'beanie', 'turban'] as const
const HAIR_COLORS = ['blonde', 'orange', 'black', 'white', 'brown', 'blue', 'pink'] as const
const CLOTHING_COLORS = ['white', 'blue', 'black', 'green', 'red'] as const
const LIP_COLORS = ['red', 'purple', 'pink', 'turqoise', 'green'] as const

export function bigHeadConfigFromSeed(seed: string): BigHeadConfig {
  const random = createRandom(hashString(seed))
  return {
    skinTone: pick(random, SKIN_TONES),
    eyes: pick(random, EYES),
    eyebrows: pick(random, EYEBROWS),
    mouth: pick(random, MOUTHS),
    hair: pick(random, HAIR),
    facialHair: pick(random, FACIAL_HAIR),
    clothing: pick(random, CLOTHING),
    accessory: pick(random, ACCESSORIES),
    graphic: pick(random, GRAPHICS),
    hat: pick(random, HATS),
    body: 'chest',
    hairColor: pick(random, HAIR_COLORS),
    clothingColor: pick(random, CLOTHING_COLORS),
    circleColor: 'blue',
    lipColor: pick(random, LIP_COLORS),
    hatColor: pick(random, CLOTHING_COLORS),
    faceMaskColor: pick(random, CLOTHING_COLORS),
    mask: true,
    faceMask: false,
    lashes: random() > 0.5,
  }
}
