/**
 * Manifest for the key-click sprite in `public/sounds/keys-<hash>.{ogg,m4a}`.
 * Trimmed from keythm's sound.ogg (Apache-2.0, see NOTICE). Offsets and durations are in seconds.
 * The file name carries a content hash, so /sounds/* can be cached immutably. Details: `.agents/docs/audio.md`.
 */
export const SPRITE_HASH = '4a8a26b2';

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

/** Ogg Opus where the browser can play it, AAC in m4a otherwise (Safari before 18.4). */
export function soundExtension(): 'ogg' | 'm4a' {
  const probe = typeof Audio === 'undefined' ? null : new Audio();
  return probe?.canPlayType('audio/ogg; codecs="opus"') ? 'ogg' : 'm4a';
}

export const spriteUrl = () => `/sounds/keys-${SPRITE_HASH}.${soundExtension()}`;

/** Deterministic string hash (FNV-1a), so a key id always maps to the same sample. */
export function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Dial detent sample slot (a 4-slice sprite, see DIAL_SPRITE): a separate tiny file so it can be swapped without touching the key sprite.
 * Drop `dial-<hash>.ogg` (Opus) and `dial-<hash>.m4a` (AAC) in `public/sounds/` and change this base path.
 * If the files are missing or fail to decode, the synthesized tick in `src/lib/audio.ts` plays instead.
 */
export const DIAL_SAMPLE_BASE = '/sounds/dial-b690a855';

/** Dial sprite slices as [start, duration] seconds: three detent variants, then a heavier one for the 0/100 stops. */
export const DIAL_SPRITE = {
  tick: [
    [0.02, 0.0216],
    [0.0616, 0.0216],
    [0.1031, 0.0216],
  ],
  stop: [0.1447, 0.0216],
} as const;

export const dialUrl = () => `${DIAL_SAMPLE_BASE}.${soundExtension()}`;
