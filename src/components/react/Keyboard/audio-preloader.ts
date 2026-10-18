/** Fetch the sound sprite once and decode it once, without needing a user gesture. */
import { spriteUrl } from './key-sprite';

export { type SoundName } from './key-sprite';

let bytes: Promise<ArrayBuffer | undefined> | null = null;
let decoded: Promise<AudioBuffer | undefined> | null = null;

/** Fetch the raw sprite. Reuses the `<link rel=preload as=fetch>` request injected by Base.astro. */
export function fetchSoundBytes(): Promise<ArrayBuffer | undefined> {
  bytes ??= fetch(spriteUrl())
    .then((res) => (res.ok ? res.arrayBuffer() : undefined))
    .catch(() => undefined);
  return bytes;
}

/**
 * Decode the sprite once. An `OfflineAudioContext` can decode without a user gesture and without creating the
 * (costly, autoplay-gated) realtime context; the resulting `AudioBuffer` plays on any context, resampled as needed.
 * Browsers without it fall back to `fallback()` (a realtime context). Resolves undefined when fetch or decode fails.
 */
export function decodeSprite(
  fallback: () => AudioContext | null,
): Promise<AudioBuffer | undefined> {
  decoded ??= fetchSoundBytes().then(async (raw) => {
    if (!raw) return undefined;
    try {
      const Offline =
        window.OfflineAudioContext ??
        (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext })
          .webkitOfflineAudioContext;
      const c: BaseAudioContext | null = Offline ? new Offline(1, 1, 48000) : fallback();
      return c ? await c.decodeAudioData(raw.slice(0)) : undefined;
    } catch {
      return undefined;
    }
  });
  return decoded;
}
