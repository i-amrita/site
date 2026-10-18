import { Command as CommandPrimitive } from 'cmdk';
import {
  FolderKanban,
  Languages,
  Mail,
  NotebookPen,
  Search,
  SunMoon,
  User,
  Volume2,
} from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { useRef } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { ActionId } from '@/lib/actions';
import { m, type MessageKey, t, useLocale } from '@/lib/i18n';
import { href, urlStateParsers } from '@/lib/url-state';
import { cn } from '@/lib/utils';

import { ResultBody, ResultIcon, SearchPill } from './SearchParts';
import { useActions } from './use-actions';
import { useSearch } from './use-search';

export interface CmdKProject {
  slug: string;
  title: string;
  org: string;
}

interface Entry {
  id: ActionId;
  labelKey: MessageKey;
  Icon: typeof User;
  keywords: string;
  /** Navigation targets that exist as pages when the overlay island is not on the current route. */
  overlay?: 'about' | 'projects' | 'log';
}

const NAVIGATION: Entry[] = [
  {
    id: 'projects',
    labelKey: 'cmdk_go_projects',
    Icon: FolderKanban,
    keywords: 'work portfolio',
    overlay: 'projects',
  },
  { id: 'about', labelKey: 'cmdk_go_about', Icon: User, keywords: 'bio me', overlay: 'about' },
  {
    id: 'log',
    labelKey: 'cmdk_go_log',
    Icon: NotebookPen,
    keywords: 'posts blog writing',
    overlay: 'log',
  },
];
const ACTIONS: Entry[] = [
  { id: 'theme', labelKey: 'action_theme', Icon: SunMoon, keywords: 'dark light mode' },
  { id: 'locale', labelKey: 'action_locale', Icon: Languages, keywords: 'locale translate' },
  { id: 'mute', labelKey: 'cmdk_toggle_clicks', Icon: Volume2, keywords: 'sound audio mute' },
  { id: 'copy-email', labelKey: 'action_copy_email', Icon: Mail, keywords: 'contact' },
];

const onHome = () => window.location.pathname === '/';
const go = (url: string) => window.location.assign(url);

const matches = (q: string, ...parts: string[]) =>
  !q || parts.join(' ').toLowerCase().includes(q.toLowerCase());

export function CmdK({ projects }: { projects: CmdKProject[] }) {
  useLocale();
  const [{ cmdk, q, mode }, setState] = useQueryStates(urlStateParsers);
  const { run } = useActions();
  const inputRef = useRef<HTMLInputElement>(null);
  const open = cmdk === 'open';
  const query = q ?? '';
  const trimmed = query.trim();
  const searching = trimmed.length > 2;
  const keywordOnly = mode === 'keyword';
  const { status, results, indexAvailable, ms } = useSearch(
    open && searching ? trimmed : '',
    !keywordOnly,
  );

  const close = () => void setState({ cmdk: null, q: null });

  const select = (entry: Entry) => {
    if (entry.overlay) {
      if (onHome()) void setState({ cmdk: null, q: null, overlay: entry.overlay });
      else go(href('/', { overlay: entry.overlay }));
      return;
    }
    close();
    run(entry.id);
  };

  const navigation = NAVIGATION.filter((e) => matches(trimmed, t(e.labelKey), e.keywords));
  const actions = ACTIONS.filter((e) => matches(trimmed, t(e.labelKey), e.keywords));
  const projectItems = searching ? [] : projects.filter((p) => matches(trimmed, p.title, p.org));

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent
        showCloseButton={false}
        className="top-[12%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">{m.action_cmdk()}</DialogTitle>
        <DialogDescription className="sr-only">{m.cmdk_description()}</DialogDescription>
        <Command shouldFilter={false} className="bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <CommandPrimitive.Input
              ref={inputRef}
              value={query}
              onValueChange={(v) => void setState({ q: v || null })}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !query) close();
              }}
              placeholder={m.cmdk_placeholder()}
              className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div
            className="flex items-center justify-between gap-2 border-b border-border px-3 py-1"
            data-cmdk-mode-bar
          >
            <div className="flex min-w-0 items-center gap-2">
              {searching ? (
                <SearchPill status={status} keywordOnly={keywordOnly} />
              ) : (
                <span className="truncate text-xs text-muted-foreground">
                  {m.search_placeholder()}
                </span>
              )}
              {searching && ms !== null && (
                <span className="font-key text-xs text-muted-foreground">{ms} ms</span>
              )}
            </div>
            <div
              role="group"
              aria-label={m.action_search()}
              className="flex shrink-0 items-center gap-1"
            >
              {(['ai', 'keyword'] as const).map((value) => {
                const active = (value === 'keyword') === keywordOnly;
                return (
                  <button
                    key={value}
                    type="button"
                    data-mode={value}
                    aria-pressed={active}
                    onClick={() => void setState({ mode: value })}
                    className={cn(
                      'inline-flex min-h-11 min-w-11 items-center justify-center rounded-key px-3 font-key text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      active
                        ? 'bg-brand-soft text-brand'
                        : 'text-muted-foreground hover:bg-surface-muted',
                    )}
                  >
                    {value === 'ai' ? m.search_mode_ai() : m.search_mode_keyword()}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="sr-only" aria-live="polite" role="status">
            {searching && status !== 'idle'
              ? m.search_results({ count: results.length, query: trimmed })
              : ''}
          </p>
          <CommandList className="max-h-[min(24rem,60dvh)] p-1">
            <CommandEmpty>{m.cmdk_empty()}</CommandEmpty>
            {searching && (
              <CommandGroup heading={m.cmdk_section_commands()}>
                <CommandItem
                  value="cmd-search-all"
                  onSelect={() => go(href('/search', { q: trimmed, mode }))}
                >
                  <Search /> {m.cmdk_search_all({ query: trimmed })}
                </CommandItem>
              </CommandGroup>
            )}
            {navigation.length > 0 && (
              <CommandGroup heading={m.cmdk_section_navigation()}>
                {navigation.map((e) => (
                  <CommandItem key={e.id} value={`nav-${e.id}`} onSelect={() => select(e)}>
                    <e.Icon /> {t(e.labelKey)}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {actions.length > 0 && (
              <CommandGroup heading={m.cmdk_section_actions()}>
                {actions.map((e) => (
                  <CommandItem key={e.id} value={`act-${e.id}`} onSelect={() => select(e)}>
                    <e.Icon /> {t(e.labelKey)}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {projectItems.length > 0 && (
              <CommandGroup heading={m.cmdk_section_projects()}>
                {projectItems.map((p) => (
                  <CommandItem
                    key={p.slug}
                    value={`proj-${p.slug}`}
                    onSelect={() => go(`/work/${p.slug}`)}
                  >
                    <FolderKanban /> {p.title}
                    <span className="ml-auto text-xs text-muted-foreground">{p.org}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {searching && (
              <CommandGroup heading={m.cmdk_section_results()}>
                {results.map((r) => (
                  <CommandItem
                    key={r.url}
                    value={`res-${r.url}`}
                    onSelect={() => go(r.url)}
                    className="items-start"
                  >
                    <ResultIcon type={r.type} className="mt-0.5" />
                    <ResultBody result={r} />
                  </CommandItem>
                ))}
                {results.length === 0 && (
                  <p className="px-2 py-3 text-xs text-muted-foreground">
                    {indexAvailable ? m.cmdk_empty() : m.search_no_index()}
                  </p>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
