/**
 * Key-click audio. One shared AudioContext, buffers decoded once and cached.
 * Playback uses `AudioBufferSourceNode.start(0, offset, duration)` so latency stays under 10ms.
 * Browsers keep the context suspended until a user gesture, so we `resume()` on the first
 * pointerdown / touchend / mousedown / keydown (never `touchstart`, which iOS does not count as activation).
 * Details: `.agents/docs/audio.md`.
 */
import { loadSounds, type SoundName } from '@/components/react/Keyboard/audio-preloader';

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

function unlock() {
  const c = ctx;
  if (!c) return;
  void c.resume().then(() => {
    if (c.state === 'running')
      for (const e of UNLOCK_EVENTS) window.removeEventListener(e, unlock, true);
  });
}

/** Create the context, start decoding, and arm the one-shot gesture unlock. Safe to call repeatedly. */
export function initAudio(): void {
  const c = getAudioContext();
  if (!c) return;
  void loadSounds(c);
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
