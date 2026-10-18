import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { m, useLocale } from '@/lib/i18n';

import { useActions } from './use-actions';

/** Icon button: toggles `?theme=`. Renders both icons and lets CSS pick by `color-scheme`. */
export function ThemeToggle() {
  const { run } = useActions();
  useLocale();
  return (
    <Button variant="ghost" size="icon" aria-label={m.action_theme()} onClick={() => run('theme')}>
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}
