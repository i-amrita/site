/**
 * Manifest for the single sound sprite in `public/sounds/sprite-<hash>.{ogg,m4a}`: 16 key clicks (keythm's sound.ogg, Apache-2.0)
 * followed by 4 dial ticks (Kenney UI Audio, CC0), see NOTICE. Offsets and durations are in seconds.
 * The file name carries a content hash, so /sounds/* can be cached immutably. Details: `.agents/docs/audio.md`.
 */
export const SPRITE_HASH = 'f17e74f3';

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

export type SoundExt = 'ogg' | 'm4a';

/** Any WebKit engine: Safari and every iOS browser (CriOS/FxiOS wrap WebKit), but not Blink-based Chrome/Edge. */
export function isWebKit(
  ua = typeof navigator === 'undefined' ? '' : navigator.userAgent,
): boolean {
  return /AppleWebKit/.test(ua) && !/(Chrome|Chromium|Edg|OPR)\//.test(ua) && !/Android/.test(ua);
}

/**
 * AAC in m4a on WebKit, Ogg Opus elsewhere (AAC when Opus is unplayable). WebKit gets m4a even when `canPlayType`
 * claims Opus: that probe describes `<audio>` and has been optimistic where `decodeAudioData` is not, and m4a is
 * the one format every iOS version decodes. `audio-preloader.ts` also retries the other format if decode fails.
 * Base.astro repeats this rule inline for the head preload; keep them in sync.
 */
export function soundExtension(): SoundExt {
  if (typeof Audio === 'undefined' || isWebKit()) return 'm4a';
  return new Audio().canPlayType('audio/ogg; codecs="opus"') ? 'ogg' : 'm4a';
}

export const spriteUrl = (ext: SoundExt = soundExtension()) =>
  `/sounds/sprite-${SPRITE_HASH}.${ext}`;

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
