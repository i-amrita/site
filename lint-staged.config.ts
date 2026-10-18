// lint-staged runs as part of pre-commit (lefthook parallel). Kept simple:
// oxlint + oxfmt cover everything we need. Both are fast.
export default {
  '*.{ts,tsx,js,jsx,astro}': ['oxlint --fix', 'oxfmt'],
  '*.{json,css,yaml,yml}': 'oxfmt',
};
