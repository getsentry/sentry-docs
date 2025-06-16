module.exports = {
  extends: ['sentry-docs', 'plugin:@next/next/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    'import/no-nodejs-modules': 'off',
    '@typescript-eslint/ban-types': 'off', // TODO: fix this upstream in https://github.com/getsentry/eslint-config-sentry
    '@typescript-eslint/no-unused-vars': 'off', // TODO: fix this upstream in https://github.com/getsentry/eslint-config-sentry
  },
  plugins: ['@typescript-eslint'],
};
