/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'site',
        'content',
        'i18n',
        'keyboard',
        'search',
        'audio',
        'cmdk',
        'theme',
        'tokens',
        'agents',
        'docs',
        'deps',
        'ci',
        'deploy',
        'license',
      ],
    ],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
  },
};