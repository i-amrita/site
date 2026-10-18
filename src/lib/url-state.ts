/**
 * Single source of truth for URL-encoded UI state. Every visible state must be reachable as a URL.
 * Islands bind these parsers with `nuqs`; Astro routes read the same keys from `Astro.url.searchParams`.
 * Contract + history semantics: `.agents/docs/url-state.md`.
 */
import { parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs';

export const OVERLAYS = ['about', 'projects', 'log', 'search'] as const;
export const LOCALES = ['en', 'ms', 'hi', 'de', 'ml'] as const;
export const THEMES = ['light', 'dark'] as const;
export const FLAGS = ['1', '0'] as const;

export type Overlay = (typeof OVERLAYS)[number];
export type Locale = (typeof LOCALES)[number];
export type Theme = (typeof THEMES)[number];

/** nuqs parsers keyed by query param. Pass to `useQueryStates(urlStateParsers)`. */
export const urlStateParsers = {
  overlay: parseAsStringLiteral(OVERLAYS),
  scroll: parseAsInteger,
  filter: parseAsString,
  mute: parseAsStringLiteral(FLAGS),
  highlight: parseAsStringLiteral(FLAGS),
  theme: parseAsStringLiteral(THEMES),
  locale: parseAsStringLiteral(LOCALES),
  cmdk: parseAsStringLiteral(['open'] as const),
  q: parseAsString,
  mode: parseAsStringLiteral(['ai', 'keyword'] as const),
} as const;

export type UrlStateKey = keyof typeof urlStateParsers;

/**
 * `push` creates a history entry (back button restores the previous state).
 * `replace` is for high-frequency or cosmetic state (scroll, filter, mute).
 */
export const historyFor: Record<UrlStateKey, 'push' | 'replace'> = {
  overlay: 'push',
  scroll: 'replace',
  filter: 'replace',
  mute: 'replace',
  highlight: 'replace',
  theme: 'replace',
  locale: 'replace',
  cmdk: 'push',
  q: 'replace',
  mode: 'replace',
};

/** Build a static, shareable URL for a state. `href('/', { overlay: 'projects' })` → `/?overlay=projects`. */
export function href(
  path: string,
  state: Partial<Record<UrlStateKey, string | number | null | undefined>> = {},
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) {
    if (value !== null && value !== undefined && value !== '') params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
