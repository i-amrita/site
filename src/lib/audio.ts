/**
 * Key-click audio. The sprite (keys + dial ticks) is fetched and decoded early, with no user gesture, through an
 * `OfflineAudioContext` (see audio-preloader.ts). The realtime `AudioContext` is created lazily on the first user
 * gesture (creating it at hydration cost ~190ms of main thread) and resumed there, so by the first key press the
 * buffer is usually ready and that press is already audible. Until the buffer is decoded, presses are silent and
 * instant: nothing is queued, so no burst of late clicks.
 * Gestures that unlock: pointerdown / touchend / mousedown / keydown (never `touchstart`, which iOS does not count as activation).
 * Details: `.agents/docs/audio.md`.
 */
import { decodeSprite, type SoundName } from '@/components/react/Keyboard/audio-preloader';
import { DIAL_SPRITE, hashId, SPRITE } from '@/components/react/Keyboard/key-sprite';

let ctx: AudioContext | null = null;
let unlockBound = false;
let warmStarted = false;
let muted = false;
let buffer: AudioBuffer | undefined;
let gestureAt = 0;

/** `loading` until the sprite is decoded or has failed (failure falls back to synthesized clicks). */
export type AudioStatus = 'loading' | 'ready';
let status: AudioStatus = 'loading';
/** True once a gesture tried to start audio and the context still is not running (iOS silent/locked cases). */
let blocked = false;
const listeners = new Set<() => void>();

export const subscribeAudioStatus = (cb: () => void) => {
  listeners.add(cb);
  return () => void listeners.delete(cb);
};
export const getAudioStatus = (): AudioStatus => status;
export const getServerAudioStatus = (): AudioStatus => 'loading';
export const getAudioBlocked = (): boolean => blocked;
export const getServerAudioBlocked = (): boolean => false;

function emit() {
  for (const l of listeners) l();
}

function setStatus(next: AudioStatus) {
  if (status === next) return;
  status = next;
  emit();
}

function setBlocked(next: boolean) {
  if (blocked === next) return;
  blocked = next;
  emit();
}

/** Longest the startup state may last: a stalled fetch must not leave the loading UI up forever. */
const LOAD_TIMEOUT_MS = 8000;
/** How long after a gesture the context may stay non-running before we call it blocked. */
const BLOCKED_AFTER_MS = 1500;

const UNLOCK_EVENTS = ['pointerdown', 'touchend', 'mousedown', 'keydown'] as const;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor({ latencyHint: 'interactive' });
      ctx.addEventListener('statechange', () => {
        if (ctx?.state === 'running') setBlocked(false);
      });
    } catch {
      return null;
    }
  }
  return ctx;
}

/**
 * iOS mutes Web Audio under the hardware silent switch unless the page's audio session is `playback`
 * (Safari 16.4+ `navigator.audioSession`). Best effort, no-op elsewhere.
 */
function setPlaybackSession() {
  try {
    const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (session && session.type !== 'playback') session.type = 'playback';
  } catch {
    // Unsupported value or locked-down browser: sound just follows the default policy.
  }
}

/**
 * A gesture: create the realtime context if needed and resume it. Safari reports `suspended` before the first
 * gesture and `interrupted` after a call or tab switch; both need `resume()` from a gesture, so the listeners stay
 * armed for the page's life (an early return makes them free while the context is running). Playing a one-frame
 * silent buffer inside the gesture is the classic iOS unlock. Never throws.
 */
function unlock() {
  try {
    gestureAt = performance.now();
    warm();
    if (ctx?.state === 'running') return;
    setPlaybackSession();
    const c = getAudioContext();
    if (!c) return setBlocked(true);
    void c.resume().catch(() => undefined);
    try {
      const src = c.createBufferSource();
      src.buffer = c.createBuffer(1, 1, 22050);
      src.connect(c.destination);
      src.start(0);
    } catch {
      // The silent poke is optional.
    }
    setTimeout(() => {
      if (c.state !== 'running') setBlocked(true);
    }, BLOCKED_AFTER_MS);
  } catch {
    // Audio must never break the keypad.
  }
}

