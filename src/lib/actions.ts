/**
 * Action registry shared by the keyboard hero, CmdK, and the navbar.
 * `patch` is the URL-state change an action applies. `null` means "remove the key".
 * Icons are lucide names (resolved to components by the consumer); never inline raw SVG.
 */
import type { UrlStateKey } from './url-state';

export type ActionId =
  | 'close'
  | 'about'
  | 'projects'
  | 'log'
  | 'search'
  | 'mute'
  | 'theme'
  | 'locale'
  | 'cmdk'
  | 'copy-email';

export interface Action {
  id: ActionId;
  label: string;
  /** `KeyboardEvent.key` values (case-insensitive for single letters) that trigger this action. */
  keys: readonly string[];
  /** lucide icon name, e.g. `Search`. */
  icon: string;
  /** Static URL-state patch. `toggle` and `cycle` actions compute their value at call time. */
  patch?: Partial<Record<UrlStateKey, string | null>>;
  kind: 'navigate' | 'toggle' | 'cycle' | 'effect';
}

export const ACTIONS: readonly Action[] = [
  {
    id: 'close',
    label: 'Close',
    keys: ['Escape'],
    icon: 'X',
    patch: { overlay: null, cmdk: null, q: null, scroll: null, filter: null },
    kind: 'navigate',
  },
  {
    id: 'about',
    label: 'About',
    keys: ['F1', 'a'],
    icon: 'User',
    patch: { overlay: 'about' },
    kind: 'navigate',
  },
  {
    id: 'projects',
    label: 'Projects',
    keys: ['F2', 'p'],
    icon: 'FolderKanban',
    patch: { overlay: 'projects' },
    kind: 'navigate',
  },
  {
    id: 'log',
    label: 'Log',
    keys: ['F3', 'b'],
    icon: 'NotebookPen',
    patch: { overlay: 'log' },
    kind: 'navigate',
  },
  {
    id: 'search',
    label: 'Search',
    keys: ['F4', 's'],
    icon: 'Search',
    patch: { overlay: 'search' },
    kind: 'navigate',
  },
  { id: 'mute', label: 'Mute key clicks', keys: ['F5'], icon: 'VolumeX', kind: 'toggle' },
  { id: 'theme', label: 'Toggle theme', keys: ['F6', 't'], icon: 'SunMoon', kind: 'toggle' },
  { id: 'locale', label: 'Cycle language', keys: ['Alt', 'l'], icon: 'Languages', kind: 'cycle' },
  {
    id: 'cmdk',
    label: 'Command palette',
    keys: ['Meta', 'k', ' ', 'Enter'],
    icon: 'Command',
    patch: { cmdk: 'open' },
    kind: 'navigate',
  },
  { id: 'copy-email', label: 'Copy email', keys: ['c'], icon: 'Mail', kind: 'effect' },
];
