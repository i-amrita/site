/** Fetch + decode the click sounds once per AudioContext and cache the buffers. */
export const SOUND_URLS = {
  down: '/sounds/click-down.ogg',
  up: '/sounds/click-up.ogg',
} as const;

export type SoundName = keyof typeof SOUND_URLS;
type Buffers = Partial<Record<SoundName, AudioBuffer>>;

let pending: Promise<Buffers> | null = null;
let pendingCtx: AudioContext | null = null;

export function loadSounds(ctx: AudioContext): Promise<Buffers> {
  if (pending && pendingCtx === ctx) return pending;
  pendingCtx = ctx;
  pending = Promise.all(
    (Object.entries(SOUND_URLS) as [SoundName, string][]).map(async ([name, url]) => {
      try {
        const res = await fetch(url);
        const data = await res.arrayBuffer();
        return [name, await ctx.decodeAudioData(data)] as const;
      } catch {
        return [name, undefined] as const;
      }
    }),
  ).then((entries) => Object.fromEntries(entries) as Buffers);
  return pending;
}
