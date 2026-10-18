import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';

import {
  getAudioBlocked,
  getAudioStatus,
  getServerAudioBlocked,
  getServerAudioStatus,
  subscribeAudioStatus,
} from '@/lib/audio';
import { m, useLocale } from '@/lib/i18n';

import { Providers } from '../Providers';
import { Key } from './Key';
import { KeyboardProvider, useKeyboard } from './keyboard-context';
import { PAD_KEYS } from './keyboard-layout';
import { CHASSIS_CLASS, PLATE_CLASS } from './keyboard-themes';

/** How long the one-time "sound is off" hint stays up. */
const HINT_MS = 6000;
let hintShown = false;

/**
 * Startup state, shown only while the sounds load (present in the SSR HTML, so it appears before hydration too):
 * a soft light sweep over the pad plus a small status pill. Once the sprite is decoded (or failed, or timed out) both
 * fade out and leave the DOM, so a loaded pad shows nothing extra. Everything is absolutely positioned and
 * pointer-events-none: no layout shift, and keys never wait for it.
 */
function StartupSkeleton() {
  const status = useSyncExternalStore(subscribeAudioStatus, getAudioStatus, getServerAudioStatus);
  const [gone, setGone] = useState(false);
  const ready = status === 'ready';
  useEffect(() => {
    if (!ready) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setGone(true), reduce ? 0 : 400);
    return () => clearTimeout(t);
  }, [ready]);
  if (gone) return null;
  return (
    <>
      <div
        aria-hidden="true"
        data-startup-skeleton
        className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] transition-opacity duration-300 motion-reduce:transition-none ${ready ? 'opacity-0' : 'opacity-100'}`}
      >
        <div
          data-startup-sheen
          className="absolute inset-0 animate-sheen bg-linear-to-r from-transparent via-white/10 to-transparent motion-reduce:animate-none"
        />
      </div>
      <div
        role="status"
        aria-live="polite"
        data-startup-indicator
        data-state={ready ? 'ready' : 'loading'}
        className={`pointer-events-none absolute -bottom-9 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-xs text-fg/60 transition-opacity duration-300 motion-reduce:transition-none ${ready ? 'opacity-0' : 'opacity-100'}`}
      >
        <span
          aria-hidden="true"
          className="block size-1.5 animate-pulse rounded-full bg-brand/60 motion-reduce:animate-none"
        />
        <span>{ready ? '' : m.keyboard_loading()}</span>
      </div>
    </>
  );
}

/**
 * Subtle one-time hint when a tap could not start audio (hardware silent switch, locked or unsupported Web Audio).
 * Keys, haptics, visuals and URL state are unaffected; sound is simply unavailable.
 */
function SoundHint() {
  const blocked = useSyncExternalStore(
    subscribeAudioStatus,
    getAudioBlocked,
    getServerAudioBlocked,
  );
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!blocked || hintShown) return;
    hintShown = true;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), HINT_MS);
    return () => clearTimeout(t);
  }, [blocked]);
  if (!visible) return null;
  return (
    <p
      role="status"
      data-sound-hint
      className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 animate-pill-in whitespace-nowrap text-xs text-fg/60 motion-reduce:animate-none"
    >
      {m.keyboard_sound_blocked()}
    </p>
  );
}

function KeyboardBody() {
  useLocale();
  const { highlight } = useKeyboard();
  return (
    <div className="mx-auto w-full max-w-[342px]">
      <div className="relative">
        {/* Soft brand underglow behind the chassis. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 -bottom-3 h-10 rounded-full bg-brand/25 blur-2xl"
        />
        <div
          className={CHASSIS_CLASS}
          role="group"
          aria-label={m.keyboard_label()}
          style={{ '--glow': highlight / 100 } as CSSProperties}
        >
          <div className={PLATE_CLASS}>
            {PAD_KEYS.map((def) => (
              <Key key={def.id} def={def} />
            ))}
          </div>
        </div>
        <StartupSkeleton />
        <SoundHint />
      </div>
    </div>
  );
}

/** Island root: `<Keyboard client:load />`. Owns Providers (nuqs + toaster) and the keyboard state. */
export function Keyboard() {
  return (
    <Providers>
      <KeyboardProvider>
        <KeyboardBody />
      </KeyboardProvider>
    </Providers>
  );
}

export default Keyboard;
