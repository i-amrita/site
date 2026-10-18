import House from '~icons/ph/house-light';
import Search from '~icons/ph/magnifying-glass-light';
import User from '~icons/ph/user-light';

import { m, useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import { LocaleSwitchButton, PILL_ITEM } from './LocaleSwitch';
import { Providers } from './Providers';
import { ThemeToggle } from './ThemeToggle';
import { useActions } from './use-actions';

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />;
}

function Pill({ pathname }: { pathname: string }) {
  const { run } = useActions();
  useLocale();
  const home = pathname === '/';
  return (
    <>
      <div className="flex items-center gap-1">
        <a
          href="/"
          aria-label={m.nav_home()}
          aria-current={home ? 'page' : undefined}
          className={cn(PILL_ITEM, 'size-7')}
        >
          <House className="size-4" aria-hidden="true" />
          {home && (
            <span
              aria-hidden="true"
              className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand"
            />
          )}
        </a>
        <button
          type="button"
          aria-label={m.action_about()}
          onClick={() => run('about')}
          className={cn(PILL_ITEM, 'size-7')}
        >
          <User className="size-4" aria-hidden="true" />
        </button>
      </div>
      <Divider />
      <div className="flex items-center">
        <button
          type="button"
          title="⌘K"
          aria-label={m.action_search()}
          onClick={() => run('cmdk')}
          className={cn(PILL_ITEM, 'size-7')}
        >
          <Search className="size-4" aria-hidden="true" />
        </button>
      </div>
      <Divider />
      <div className="flex items-center gap-1">
        <LocaleSwitchButton variant="code" />
        <ThemeToggle />
      </div>
    </>
  );
}

/** Navbar pill: one island sharing the nuqs URL emitter. `pathname` comes from Astro so SSR and hydration agree. */
export function NavbarActions({ pathname }: { pathname: string }) {
  return (
    <Providers toaster={false}>
      <Pill pathname={pathname} />
    </Providers>
  );
}
