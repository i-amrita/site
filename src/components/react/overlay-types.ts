/** JSON-serializable overlay data built from the content collections in `OverlaysIsland.astro`. */
export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  org: string;
  period: string;
  /** Already truncated to 200 chars. */
  summary: string;
  tags: string[];
}

export interface PostItem {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}
