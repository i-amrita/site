import { ActionOverlay } from '@/components/react/ActionOverlay';
import { TagChips, WorkList } from '@/components/react/content-blocks';
import type { ProjectItem } from '@/components/react/overlay-types';
import { m, useLocale } from '@/lib/i18n';
import { tagSlug } from '@/lib/tags';

interface Props {
  open: boolean;
  projects: ProjectItem[];
  tags: string[];
  filter: string | null;
  scroll: number | null;
  onClose: () => void;
  onFilter: (tag: string | null) => void;
  onScroll: (top: number) => void;
}

/** Work drawer. Same list markup as `/work` (`WorkList`), filtered in memory instead of by CSS. */
export function ProjectsOverlay({
  open,
  projects,
  tags,
  filter,
  scroll,
  onClose,
  onFilter,
  onScroll,
}: Props) {
  useLocale();
  const active = filter ? tagSlug(filter) : null;
  const visible = active
    ? projects.filter((p) => p.tags.some((t) => tagSlug(t) === active))
    : projects;

  return (
    <ActionOverlay
      open={open}
      title={m.overlay_projects_title()}
      description={m.overlay_projects_description()}
      onClose={onClose}
      readMore={{ href: '/work', label: m.overlay_projects_see_all() }}
      scrollTop={scroll ?? 0}
      onScrollTop={onScroll}
    >
      <TagChips
        tags={tags}
        active={active}
        onSelect={onFilter}
        ariaLabel={m.projects_filter_aria()}
        allLabel={m.projects_filter_all()}
        className="mb-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
      />
      {visible.length === 0 ? (
        <p className="text-muted-foreground">{m.projects_empty_filter()}</p>
      ) : (
        <WorkList projects={visible} readMore={m.projects_read_more()} />
      )}
    </ActionOverlay>
  );
}
