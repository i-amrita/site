/**
 * Key-click audio. One shared AudioContext, buffers decoded once and cached.
 * Playback uses `AudioBufferSourceNode.start(0, offset, duration)` so latency stays under 10ms.
 * The context is created lazily on the first user gesture (creating it at hydration cost ~190ms of main thread).
 * Browsers keep the context suspended until a user gesture, so we `resume()` on the first
 * pointerdown / touchend / mousedown / keydown (never `touchstart`, which iOS does not count as activation).
 * Details: `.agents/docs/audio.md`.
 */
import {
  fetchSoundBytes,
  loadSounds,
  type SoundName,
} from '@/components/react/Keyboard/audio-preloader';

let ctx: AudioContext | null = null;
let unlockBound = false;
let muted = false;

const UNLOCK_EVENTS = ['pointerdown', 'touchend', 'mousedown', 'keydown'] as const;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor({ latencyHint: 'interactive' });
  }
  return ctx;
}

/** First gesture: create the context (costly, so never at hydration), decode, resume. */
function unlock() {
  const c = getAudioContext();
  if (!c) return;
  void loadSounds(c);
  void c.resume().then(() => {
    if (c.state === 'running')
      for (const e of UNLOCK_EVENTS) window.removeEventListener(e, unlock, true);
  });
}

/** Start fetching the files and arm the gesture unlock. No AudioContext yet. Safe to call repeatedly. */
export function initAudio(): void {
  if (typeof window === 'undefined') return;
  void fetchSoundBytes();
  if (unlockBound) return;
  unlockBound = true;
  for (const e of UNLOCK_EVENTS)
    window.addEventListener(e, unlock, { capture: true, passive: true });
}

export function setMuted(value: boolean): void {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

/** Play a key sound. No-op when muted, not yet decoded, or the context is still locked. */
export function playClick(name: SoundName): void {
  if (muted || !ctx || ctx.state !== 'running') return;
  void loadSounds(ctx).then((buffers) => {
    const buffer = buffers[name];
    if (!ctx || !buffer) return;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    // Slight pitch jitter keeps repeated clicks from sounding machine-gunned.
    src.playbackRate.value = 0.96 + Math.random() * 0.08;
    src.connect(ctx.destination);
    src.start(0, 0, buffer.duration);
  });
}

let lastTick = 0;

/**
 * Dial detent tick, synthesized (no sample): ~15ms filtered noise burst plus a ~1.5kHz sine blip,
 * pitch rising slightly with `value` (0..100). `strong` is used at the 0 and 100 stops.
 * Respects mute, needs the unlocked context, and is rate-limited to one tick per 30ms.
 */
export function playTick(value: number, strong = false): void {
  if (muted || !ctx || ctx.state !== 'running') return;
  const now = performance.now();
  if (now - lastTick < 30) return;
  lastTick = now;
  const t0 = ctx.currentTime;
  const dur = 0.015;
  const gain = ctx.createGain();
  const peak = strong ? 0.5 : 0.28;
  gain.gain.setValueAtTime(peak, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  gain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.frequency.value = 1500 * (0.9 + (Math.min(100, Math.max(0, value)) / 100) * 0.2);
  osc.connect(gain);
  osc.start(t0);
  osc.stop(t0 + dur);

  const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const noise = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 3500;
  src.connect(band).connect(gain);
  src.start(t0);
}