/** Decode the sprite (its bytes come from the early preload). */
function warm() {
  if (warmStarted) return;
  warmStarted = true;
  const timer = setTimeout(() => setStatus('ready'), LOAD_TIMEOUT_MS);
  void decodeSprite(getAudioContext)
    .then((b) => {
      buffer = b;
    })
    .catch(() => undefined)
    .finally(() => {
      clearTimeout(timer);
      setStatus('ready');
    });
}

/** Arm the gesture unlock and start the sprite decode. No AudioContext yet. Safe to call repeatedly. */
export function initAudio(): void {
  if (typeof window === 'undefined') return;
  if (unlockBound) return;
  unlockBound = true;
  for (const e of UNLOCK_EVENTS)
    window.addEventListener(e, unlock, { capture: true, passive: true });
  // Runs from an effect, i.e. after the pad painted; the bytes are already in flight from the head preload and decoding is off-thread.
  warm();
}

export function setMuted(value: boolean): void {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

/**
 * The context can play when running, or when a gesture just asked for resume (sources queued on a suspended
 * context start the moment it runs, which keeps the very first press audible without a stale backlog).
 */
function canPlay(): boolean {
  if (!ctx || status !== 'ready') return false;
  if (ctx.state === 'running') return true;
  return (
    (ctx.state === 'suspended' || ctx.state === ('interrupted' as AudioContextState)) &&
    performance.now() - gestureAt < 120
  );
}

/** Synth fallback used when the sprite failed to fetch or decode: a ~25ms filtered noise tick. */
function playSynthClick(c: AudioContext, name: SoundName): void {
  const dur = name === 'down' ? 0.03 : 0.02;
  const frames = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, frames, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 3;
  const src = c.createBufferSource();
  src.buffer = buf;
  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = name === 'down' ? 2200 : 3600;
  const gain = c.createGain();
  gain.gain.value = name === 'down' ? 0.5 : 0.3;
  src.connect(band).connect(gain).connect(c.destination);
  src.start();
}

/**
 * Play a key sound. `id` (the key code or id) picks a deterministic sample from the sprite
 * (hash of id modulo sample count), so every key has its own voice. Pitch and gain get a small
 * random jitter. No-op when muted, not yet decoded, or the context is still locked.
 */
export function playClick(name: SoundName, id = ''): void {
  try {
    clickNow(name, id);
  } catch {
    // A failed sound must never break a key press.
  }
}

function clickNow(name: SoundName, id: string): void {
  if (muted || !canPlay() || !ctx) return;
  if (!buffer) return playSynthClick(ctx, name);
  const samples = SPRITE[name];
  const [start, dur] = samples[hashId(id) % samples.length]!;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.playbackRate.value = 0.95 + Math.random() * 0.1;
  const gain = ctx.createGain();
  gain.gain.value = 0.85 + Math.random() * 0.25;
  src.connect(gain).connect(ctx.destination);
  src.start(0, start, dur);
}

let lastTick = 0;

/**
 * Dial detent tick. Plays the dial sample when decoded, else synthesizes: ~15ms filtered noise burst plus a ~1.5kHz sine blip,
 * pitch rising slightly with `value` (0..100). `strong` is used at the 0 and 100 stops.
 * Respects mute, needs the unlocked context, and is rate-limited to one tick per 30ms.
 */
export function playTick(value: number, strong = false): void {
  try {
    tickNow(value, strong);
  } catch {
    // A failed sound must never break the dial.
  }
}

function tickNow(value: number, strong: boolean): void {
  if (muted || !canPlay() || !ctx) return;
  const now = performance.now();
  if (now - lastTick < 30) return;
  lastTick = now;
  if (buffer) {
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const [off, len] = strong
      ? DIAL_SPRITE.stop
      : DIAL_SPRITE.tick[Math.floor(Math.random() * DIAL_SPRITE.tick.length)]!;
    src.playbackRate.value = 0.94 + (Math.min(100, Math.max(0, value)) / 100) * 0.12;
    const g = ctx.createGain();
    g.gain.value = strong ? 1 : 0.75;
    src.connect(g).connect(ctx.destination);
    src.start(0, off, len);
    return;
  }
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
