import { useQueryStates } from 'nuqs';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { urlStateParsers } from '@/lib/url-state';

import { SearchPanel } from './SearchPanel';

const COPY = { title: 'Search', description: 'Search projects, posts and pages.' } as const;

/** `?overlay=search&q=...&mode=ai|keyword`. Closing clears all three. */
export function SearchModal() {
  const [{ overlay }, setState] = useQueryStates(urlStateParsers);
  return (
    <Dialog
      open={overlay === 'search'}
      onOpenChange={(open) => {
        if (!open) void setState({ overlay: null, q: null, mode: null });
      }}
    >
      <DialogContent className="top-[10%] max-h-[80dvh] translate-y-0 grid-cols-[minmax(0,1fr)] overflow-y-auto sm:max-w-xl">
        <DialogTitle>{COPY.title}</DialogTitle>
        <DialogDescription className="sr-only">{COPY.description}</DialogDescription>
        <SearchPanel autoFocus />
      </DialogContent>
    </Dialog>
  );
}
