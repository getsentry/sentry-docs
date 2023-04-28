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
      rules: {},
    },
  ],
};
