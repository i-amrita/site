/**
 * Action registry shared by the keyboard hero, CmdK, and the navbar.
 * `patch` is the URL-state change an action applies. `null` means "remove the key".
 * Icons are lucide names (resolved to components by the consumer); never inline raw SVG.
 */
import type { MessageKey } from './i18n';
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
  /** Message key for the label. Resolve at render time with `t(action.labelKey)`; never freeze at import. */
  labelKey: MessageKey;
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
    labelKey: 'action_close',
    keys: ['Escape'],
    icon: 'X',
    patch: { overlay: null, cmdk: null, q: null, scroll: null, filter: null },
    kind: 'navigate',
  },
  {
    id: 'about',
    labelKey: 'action_about',
    keys: ['F1', 'a'],
    icon: 'User',
    patch: { overlay: 'about' },
    kind: 'navigate',
  },
  {
    id: 'projects',
    labelKey: 'action_projects',
    keys: ['F2', 'p'],
    icon: 'FolderKanban',
    patch: { overlay: 'projects' },
    kind: 'navigate',
  },
  {
    id: 'log',
    labelKey: 'action_log',
    keys: ['F3', 'b'],
    icon: 'NotebookPen',
    patch: { overlay: 'log' },
    kind: 'navigate',
  },
  {
    id: 'search',
    labelKey: 'action_search',
    keys: ['F4', 's'],
    icon: 'Search',
    patch: { overlay: 'search' },
    kind: 'navigate',
  },
  { id: 'mute', labelKey: 'action_mute', keys: ['F5'], icon: 'VolumeX', kind: 'toggle' },
  { id: 'theme', labelKey: 'action_theme', keys: ['F6', 't'], icon: 'SunMoon', kind: 'toggle' },
  { id: 'locale', labelKey: 'action_locale', keys: ['Alt', 'l'], icon: 'Languages', kind: 'cycle' },
  {
    id: 'cmdk',
    labelKey: 'action_cmdk',
    keys: ['Meta', 'k', ' ', 'Enter'],
    icon: 'Command',
    patch: { cmdk: 'open' },
    kind: 'navigate',
  },
  { id: 'copy-email', labelKey: 'action_copy_email', keys: ['c'], icon: 'Mail', kind: 'effect' },
];
