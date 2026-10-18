import { LocaleSwitchButton } from '@/components/react/LocaleSwitch';
import { Providers } from '@/components/react/Providers';
import { m, useLocale } from '@/lib/i18n';

function Demo() {
  const { locale } = useLocale();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <code
          data-testid="locale"
          className="rounded-key bg-key-light px-2 py-1 font-key text-key-light-fg"
        >
          {locale}
        </code>
        <LocaleSwitchButton />
      </div>
      <h1 className="font-display text-3xl">{m.hero_title()}</h1>
      <p>{m.hero_subtitle()}</p>
      <ul className="list-disc pl-6">
        <li>{m.nav_search()}</li>
        <li>{m.cmdk_placeholder()}</li>
        <li>{m.keyboard_hint()}</li>
        <li>{m.toast_locale({ language: m.nav_locale() })}</li>
        <li>{m.search_empty({ query: 'foo' })}</li>
      </ul>
    </div>
  );
}

export default function I18nDemo() {
  return (
    <Providers>
      <Demo />
    </Providers>
  );
}
