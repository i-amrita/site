/** Fetch the sound sprite once and decode it once, without needing a user gesture. */
import { soundExtension, spriteUrl, type SoundExt } from './key-sprite';

export { type SoundName } from './key-sprite';

const bytesByExt = new Map<SoundExt, Promise<ArrayBuffer | undefined>>();
let decoded: Promise<AudioBuffer | undefined> | null = null;

/** Fetch the raw sprite. The preferred format reuses the `<link rel=preload as=fetch>` request injected by Base.astro. */
export function fetchSoundBytes(
  ext: SoundExt = soundExtension(),
): Promise<ArrayBuffer | undefined> {
  let p = bytesByExt.get(ext);
  if (!p) {
    p = fetch(spriteUrl(ext))
      .then((res) => (res.ok ? res.arrayBuffer() : undefined))
      .catch(() => undefined);
    bytesByExt.set(ext, p);
  }
  return p;
}

/** Promise decode that also passes the legacy callbacks (Safari before 14.1 has no promise form). */
function decode(c: BaseAudioContext, raw: ArrayBuffer): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    const maybe = c.decodeAudioData(raw, resolve, reject) as Promise<AudioBuffer> | undefined;
    maybe?.then(resolve, reject);
  });
}

async function tryDecode(
  ext: SoundExt,
  fallback: () => AudioContext | null,
): Promise<AudioBuffer | undefined> {
  const raw = await fetchSoundBytes(ext);
  if (!raw) return undefined;
  try {
    const Offline =
      window.OfflineAudioContext ??
      (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext })
        .webkitOfflineAudioContext;
    const c: BaseAudioContext | null = Offline ? new Offline(1, 1, 48000) : fallback();
    return c ? await decode(c, raw.slice(0)) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Decode the sprite once. An `OfflineAudioContext` can decode without a user gesture and without creating the
 * (costly, autoplay-gated) realtime context; the resulting `AudioBuffer` plays on any context, resampled as needed.
 * Browsers without it fall back to `fallback()` (a realtime context). If the preferred format cannot be fetched or
 * decoded, the other one is tried. Resolves undefined when both fail; never rejects.
 */
export function decodeSprite(
  fallback: () => AudioContext | null,
): Promise<AudioBuffer | undefined> {
  decoded ??= (async () => {
    const first = soundExtension();
    const buf = await tryDecode(first, fallback);
    return buf ?? tryDecode(first === 'ogg' ? 'm4a' : 'ogg', fallback);
  })().catch(() => undefined);
  return decoded;
}
