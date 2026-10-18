import { useQueryStates } from 'nuqs';
import { useEffect } from 'react';

import { t, useLocale, type MessageKey } from '@/lib/i18n';
import { urlStateParsers } from '@/lib/url-state';

import { CmdK, type CmdKProject } from './CmdK';
import { Providers } from './Providers';
import { SearchModal } from './SearchModal';

/**
 * Static Astro copy ships as English HTML marked `data-i18n="key"` (or `data-i18n-aria="key"`).
 * This swaps it to the active locale and keeps `<html lang>` in sync.
 */
function StaticCopy() {
  const { locale } = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = 'ltr';
    for (const el of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
      el.textContent = t(el.dataset['i18n'] as MessageKey);
    }
    for (const el of document.querySelectorAll<HTMLElement>('[data-i18n-aria]')) {
      el.setAttribute('aria-label', t(el.dataset['i18nAria'] as MessageKey));
    }
  }, [locale]);
  return null;
}

/**
 * Cmd/Ctrl+K opens the palette on every route. The home keyboard hero already binds it, so skip there
 * (two handlers would push `?cmdk=open` twice).
 */
function CmdKShortcut() {
  const [{ cmdk }, setState] = useQueryStates(urlStateParsers);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.code !== 'KeyK' || e.defaultPrevented) return;
      if (document.querySelector('[data-keyboard-frame]')) return;
      e.preventDefault();
      if (cmdk !== 'open') void setState({ cmdk: 'open' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cmdk, setState]);
  return null;
}

/** The one island for CmdK + the search overlay. Mounted from `Base.astro` so it exists on every page. */
export function SearchOverlays({
  projects,
  searchModal = true,
}: {
  projects: CmdKProject[];
  /** False on `/search`, which renders the same panel inline. */
  searchModal?: boolean;
}) {
  return (
    <Providers toaster={false}>
      <StaticCopy />
      <CmdKShortcut />
      <CmdK projects={projects} />
      {searchModal && <SearchModal />}
    </Providers>
  );
}
