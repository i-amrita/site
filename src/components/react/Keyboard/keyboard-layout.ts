import { ACTIONS } from '@/lib/actions';

import type { KeyBinding, KeyDef, KeyRow, KeyVariant } from './keyboard.types';

const U = 50;

const k = (
  code: string,
  label: string | undefined,
  width = U,
  variant: KeyVariant = 'letter',
  extra: Partial<KeyDef> = {},
): KeyDef => ({ code, label, width, variant, ...extra });

const sym = (code: string, label: string, shift: string): KeyDef =>
  k(code, label, U, 'letter', { shift });
const letter = (c: string): KeyDef => k(`Key${c}`, c);
const letters = (s: string): KeyDef[] => [...s].map(letter);

export const DESIGN_WIDTH = 15 * U;

export const KEY_ROWS: readonly KeyRow[] = [
  [
    k('Escape', 'esc', U, 'accent'),
    k('F1', 'F1'),
    k('F2', 'F2'),
    k('F3', 'F3'),
    k('F4', 'F4'),
    k('F5', 'F5'),
    k('F6', 'F6'),
    k('F7', 'F7', U, 'modifier', { icon: 'SkipBack' }),
    k('F8', 'F8', U, 'modifier', { icon: 'Play' }),
    k('F9', 'F9', U, 'modifier', { icon: 'SkipForward' }),
    k('F10', 'F10', U, 'modifier', { icon: 'VolumeX' }),
    k('F11', 'F11', U, 'modifier', { icon: 'Volume1' }),
    k('F12', 'F12', U, 'modifier', { icon: 'Volume2' }),
    k('Delete', 'del', 100, 'modifier'),
  ],
  [
    sym('Backquote', '`', '~'),
    sym('Digit1', '1', '!'),
    sym('Digit2', '2', '@'),
    sym('Digit3', '3', '#'),
    sym('Digit4', '4', '$'),
    sym('Digit5', '5', '%'),
    sym('Digit6', '6', '^'),
    sym('Digit7', '7', '&'),
    sym('Digit8', '8', '*'),
    sym('Digit9', '9', '('),
    sym('Digit0', '0', ')'),
    sym('Minus', '-', '_'),
    sym('Equal', '=', '+'),
    k('Backspace', undefined, 100, 'modifier', { icon: 'Delete' }),
  ],
  [
    k('Tab', 'tab', 75, 'modifier'),
    ...letters('QWERTYUIOP'),
    sym('BracketLeft', '[', '{'),
    sym('BracketRight', ']', '}'),
    k('Backslash', '\\', 75, 'letter', { shift: '|' }),
  ],
  [
    k('CapsLock', 'caps', 87.5, 'modifier'),
    ...letters('ASDFGHJKL'),
    sym('Semicolon', ';', ':'),
    sym('Quote', "'", '"'),
    k('Enter', 'return', 112.5, 'accent'),
  ],
  [
    k('ShiftLeft', 'shift', 112.5, 'modifier'),
    ...letters('ZXCVBNM'),
    sym('Comma', ',', '<'),
    sym('Period', '.', '>'),
    sym('Slash', '/', '?'),
    k('ShiftRight', 'shift', 137.5, 'modifier'),
  ],
  [
    k('ControlLeft', 'ctrl', 62.5, 'modifier'),
    k('AltLeft', 'option', 62.5, 'accent', { icon: 'Languages' }),
    k('MetaLeft', undefined, 62.5, 'accent', { icon: 'Command' }),
    k('Space', undefined, 312.5, 'letter'),
    k('MetaRight', undefined, 50, 'accent', { icon: 'Command' }),
    k('AltRight', 'option', 50, 'accent', { icon: 'Languages' }),
    k('ArrowLeft', undefined, U, 'modifier', { icon: 'ChevronLeft' }),
    k('ArrowDown', undefined, U, 'modifier', { icon: 'ChevronDown' }),
    k('ArrowRight', undefined, U, 'modifier', { icon: 'ChevronRight' }),
  ],
];

/** Action-key icons come from the registry so keyboard, CmdK and navbar stay in sync. */
const NAMED: Record<string, string[]> = {
  Escape: ['Escape'],
  ' ': ['Space'],
  Enter: ['Enter'],
  Alt: ['AltLeft', 'AltRight'],
  Meta: ['MetaLeft', 'MetaRight'],
};

function codesFor(key: string): string[] {
  if (NAMED[key]) return NAMED[key];
  if (/^F\d+$/.test(key)) return [key];
  if (/^[a-z]$/i.test(key)) return [`Key${key.toUpperCase()}`];
  return [];
}

const PRIMARY = new Set(['Escape', 'Alt', 'Meta']);

/** `KeyboardEvent.code` to action binding, derived from `ACTIONS[].keys`. */
export const BINDINGS: ReadonlyMap<string, KeyBinding> = (() => {
  const map = new Map<string, KeyBinding>();
  for (const action of ACTIONS) {
    for (const key of action.keys) {
      const primary = PRIMARY.has(key) || /^F\d+$/.test(key);
      for (const code of codesFor(key)) map.set(code, { actionId: action.id, primary });
    }
  }
  return map;
})();

export const ACTION_ICONS: ReadonlyMap<string, string> = new Map(
  ACTIONS.map((a) => [a.id, a.icon]),
);
