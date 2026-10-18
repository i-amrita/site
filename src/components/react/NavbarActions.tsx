import { Command, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Providers } from './Providers';
import { ThemeToggle } from './ThemeToggle';
import { useActions } from './use-actions';

function Left() {
  const { run } = useActions();
  return (
    <Button variant="ghost" size="icon" aria-label="Command palette" onClick={() => run('cmdk')}>
      <Command className="size-4" />
    </Button>
  );
}

function Right() {
  const { run } = useActions();
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" aria-label="Search" onClick={() => run('search')}>
        <Search className="size-4" />
      </Button>
      <ThemeToggle />
    </div>
  );
}

/** Navbar interactive pieces as islands. `side` picks the slot; both share the nuqs URL emitter. */
export function NavbarActions({ side }: { side: 'left' | 'right' }) {
  return <Providers toaster={false}>{side === 'left' ? <Left /> : <Right />}</Providers>;
}
