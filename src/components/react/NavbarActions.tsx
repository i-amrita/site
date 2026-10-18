import { Command, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { m, useLocale } from '@/lib/i18n';

import { LocaleSwitchButton } from './LocaleSwitch';
import { Providers } from './Providers';
import { ThemeToggle } from './ThemeToggle';
import { useActions } from './use-actions';

function Left() {
  const { run } = useActions();
  useLocale();
  return (
    <Button variant="ghost" size="icon" aria-label={m.action_cmdk()} onClick={() => run('cmdk')}>
      <Command className="size-4" />
    </Button>
  );
}

function Right() {
  const { run } = useActions();
  useLocale();
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={m.action_search()}
        onClick={() => run('search')}
      >
        <Search className="size-4" />
      </Button>
      <LocaleSwitchButton />
      <ThemeToggle />
    </div>
  );
}

/** Navbar interactive pieces as islands. `side` picks the slot; both share the nuqs URL emitter. */
export function NavbarActions({ side }: { side: 'left' | 'right' }) {
  return <Providers toaster={false}>{side === 'left' ? <Left /> : <Right />}</Providers>;
}
