module.exports = {
  extends: ['sentry-docs', 'plugin:@next/next/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    'import/no-nodejs-modules': 'off',
  },
};
