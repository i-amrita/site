import { useQueryStates } from 'nuqs';

import { KindChips, TagChips } from '@/components/react/content-blocks';
import { Providers } from '@/components/react/Providers';
import { m, useLocale } from '@/lib/i18n';
import { tagSlug } from '@/lib/tags';
import { urlStateParsers } from '@/lib/url-state';

interface Props {
  tags: string[];
}

function Chips({ tags }: Props) {
  useLocale();
  const [{ filter, kind }, setState] = useQueryStates({
    filter: urlStateParsers.filter,
    kind: urlStateParsers.kind,
  });
  const active = filter ? tagSlug(filter) : null;
  // All sections and rows are server-rendered; these rules hide the ones that do not match.
  const css = [
    kind && `[data-kind-section]:not([data-kind-section=${JSON.stringify(kind)}]){display:none}`,
    active && `[data-project-card]:not([data-tags~=${JSON.stringify(active)}]){display:none}`,
  ]
    .filter(Boolean)
    .join('');
  return (
    <div className="flex flex-col gap-3">
      {css && <style>{css}</style>}
      <KindChips
        active={kind}
        onSelect={(next) => void setState({ kind: next }, { history: 'replace' })}
        ariaLabel={m.kind_aria()}
        allLabel={m.projects_filter_all()}
        labels={{
          work: m.kind_work(),
          projects: m.kind_projects(),
          research: m.kind_research(),
        }}
      />
      {tags.length > 0 && (
        <TagChips
          tags={tags}
          active={active}
          onSelect={(tag) => void setState({ filter: tag }, { history: 'replace' })}
          ariaLabel={m.projects_filter_aria()}
          allLabel={m.projects_filter_all()}
        />
      )}
    </div>
  );
}

export function ProjectFilter(props: Props) {
  return (
    <Providers>
      <Chips {...props} />
    </Providers>
  );
}
