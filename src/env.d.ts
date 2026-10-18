/// <reference path="../.astro/types.d.ts" />
/// <reference types="unplugin-icons/types/react" />

interface ImportMetaEnv {
  readonly PUBLIC_EMAIL?: string;
  readonly PUBLIC_LINKEDIN_URL?: string;
  readonly PUBLIC_RESEARCH_URL?: string;
  readonly PUBLIC_CV_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
