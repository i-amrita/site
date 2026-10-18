import { ArrowRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { m, useLocale } from '@/lib/i18n';

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

const MOBILE_QUERY = '(max-width: 639.98px)';

function subscribeMobile(cb: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

/** Shared shell: vaul Drawer (grabber, drag-down, no X) on mobile, centered Radix Dialog on desktop. */
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
  useLocale();
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

  const isMobile = useIsMobile();
  const onOpenChange = (next: boolean) => !next && onClose();

  const content = (
    <>
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
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92dvh] border-border bg-page text-fg">
          <header className="border-b border-border px-5 py-3 text-left">
            <DrawerTitle className="font-display text-xl">{title}</DrawerTitle>
            <DrawerDescription className="sr-only">{description}</DrawerDescription>
          </header>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(e) => {
          // Focus the dialog itself so no control shows a focus ring on open.
          e.preventDefault();
          (e.target as HTMLElement | null)?.closest<HTMLElement>('[role="dialog"]')?.focus();
        }}
        className="flex max-h-[85dvh] max-w-2xl flex-col gap-0 rounded-card border-border bg-page p-0 text-fg"
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
            <span className="sr-only">{m.overlay_close()}</span>
          </button>
        </header>
        {content}
      </DialogContent>
    </Dialog>
  );
}
