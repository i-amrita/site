/**
 * Site-wide constants. Personal links are configurable without editing code:
 * set the `PUBLIC_*` variables in `.env` (see `.env.example`). Unset or empty values fall back to the placeholders below.
 * These are PUBLIC build-time values inlined into the client bundle, so never put secrets here.
 */
export const SITE_NAME = 'i-amrita';

const env = import.meta.env;

/** Empty strings count as unset so a blank `.env` line keeps the fallback. */
const pick = (value: string | undefined, fallback: string) => value?.trim() || fallback;

export const EMAIL = pick(env.PUBLIC_EMAIL, 'hello@example.com');

export const SOCIALS = {
  linkedin: pick(env.PUBLIC_LINKEDIN_URL, 'https://www.linkedin.com/in/your-handle'),
  research: pick(env.PUBLIC_RESEARCH_URL, 'https://example.com/research'),
  /** Empty means "no CV yet": the link is hidden. */
  cv: pick(env.PUBLIC_CV_URL, ''),
} as const;
