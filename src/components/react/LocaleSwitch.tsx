import { useState } from 'react';
import Languages from '~icons/ph/translate-light';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LOCALE_NAMES, LOCALES, m, useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import { Providers } from './Providers';

/** Shared look for navbar pill items: 28px visible, 44px hit area via `::after`, hairline focus ring. */
export const PILL_ITEM =
  'relative inline-flex items-center justify-center rounded-full text-muted-foreground outline-none transition-colors duration-300 ease-(--ease-spring) after:absolute after:-inset-2 after:content-[""] hover:bg-fg/5 hover:text-fg focus-visible:ring-2 focus-visible:ring-brand aria-[current=page]:text-fg data-[state=open]:text-brand';

/** Bare button, for use inside an existing `<Providers>` tree. `code` renders the current locale code for the navbar pill. */
export function LocaleSwitchButton({ variant = 'icon' }: { variant?: 'icon' | 'code' }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === 'code' ? (
          <button
            type="button"
            aria-label={`${locale.toUpperCase()} ${m.locale_switch_label()}`}
            className={cn(PILL_ITEM, 'h-7 px-2 font-mono text-xs uppercase')}
          >
            {locale}
          </button>
        ) : (
          <Button variant="ghost" size="icon" aria-label={m.locale_switch_label()}>
            <Languages className="size-4" aria-hidden="true" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 border-0 p-1 shadow-lg ring-0">
        <ul role="listbox" aria-label={m.locale_switch_label()} className="flex flex-col">
          {LOCALES.map((code) => (
            <li key={code} role="option" aria-selected={code === locale}>
              <button
                type="button"
                lang={code}
                onClick={() => {
                  void setLocale(code);
                  setOpen(false);
                }}
                className={cn(
                  'w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground',
                  code === locale && 'bg-accent font-medium text-accent-foreground',
                )}
              >
                {LOCALE_NAMES[code]}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

/** Self-contained island: mount with `client:load`. */
export default function LocaleSwitch() {
  return (
    <Providers>
      <LocaleSwitchButton />
    </Providers>
  );
}
