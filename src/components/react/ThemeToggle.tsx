import { m, useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import { PILL_ITEM } from './LocaleSwitch';
import { useActions } from './use-actions';

/** Brand dot with a radar ping: toggles `?theme=`. The ping is off under `prefers-reduced-motion`. */
export function ThemeToggle() {
  const { run } = useActions();
  useLocale();
  return (
    <button
      type="button"
      aria-label={m.action_theme()}
      onClick={() => run('theme')}
      className={cn(PILL_ITEM, 'size-7')}
    >
      <span className="relative flex size-2.5">
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-brand/60 [animation-duration:1.6s] motion-reduce:animate-none"
        />
        <span className="relative size-2.5 rounded-full bg-brand" />
      </span>
    </button>
  );
}
