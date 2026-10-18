import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';

import { getAudioStatus, getServerAudioStatus, subscribeAudioStatus } from '@/lib/audio';
import { m, useLocale } from '@/lib/i18n';

import { Providers } from '../Providers';
import { Key } from './Key';
import { KeyboardProvider, useKeyboard } from './keyboard-context';
import { PAD_KEYS } from './keyboard-layout';
import { CHASSIS_CLASS, PLATE_CLASS } from './keyboard-themes';

/**
 * Startup indicator: a small pulsing dot under the pad while the sounds load (present in the SSR HTML, so it shows
 * before hydration too), plus sr-only status text. Once the sprite is decoded it fades out and leaves the DOM, so a
 * fully loaded pad shows nothing extra. Absolutely positioned: no layout shift. Keys never wait for it.
 */
function StartupIndicator() {
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
    <div
      role="status"
      aria-live="polite"
      data-startup-indicator
      data-state={ready ? 'ready' : 'loading'}
      className={`pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 transition-opacity duration-300 motion-reduce:transition-none ${ready ? 'opacity-0' : 'opacity-100'}`}
    >
      <span className="sr-only">{ready ? '' : m.keyboard_loading()}</span>
      <span
        aria-hidden="true"
        className="block size-1.5 animate-pulse rounded-full bg-brand/60 motion-reduce:animate-none"
      />
    </div>
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
        <StartupIndicator />
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
