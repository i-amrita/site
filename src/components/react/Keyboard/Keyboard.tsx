import type { CSSProperties } from 'react';

import { m, useLocale } from '@/lib/i18n';

import { Providers } from '../Providers';
import { Key } from './Key';
import { KeyboardProvider, useKeyboard } from './keyboard-context';
import { PAD_KEYS } from './keyboard-layout';
import { CHASSIS_CLASS, PLATE_CLASS } from './keyboard-themes';

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
