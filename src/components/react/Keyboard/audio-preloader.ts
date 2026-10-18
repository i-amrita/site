/** Fetch + decode the key-click sprite once per AudioContext and cache the buffer. */
import { dialUrl, spriteUrl } from './key-sprite';

export { type SoundName } from './key-sprite';

let bytes: Promise<ArrayBuffer | undefined> | null = null;
let pending: Promise<AudioBuffer | undefined> | null = null;
let pendingCtx: AudioContext | null = null;

/** Fetch the raw sprite without an AudioContext, so creating the context can wait for a user gesture. */
export function fetchSoundBytes(): Promise<ArrayBuffer | undefined> {
  bytes ??= fetch(spriteUrl())
    .then((res) => (res.ok ? res.arrayBuffer() : undefined))
    .catch(() => undefined);
  return bytes;
}

/** Decode the fetched sprite once per AudioContext. Resolves undefined when fetch or decode fails. */
export function loadSounds(ctx: AudioContext): Promise<AudioBuffer | undefined> {
  if (pending && pendingCtx === ctx) return pending;
  pendingCtx = ctx;
  pending = fetchSoundBytes().then(async (raw) => {
    try {
      // decodeAudioData detaches its input, so decode a copy and keep the bytes for another context.
      return raw ? await ctx.decodeAudioData(raw.slice(0)) : undefined;
    } catch {
      return undefined;
    }
  });
  return pending;
}

let dialBytes: Promise<ArrayBuffer | undefined> | null = null;
let dialPending: Promise<AudioBuffer | undefined> | null = null;
let dialCtx: AudioContext | null = null;

/** Fetch + decode the dial detent sample (separate file, see `DIAL_SAMPLE_BASE`). Undefined on failure. */
export function loadDialSample(ctx: AudioContext): Promise<AudioBuffer | undefined> {
  if (dialPending && dialCtx === ctx) return dialPending;
  dialCtx = ctx;
  dialBytes ??= fetch(dialUrl())
    .then((res) => (res.ok ? res.arrayBuffer() : undefined))
    .catch(() => undefined);
  dialPending = dialBytes.then(async (raw) => {
    try {
      return raw ? await ctx.decodeAudioData(raw.slice(0)) : undefined;
    } catch {
      return undefined;
    }
  });
  return dialPending;
}
