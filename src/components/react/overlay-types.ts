/** JSON-serializable overlay data built from the content collections in `OverlaysIsland.astro`. */
export interface ProjectItem {
  id: string;
  /** `work` shows role and org; `project` is a self-initiated build. */
  kind: 'work' | 'project';
  title: string;
  role?: string;
  org?: string;
  period: string;
  /** Already truncated to 200 chars. */
  summary: string;
  tags: string[];
}

export interface ResearchItem {
  id: string;
  title: string;
  /** Journal or conference. */
  venue: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  description: string;
  /** External link to the paper. */
  href: string;
}

export interface PostItem {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}
