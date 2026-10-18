/**
 * Manifest for the single sound sprite in `public/sounds/sprite-<hash>.m4a`: 16 key clicks (keythm's sound.ogg, Apache-2.0)
 * followed by 4 dial ticks (Kenney UI Audio, CC0), see NOTICE. Offsets and durations are in seconds.
 * The file name carries a content hash, so /sounds/* can be cached immutably. Details: `.agents/docs/audio.md`.
 *
 * Format choice: AAC-LC in `.m4a`, mono, 32 kbps. One format plays everywhere; no `canPlayType` branch
 * and no `.ogg` fallback. See `.agents/docs/audio.md` for the measurement note (encoder delay, iOS caveat).
 */
export const SPRITE_HASH = '5fd10328';

export type SoundName = 'down' | 'up';

/** [start, duration] pairs in seconds. */
export const SPRITE: Record<SoundName, ReadonlyArray<readonly [number, number]>> = {
  down: [
    [0.04, 0.09],
    [0.17, 0.09],
    [0.3, 0.09],
    [0.43, 0.09],
    [0.56, 0.09],
    [0.69, 0.09],
    [0.82, 0.09],
    [0.95, 0.09],
    [1.08, 0.09],
    [1.21, 0.09],
    [1.34, 0.09],
    [1.47, 0.09],
  ],
  up: [
    [1.6, 0.06],
    [1.7, 0.06],
    [1.8, 0.06],
    [1.9, 0.06],
  ],
};

export const spriteUrl = () => `/sounds/sprite-${SPRITE_HASH}.m4a`;

/** Deterministic string hash (FNV-1a), so a key id always maps to the same sample. */
export function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Dial detent slices as [start, duration] seconds, packed after the key clicks in the same sprite: three variants, then a heavier one for the 0/100 stops. */
export const DIAL_SPRITE = {
  tick: [
    [2.12, 0.0216],
    [2.1616, 0.0216],
    [2.2031, 0.0216],
  ],
  stop: [2.2447, 0.0216],
} as const;
