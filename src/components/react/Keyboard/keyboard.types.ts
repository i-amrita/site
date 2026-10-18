import type { ActionId } from '@/lib/actions';

export type KeyVariant = 'cream' | 'rose' | 'sage';

export interface MacroKeyDef {
  id: string;
  /** Representative `KeyboardEvent.code`, passed to `press()` on pointer taps. */
  code: string;
  /** Absent for link keys, which are plain anchors and run no action. */
  actionId?: ActionId;
  variant: KeyVariant;
  /** Message key for the visible legend. Absent for the dial. */
  legendKey?:
    | 'key_work'
    | 'key_about'
    | 'key_projects'
    | 'key_log'
    | 'key_find'
    | 'key_sound'
    | 'key_build'
    | 'key_esc';
  /** Literal legend for brand names that are never translated. Wins over `legendKey`. */
  legend?: string;
  /** Message key for a link key's accessible name, after the legend. */
  nameKey?: 'socials_email';
  /** Link keys render a real anchor to this URL. */
  href?: string;
  /** Opens in a new tab (`target=_blank rel=noopener noreferrer`). */
  external?: boolean;
  /** Icon name, mapped to a static `~icons/ph/*` import in `Key.tsx`. */
  icon?: string;
  /** Columns spanned (the spacebar is 2). */
  span?: 2;
  kind?: 'dial' | 'sound' | 'locale' | 'link';
  /** Action keys glow in proportion to `?highlight=0..100`. Link keys do not: they run no action. */
  glow?: boolean;
}

export interface KeyBinding {
  actionId: ActionId;
  /** Kept for the code-to-action map; every pad key is styled by its own variant. */
  primary: boolean;
}

export type PressSource = 'pointer' | 'keyboard';
