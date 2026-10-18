import { NuqsAdapter } from 'nuqs/adapters/react';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { TooltipProvider } from '@/components/ui/tooltip';

/** Wrap every island root. nuqs shares one URL emitter across islands, so state stays in sync. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="bottom-center" />
    </NuqsAdapter>
  );
}
