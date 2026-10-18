/** Tags are matched by slug so `Human Centered` and `human-centered` share one filter value. */
export const tagSlug = (tag: string) => tag.trim().toLowerCase().replaceAll(/\s+/g, '-');
