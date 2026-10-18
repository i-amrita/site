import type { ActionId } from '@/lib/actions';

export type KeyVariant = 'letter' | 'modifier' | 'accent';

export interface KeyDef {
  /** `KeyboardEvent.code`. */
  code: string;
  label?: string | undefined;
  /** Secondary glyph shown above the label (shifted symbol). */
  shift?: string;
  /** lucide icon name, resolved in `Key.tsx`. */
  icon?: string;
  /** Design width in px (one unit = 50). */
  width: number;
  variant: KeyVariant;
}

export type KeyRow = readonly KeyDef[];

export interface KeyBinding {
  actionId: ActionId;
  /** Primary bindings (Esc, F-keys, Option, Cmd) are always accent styled. Aliases only glow on `?highlight=1`. */
  primary: boolean;
}

export type PressSource = 'pointer' | 'keyboard';
