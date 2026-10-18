/**
 * Modified by Amrita Nambiar 2026, adapted from AayushBharti/keythm (Apache-2.0).
 * Keycap recipe: rounded-top key body + inset cap + two rotated bottom shadow slivers.
 * Re-skinned with this project's semantic Tailwind classes. No sound assets are lifted.
 */
import type { KeyVariant } from './keyboard.types';

export interface KeyTheme {
  /** Key wall visible under the cap. */
  side: string;
  /** Cap surface gradient and legend colour. */
  cap: string;
}

export const KEY_THEMES: Record<KeyVariant, KeyTheme> = {
  cream: {
    side: 'bg-key-cream-side',
    cap: 'bg-linear-to-b from-key-cream to-key-cream-lo text-key-cream-fg',
  },
  rose: {
    side: 'bg-key-rose-side',
    cap: 'bg-linear-to-b from-key-rose to-key-rose-lo text-key-rose-fg',
  },
  sage: {
    side: 'bg-key-sage-side',
    cap: 'bg-linear-to-b from-key-sage to-key-sage-lo text-key-sage-fg',
  },
};

/** Double-Bezel outer shell: 28px radius, 14px padding, hairline ring, tinted lift shadow. */
export const CHASSIS_CLASS =
  'relative rounded-[28px] bg-linear-to-b from-chassis to-chassis-lo p-[14px] ring-1 ring-white/10 shadow-lift inset-shadow-[0_1px_0_rgb(255_255_255/0.08)]';
/** Recessed inner plate. Bleeds 6px into the chassis padding so keys keep the 314px grid. */
export const PLATE_CLASS =
  '-m-1.5 grid grid-cols-4 gap-2.5 rounded-[20px] bg-plate p-1.5 ring-1 ring-black/40 inset-shadow-[0_1px_0_rgb(255_255_255/0.06)]';
