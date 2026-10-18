import { ActionOverlay } from '@/components/react/ActionOverlay';
import { LogList } from '@/components/react/content-blocks';
import type { PostItem } from '@/components/react/overlay-types';
import { m, useLocale } from '@/lib/i18n';

interface Props {
  open: boolean;
  posts: PostItem[];
  onClose: () => void;
}

/** Log drawer. Same list markup as `/posts` (`LogList`). The Log is the posts collection. */
export function LogOverlay({ open, posts, onClose }: Props) {
  useLocale();
  return (
    <ActionOverlay
      open={open}
      title={m.overlay_log_title()}
      description={m.overlay_log_description()}
      onClose={onClose}
      readMore={{ href: '/posts', label: m.overlay_log_see_all() }}
    >
      {posts.length === 0 ? (
        <p className="text-muted-foreground">{m.log_empty()}</p>
      ) : (
        <LogList posts={posts} />
      )}
    </ActionOverlay>
  );
}
