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

let pending: Promise<Buffers> | null = null;
let pendingCtx: AudioContext | null = null;

export function loadSounds(ctx: AudioContext): Promise<Buffers> {
  if (pending && pendingCtx === ctx) return pending;
  pendingCtx = ctx;
  pending = Promise.all(
    (Object.keys(SOUND_NAMES) as SoundName[]).map(async (name) => {
      try {
        const res = await fetch(soundUrl(name));
        const data = await res.arrayBuffer();
        return [name, await ctx.decodeAudioData(data)] as const;
      } catch {
        return [name, undefined] as const;
      }
    }),
  ).then((entries) => Object.fromEntries(entries) as Buffers);
  return pending;
}
