import { NuqsAdapter } from 'nuqs/adapters/react';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { TooltipProvider } from '@/components/ui/tooltip';

/** Wrap every island root. nuqs shares one URL emitter across islands, so state stays in sync. */
/** Mount the `<Toaster>` in exactly one island per page (`toaster={false}` elsewhere) or toasts duplicate. */
export function Providers({
  children,
  toaster = true,
}: {
  children: ReactNode;
  toaster?: boolean;
}) {
  return (
    <NuqsAdapter>
      <TooltipProvider>{children}</TooltipProvider>
      {toaster && <Toaster position="bottom-center" />}
    </NuqsAdapter>
  );
}
