import { Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LOCALE_NAMES, LOCALES, m, useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import { Providers } from './Providers';

/** Bare button, for use inside an existing `<Providers>` tree. */
export function LocaleSwitchButton() {
  const { locale, setLocale } = useLocale();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={m.locale_switch_label()}>
          <Languages />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1">
        <ul role="listbox" aria-label={m.locale_switch_label()} className="flex flex-col">
          {LOCALES.map((code) => (
            <li key={code} role="option" aria-selected={code === locale}>
              <button
                type="button"
                lang={code}
                onClick={() => void setLocale(code)}
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
