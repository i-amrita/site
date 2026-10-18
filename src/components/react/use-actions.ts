import { useQueryStates } from 'nuqs';
/**
 * Shared action dispatcher. Every surface (keyboard, navbar, CmdK, overlays) calls `run(id)`.
 *
 *   const { run } = useActions();
 *   run('projects');   // patches `?overlay=projects` (push)
 *   run('theme');      // toggles `?theme=` and applies it to <html>
 *
 * Requirements: render inside `<Providers>` (nuqs adapter). Toasts need one mounted `<Toaster>`.
 * Navigate patches use the ACTIONS registry; history mode follows `historyFor` (push if any patched key pushes).
 * Toggle/cycle/effect actions compute their value at call time. `copy-email` never touches the URL.
 */
import { useCallback } from 'react';
import { toast } from 'sonner';

import { ACTIONS, type ActionId } from '@/lib/actions';
import { EMAIL } from '@/lib/site';
import { applyTheme, currentTheme } from '@/lib/theme';
import { historyFor, LOCALES, urlStateParsers, type UrlStateKey } from '@/lib/url-state';

type Patch = Partial<Record<UrlStateKey, string | null>>;

export function useActions() {
  const [state, setState] = useQueryStates(urlStateParsers);

  const apply = useCallback(
    (patch: Patch) => {
      const keys = Object.keys(patch) as UrlStateKey[];
      const history = keys.some((k) => historyFor[k] === 'push') ? 'push' : 'replace';
      void setState(patch as never, { history });
    },
    [setState],
  );

  const run = useCallback(
    (id: ActionId) => {
      const action = ACTIONS.find((a) => a.id === id);
      if (!action) return;
      switch (id) {
        case 'mute':
          apply({ mute: state.mute === '1' ? '0' : '1' });
          return;
        case 'theme': {
          const next = currentTheme() === 'dark' ? 'light' : 'dark';
          applyTheme(next);
          apply({ theme: next });
          return;
        }
        case 'locale': {
          const i = LOCALES.indexOf(state.locale ?? 'en');
          apply({ locale: LOCALES[(i + 1) % LOCALES.length] ?? 'en' });
          return;
        }
        case 'copy-email':
          void navigator.clipboard
            ?.writeText(EMAIL)
            .then(() => toast.success('Email copied'))
            .catch(() => toast.error('Could not copy email'));
          return;
        default:
          if (action.patch) apply(action.patch);
      }
    },
    [apply, state.mute, state.locale],
  );

  return { run, state };
}
