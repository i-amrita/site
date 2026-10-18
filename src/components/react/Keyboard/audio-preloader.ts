/** Fetch + decode the click sounds once per AudioContext and cache the buffers. */
export const SOUND_NAMES = { down: 'click-down', up: 'click-up' } as const;

export type SoundName = keyof typeof SOUND_NAMES;

/** Ogg Vorbis where the browser can play it, AAC in m4a otherwise (Safari before 18.4). */
export function soundExtension(): 'ogg' | 'm4a' {
  const probe = typeof Audio === 'undefined' ? null : new Audio();
  return probe?.canPlayType('audio/ogg; codecs="vorbis"') ? 'ogg' : 'm4a';
}

export const soundUrl = (name: SoundName) => `/sounds/${SOUND_NAMES[name]}.${soundExtension()}`;
type Buffers = Partial<Record<SoundName, AudioBuffer>>;

let bytes: Promise<Partial<Record<SoundName, ArrayBuffer>>> | null = null;
let pending: Promise<Buffers> | null = null;
let pendingCtx: AudioContext | null = null;

/** Fetch the raw files without an AudioContext, so creating the context can wait for a user gesture. */
export function fetchSoundBytes(): Promise<Partial<Record<SoundName, ArrayBuffer>>> {
  bytes ??= Promise.all(
    (Object.keys(SOUND_NAMES) as SoundName[]).map(async (name) => {
      try {
        const res = await fetch(soundUrl(name));
        return [name, await res.arrayBuffer()] as const;
      } catch {
        return [name, undefined] as const;
      }
    }),
  ).then((entries) => Object.fromEntries(entries));
  return bytes;
}

/** Decode the fetched bytes once per AudioContext and cache the buffers. */
export function loadSounds(ctx: AudioContext): Promise<Buffers> {
  if (pending && pendingCtx === ctx) return pending;
  pendingCtx = ctx;
  pending = fetchSoundBytes().then(async (raw) => {
    const entries = await Promise.all(
      (Object.keys(SOUND_NAMES) as SoundName[]).map(async (name) => {
        try {
          const data = raw[name];
          // decodeAudioData detaches its input, so decode a copy and keep the bytes for another context.
          return [name, data ? await ctx.decodeAudioData(data.slice(0)) : undefined] as const;
        } catch {
          return [name, undefined] as const;
        }
      }),
    );
    return Object.fromEntries(entries) as Buffers;
  });
  return pending;
}
