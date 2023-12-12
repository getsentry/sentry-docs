/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

module.exports = {
  extends: ['sentry-docs'],
  globals: {
    jest: true,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // Reach is vendored into gatsby. They have their own webpack
        // resolution for it which this eslint plugin can't seem to detect
        'import/no-unresolved': ['error', {ignore: ['@reach']}],
      },
    },
  ],
};
