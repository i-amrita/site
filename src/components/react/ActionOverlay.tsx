import { ArrowRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

const COPY = { close: 'Close' } as const;

const SCROLL_THROTTLE_MS = 200;

interface Props {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  /** Link to the dedicated static page (the non-JS equivalent). */
  readMore: { href: string; label: string };
  children: ReactNode;
  /** Initial `scrollTop` restored when the overlay opens. */
  scrollTop?: number;
  /** Throttled scroll reports (px). */
  onScrollTop?: (top: number) => void;
}

/** Shared shell: Radix Dialog as centered modal on desktop and full-height bottom sheet on mobile. */
export function ActionOverlay({
  open,
  title,
  description,
  onClose,
  readMore,
  children,
  scrollTop = 0,
  onScrollTop,
}: Props) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initial = useRef(scrollTop);
  initial.current = scrollTop;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // Restore once on mount of the scroll container (mount happens when the dialog opens).
  const setScroller = useCallback((el: HTMLDivElement | null) => {
    if (!el || initial.current <= 0) return;
    requestAnimationFrame(() => {
      el.scrollTop = initial.current;
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(e) => {
          // Focus the dialog itself so no control shows a focus ring on open.
          e.preventDefault();
          (e.target as HTMLElement | null)?.closest<HTMLElement>('[role="dialog"]')?.focus();
        }}
        className="inset-x-0 top-auto bottom-0 left-0 flex max-h-[92dvh] max-w-full translate-x-0 translate-y-0 flex-col gap-0 rounded-b-none border-border bg-page p-0 text-fg sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[85dvh] sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card"
      >
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <DialogTitle className="font-display text-xl">{title}</DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
          <button
            type="button"
            onClick={onClose}
            className="rounded-key p-1.5 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="size-5" aria-hidden="true" />
            <span className="sr-only">{COPY.close}</span>
          </button>
        </header>
        <div
          ref={setScroller}
          data-overlay-scroll
          onScroll={(e) => {
            if (!onScrollTop || timer.current) return;
            const el = e.currentTarget;
            timer.current = setTimeout(() => {
              timer.current = null;
              onScrollTop(Math.round(el.scrollTop));
            }, SCROLL_THROTTLE_MS);
          }}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5"
        >
          {children}
        </div>
        <footer className="border-t border-border px-5 py-3">
          <a
            href={readMore.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {readMore.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
