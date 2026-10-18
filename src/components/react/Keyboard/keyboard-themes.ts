/**
 * Modified by Amrita Nambiar 2026, adapted from AayushBharti/keythm (Apache-2.0).
 * Keycap recipe: rounded-top key body + inset cap + two rotated bottom shadow slivers.
 * Re-skinned with this project's semantic Tailwind classes. No sound assets are lifted.
 */
import type { KeyVariant } from './keyboard.types';

export interface KeyTheme {
  /** Lower body of the key (visible as the "side" under the cap). */
  base: string;
  /** Top cap surface and glyph colour. */
  cap: string;
}

export const KEY_THEMES: Record<KeyVariant, KeyTheme> = {
  letter: { base: 'bg-key-light/70', cap: 'bg-key-light text-key-light-fg' },
  modifier: { base: 'bg-key-dark/70', cap: 'bg-key-dark text-key-dark-fg' },
  accent: {
    base: 'bg-key-accent/70',
    cap: 'bg-key-accent text-key-accent-fg border-b-2 border-b-brand',
  },
};

export const FRAME_CLASS = 'rounded-[16px] border-2 border-border bg-surface-muted p-3 shadow-key';
export const BED_CLASS = 'rounded-[5px] rounded-t-[8px] border border-border bg-surface';
