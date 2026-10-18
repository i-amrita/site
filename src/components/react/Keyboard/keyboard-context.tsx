import { useQueryStates } from 'nuqs';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { ActionId } from '@/lib/actions';
import { initAudio, playClick, setMuted } from '@/lib/audio';
import { clampHighlight, urlStateParsers } from '@/lib/url-state';

import { useActions } from '../use-actions';
import { BINDINGS } from './keyboard-layout';
import type { PressSource } from './keyboard.types';

interface KeyboardContextValue {
  pressed: ReadonlySet<string>;
  /** Highlight intensity 0..100 (live while dragging). */
  highlight: number;
  setHighlight: (value: number) => void;
  /** URL state (`mute`, `theme`, `locale`) for keys that mirror it. */
  urlState: ReturnType<typeof useActions>['state'];
  press: (code: string, source: PressSource) => void;
  release: (code: string, source: PressSource) => void;
  runAction: (id: ActionId) => void;
}

const Ctx = createContext<KeyboardContextValue | null>(null);

export function useKeyboard(): KeyboardContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useKeyboard must be used inside <KeyboardProvider>');
  return v;
}

const MODIFIER_TAPS = new Set(['AltLeft', 'AltRight', 'MetaLeft', 'MetaRight']);

/** Don't hijack typing or activation keys when focus sits on an interactive element. */
function isInteractive(el: EventTarget | null): boolean {
  return (
    el instanceof HTMLElement &&
    !!el.closest(
      'input, textarea, select, button, a, [role="slider"], [contenteditable="true"], [role="dialog"]',
    )
  );
}

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const { run, state } = useActions();
  const [, setUrl] = useQueryStates(urlStateParsers);
  const [pressed, setPressed] = useState<ReadonlySet<string>>(() => new Set());
  const runRef = useRef(run);
  runRef.current = run;
  // A lone Alt/Meta tap triggers its action on keyup; any key pressed in between cancels it.
  const modTap = useRef<string | null>(null);

  useEffect(() => {
    setMuted(state.mute === '1');
  }, [state.mute]);

  useEffect(() => {
    initAudio();
  }, []);

  const highlight = clampHighlight(state.highlight);
  // nuqs applies the state optimistically and throttles the URL write, so dragging stays live without history spam.
  const setHighlight = useCallback(
    (value: number) => {
      const v = clampHighlight(value);
      void setUrl({ highlight: v === 0 ? null : v }, { history: 'replace' });
    },
    [setUrl],
  );

  const mark = useCallback((code: string, on: boolean) => {
    setPressed((prev) => {
      if (prev.has(code) === on) return prev;
      const next = new Set(prev);
      if (on) next.add(code);
      else next.delete(code);
      return next;
    });
  }, []);

  const press = useCallback(
    (code: string, source: PressSource) => {
      mark(code, true);
      playClick('down', code);
      if (source === 'pointer') navigator.vibrate?.(12);
      const binding = BINDINGS.get(code);
      // Pointer taps fire on pointerdown; physical modifiers wait for keyup (see below).
      if (binding && (source === 'pointer' || !MODIFIER_TAPS.has(code)))
        runRef.current(binding.actionId);
    },
    [mark],
  );

  const release = useCallback(
    (code: string, _source: PressSource) => {
      mark(code, false);
      playClick('up', code);
    },
    [mark],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const binding = BINDINGS.get(e.code);
      const activation = e.code === 'Space' || e.code === 'Enter';
      if (isInteractive(e.target) && (activation || !binding)) return;
      if (
        isInteractive(e.target) &&
        e.target instanceof HTMLElement &&
        e.target.closest('input, textarea, select, [contenteditable="true"]')
      )
        return;
      if (modTap.current) modTap.current = null;
      if (MODIFIER_TAPS.has(e.code)) {
        modTap.current = e.code;
        mark(e.code, true);
        playClick('down', e.code);
        return;
      }
      // Cmd/Ctrl+K opens the palette; other chorded shortcuts belong to the browser.
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
        e.preventDefault();
        mark(e.code, true);
        playClick('down', e.code);
        runRef.current('cmdk');
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) {
        mark(e.code, true);
        playClick('down', e.code);
        return;
      }
      if (binding) e.preventDefault();
      press(e.code, 'keyboard');
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (MODIFIER_TAPS.has(e.code) && modTap.current === e.code) {
        modTap.current = null;
        const binding = BINDINGS.get(e.code);
        if (binding) runRef.current(binding.actionId);
      }
      release(e.code, 'keyboard');
      // macOS swallows keyup for keys released while Meta is held; don't leave them stuck down.
      if (e.code.startsWith('Meta')) setPressed(new Set());
    };
    const onBlur = () => setPressed(new Set());
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [press, release, mark]);

  const value = useMemo(
    () => ({ pressed, highlight, setHighlight, urlState: state, press, release, runAction: run }),
    [pressed, highlight, setHighlight, state, press, release, run],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
