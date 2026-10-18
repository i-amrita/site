import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { currentTheme } from '@/lib/theme';

import { useActions } from './use-actions';

/** Icon button: toggles `?theme=`. Renders both icons and lets CSS pick by `color-scheme`. */
export function ThemeToggle() {
  const { run } = useActions();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => run('theme')}
      data-current={typeof document === 'undefined' ? undefined : currentTheme()}
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}
