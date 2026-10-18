import type { ReactNode } from 'react';

import { ActionOverlay } from '@/components/react/ActionOverlay';
import { SocialLinks } from '@/components/react/content-blocks';
import { m, useLocale } from '@/lib/i18n';

interface Props {
  open: boolean;
  onClose: () => void;
  /** About MDX rendered to static HTML at build time (Astro slot), the same source as `/about`. */
  children: ReactNode;
}

export function AboutOverlay({ open, onClose, children }: Props) {
  useLocale();
  return (
    <ActionOverlay
      open={open}
      title={m.overlay_about_title()}
      description={m.overlay_about_description()}
      onClose={onClose}
      readMore={{ href: '/about', label: m.overlay_about_read_more() }}
    >
      <div className="[&_p]:leading-relaxed [&_p+p]:mt-4">{children}</div>
      <div className="mt-6">
        <SocialLinks
          ariaLabel={m.socials_aria()}
          labels={{
            linkedin: m.socials_linkedin(),
            research: m.socials_research(),
            cv: m.socials_cv(),
          }}
        />
      </div>
    </ActionOverlay>
  );
}
