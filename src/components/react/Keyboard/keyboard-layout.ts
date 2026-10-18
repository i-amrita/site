import { ACTIONS } from '@/lib/actions';
import { EMAIL, SOCIALS } from '@/lib/site';

import type { KeyBinding, MacroKeyDef } from './keyboard.types';

/** The 12-cell, 4-column macropad. Row order is reading order in the grid. */
export const PAD_KEYS: readonly MacroKeyDef[] = [
  { id: 'esc', code: 'Escape', actionId: 'close', variant: 'sage', legendKey: 'key_esc' },
  { id: 'dial', code: 'Dial', variant: 'cream', kind: 'dial' },
  {
    id: 'sound',
    code: 'F5',
    actionId: 'mute',
    variant: 'cream',
    legendKey: 'key_sound',
    icon: 'Volume2',
    kind: 'sound',
  },
  {
    id: 'find',
    code: 'F4',
    actionId: 'search',
    variant: 'rose',
    legendKey: 'key_find',
    icon: 'Sparkles',
    glow: true,
  },
  {
    id: 'work',
    code: 'F2',
    actionId: 'projects',
    variant: 'rose',
    legendKey: 'key_work',
    icon: 'LayoutGrid',
    glow: true,
  },
  {
    id: 'about',
    code: 'F1',
    actionId: 'about',
    variant: 'cream',
    legendKey: 'key_about',
    icon: 'Smile',
    glow: true,
  },
  {
    id: 'projects',
    code: 'KeyP',
    actionId: 'side-projects',
    variant: 'cream',
    legendKey: 'key_projects',
    icon: 'Rocket',
    glow: true,
  },
  {
    id: 'log',
    code: 'F3',
    actionId: 'log',
    variant: 'cream',
    legendKey: 'key_log',
    icon: 'BookOpen',
    glow: true,
  },
  {
    id: 'linkedin',
    code: 'Link:linkedin',
    variant: 'rose',
    kind: 'link',
    legend: 'LinkedIn',
    icon: 'Linkedin',
    href: SOCIALS.linkedin,
    external: true,
  },
  {
    id: 'email',
    code: 'Link:email',
    variant: 'cream',
    kind: 'link',
    legendKey: 'key_build',
    nameKey: 'socials_email',
    icon: 'Sparkles',
    span: 2,
    href: `mailto:${EMAIL}`,
  },
  { id: 'locale', code: 'AltLeft', actionId: 'locale', variant: 'cream', kind: 'locale' },
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
