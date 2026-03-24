const {FlatCompat} = require('@eslint/eslintrc');
const js = require('@eslint/js');
const nextPlugin = require('@next/eslint-plugin-next');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  // Global ignores
  {
    ignores: [
      '.babelrc.js',
      '.next/**',
      'node_modules/**',
      'out/**',
      'public/**',
    ],
  },

  // Use FlatCompat for eslint-config-sentry-docs (still in eslintrc format)
  ...compat.extends('sentry-docs'),

  // Next.js plugin rules (use plugin directly to avoid conflicts with sentry-docs config)
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },

  // Main configuration and rule overrides
  {
    languageOptions: {
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    rules: {
      'import/no-nodejs-modules': 'off',

      // Disable deprecated @typescript-eslint rules from eslint-config-sentry-docs
      // These were removed/renamed in @typescript-eslint v8
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',

      // Enable the replacement rules for ban-types
      // Allow empty interfaces that extend other types (used for recursive type definitions)
      '@typescript-eslint/no-empty-object-type': ['error', {allowInterfaces: 'with-single-extends'}],
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',

      // Disable rules from plugins that aren't compatible with ESLint 9
      // eslint-plugin-no-lookahead-lookbehind-regexp@0.3.0 has incompatible schema
      'no-lookahead-lookbehind-regexp/no-lookahead-lookbehind-regexp': 'off',
    },
  },
];
