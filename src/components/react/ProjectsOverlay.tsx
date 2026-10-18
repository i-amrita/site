import { ActionOverlay } from '@/components/react/ActionOverlay';
import { ContentGroups, KindChips, TagChips } from '@/components/react/content-blocks';
import type { ProjectItem, ResearchItem } from '@/components/react/overlay-types';
import { m, useLocale } from '@/lib/i18n';
import { tagSlug } from '@/lib/tags';
import { href, type Kind } from '@/lib/url-state';

interface Props {
  open: boolean;
  projects: ProjectItem[];
  research: ResearchItem[];
  tags: string[];
  kind: Kind | null;
  filter: string | null;
  scroll: number | null;
  onClose: () => void;
  onKind: (kind: Kind | null) => void;
  onFilter: (tag: string | null) => void;
  onScroll: (top: number) => void;
}

/**
 * Work, projects and research in one drawer. `?kind=` presets the type (the Work and Projects keys),
 * `?filter=` narrows by tag. Same markup as `/work` (`ContentGroups`), filtered in memory instead of by CSS.
 */
export function ProjectsOverlay({
  open,
  projects,
  research,
  tags,
  kind,
  filter,
  scroll,
  onClose,
  onKind,
  onFilter,
  onScroll,
}: Props) {
  useLocale();
  const active = filter ? tagSlug(filter) : null;
  const byTag = (items: ProjectItem[]) =>
    active ? items.filter((p) => p.tags.some((t) => tagSlug(t) === active)) : items;
  const labels = {
    work: m.kind_work(),
    projects: m.kind_projects(),
    research: m.kind_research(),
    empty: m.kind_empty(),
    readMore: m.projects_read_more(),
    readPaper: m.research_read(),
  };

  return (
    <ActionOverlay
      open={open}
      title={kind ? labels[kind] : m.overlay_title_all()}
      description={m.overlay_projects_description()}
      onClose={onClose}
      readMore={{ href: href('/work', { kind }), label: m.overlay_projects_see_all() }}
      scrollTop={scroll ?? 0}
      onScrollTop={onScroll}
    >
      <KindChips
        active={kind}
        onSelect={onKind}
        ariaLabel={m.kind_aria()}
        allLabel={m.projects_filter_all()}
        labels={labels}
        className="mb-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
      />
      {kind !== 'research' && tags.length > 0 && (
        <TagChips
          tags={tags}
          active={active}
          onSelect={onFilter}
          ariaLabel={m.projects_filter_aria()}
          allLabel={m.projects_filter_all()}
          className="mb-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
        />
      )}
      <ContentGroups
        work={byTag(projects.filter((p) => p.kind === 'work'))}
        projects={byTag(projects.filter((p) => p.kind === 'project'))}
        // Publications carry no tags, so a tag filter leaves none.
        research={active ? [] : research}
        show={kind}
        headings={!kind}
        labels={labels}
      />
    </ActionOverlay>
  );
}
