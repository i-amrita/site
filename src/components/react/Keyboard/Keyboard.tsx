import { useQueryStates } from 'nuqs';
import { useLayoutEffect, useRef, useState } from 'react';

import { urlStateParsers } from '@/lib/url-state';
import { cn } from '@/lib/utils';

import { Providers } from '../Providers';
import { Key } from './Key';
import { KeyboardProvider } from './keyboard-context';
import { DESIGN_WIDTH, KEY_ROWS } from './keyboard-layout';
import { BED_CLASS, FRAME_CLASS } from './keyboard-themes';

const FRAME_PAD = 24 + 4; // p-3 on both sides + 2px borders
const DESIGN_HEIGHT = 6 * 50 - 5 * 4 + 4 + 2 + FRAME_PAD; // rows overlap by 4px (-space-y-1), pt-1, bed border
const MAX_SCALE = 1.25;

/** Scales the fixed-size keyboard to the container width. */
function Scaler({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const fit = () => setScale(Math.min(MAX_SCALE, el.clientWidth / (DESIGN_WIDTH + FRAME_PAD)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={outer} className="mx-auto w-full max-w-[950px]">
      <div
        style={{
          height: DESIGN_HEIGHT * scale,
          width: (DESIGN_WIDTH + FRAME_PAD) * scale,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: DESIGN_WIDTH + FRAME_PAD,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function KeyboardOptions() {
  const [state, setState] = useQueryStates(urlStateParsers);
  const box = 'size-4 accent-brand';
  return (
    <fieldset className="grid gap-2 rounded-[16px] bg-surface-muted p-4 text-sm sm:p-6">
      <legend className="sr-only">Keyboard options</legend>
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className={box}
          checked={state.mute === '1'}
          onChange={(e) =>
            void setState({ mute: e.target.checked ? '1' : null }, { history: 'replace' })
          }
        />
        Mute key clicks
      </label>
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className={box}
          checked={state.highlight === '1'}
          onChange={(e) =>
            void setState({ highlight: e.target.checked ? '1' : null }, { history: 'replace' })
          }
        />
        Highlight action keys
      </label>
    </fieldset>
  );
}

function KeyboardBody() {
  return (
    <div className="flex flex-col gap-6">
      <Scaler>
        <div className={FRAME_CLASS} role="group" aria-label="Keyboard">
          <div className={cn(BED_CLASS, 'overflow-hidden pt-1')}>
            <div className="-space-y-1 overflow-hidden rounded-[5px]">
              {KEY_ROWS.map((row, i) => (
                <div key={i} className="flex">
                  {row.map((def) => (
                    <Key key={def.code} def={def} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Scaler>
      <KeyboardOptions />
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
