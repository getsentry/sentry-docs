const js = require('@eslint/js');
const nextPlugin = require('@next/eslint-plugin-next');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const simpleImportSortPlugin = require('eslint-plugin-simple-import-sort');
const globals = require('globals');

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

  // Base JavaScript recommended rules
  js.configs.recommended,

  // TypeScript configuration (from eslint-config-sentry-docs)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      // Disable base rules that TypeScript handles
      'no-undef': 'off',

      // Use TypeScript version of no-shadow (from eslint-config-sentry-docs)
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',

      // Use TypeScript version of no-redeclare (from eslint-config-sentry-docs)
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',

      // TypeScript no-unused-vars (from eslint-config-sentry-docs)
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'all',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Turned off in eslint-config-sentry-docs
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',

      // Replacement rules for deprecated @typescript-eslint/ban-types (removed in v8)
      // Original ban-types config banned String, Number, Boolean, Symbol, BigInt, Object, [], [[]], [[[]]]
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {allowInterfaces: 'with-single-extends'},
      ],
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
    },
  },

  // JavaScript configuration (non-TS files)
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Use base no-shadow for JS files (TS files use @typescript-eslint/no-shadow)
      'no-shadow': 'error',
    },
  },

  // React configuration (from eslint-config-sentry-react/rules/react.js)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules from eslint-config-sentry-react/rules/react.js
      'react/display-name': 'off',
      'react/no-multi-comp': 'off',
      'react/jsx-fragments': ['error', 'element'],
      'react/jsx-handler-names': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'off', // Not needed with React 17+ JSX transform
      'react/jsx-uses-vars': 'error',
      'react/no-deprecated': 'error',
      'react/no-is-mounted': 'warn',
      'react/no-find-dom-node': 'warn',
      'react/no-render-return-value': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-did-mount-set-state': 'error',
      'react/no-did-update-set-state': 'error',
      'react/no-redundant-should-component-update': 'error',
      'react/no-typos': 'error',
      'react/no-string-refs': 'warn',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': ['error', {ignore: ['css']}],
      'react/no-unused-prop-types': 'off',
      'react/prop-types': 'off',
      'react/require-render-return': 'error',
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
      'react/self-closing-comp': 'error',
      'react/sort-comp': 'warn',
      'react/jsx-wrap-multilines': 'off',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/function-component-definition': [
        'error',
        {namedComponents: 'function-declaration'},
      ],

      // React hooks rules from eslint-config-sentry-react
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },

  // Import rules (from eslint-config-sentry-docs and eslint-config-sentry-react/rules/imports.js)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
      import: importPlugin,
    },
    rules: {
      // Import sorting from eslint-config-sentry-docs
      'sort-imports': 'off',
      'import/order': 'off', // Disabled in favor of simple-import-sort
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Import rules from eslint-config-sentry-react/rules/imports.js
      'import/no-unresolved': 'off',
      'import/named': 'off',
      'import/default': 'off',
      'import/export': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',
      'import/no-deprecated': 'off',
      'import/no-mutable-exports': 'off',
      'import/no-commonjs': 'off',
      'import/no-amd': 'error',
      'import/no-duplicates': 'error',
      'import/no-namespace': 'off',
      'import/extensions': 'off',
      'import/newline-after-import': 'error',
      'import/prefer-default-export': 'off',
      'import/no-restricted-paths': 'off',
      'import/max-dependencies': 'off',
      'import/no-absolute-path': 'error',
      'import/no-dynamic-require': 'off',
      'import/dynamic-import-chunkname': 'off',
      'import/no-internal-modules': 'off',
      'import/unambiguous': 'off',
      'import/no-webpack-loader-syntax': 'error',
      'import/no-unassigned-import': 'off',
      'import/no-named-default': 'error',
      'import/no-anonymous-default-export': [
        'error',
        {
          allowArray: false,
          allowArrowFunction: false,
          allowAnonymousClass: false,
          allowAnonymousFunction: false,
          allowCallExpression: true,
          allowLiteral: false,
          allowObject: false,
        },
      ],

      // Override from original .eslintrc.js
      'import/no-nodejs-modules': 'off',
    },
  },

  // Next.js plugin rules
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },

  // Main configuration with globals
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    rules: {
      // Base rules from eslint-config-sentry
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'consistent-return': 'error',
      'default-case': 'error',
      'dot-notation': ['error', {allowKeywords: true}],
      'guard-for-in': 'off', // Marked [REVISIT ME] in original, kept off
      'no-alert': 'error',
      'no-caller': 'error',
      'no-else-return': ['error', {allowElseIf: false}],
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-floating-decimal': 'error',
      'no-implied-eval': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-with': 'error',
      radix: 'error',
      'require-await': 'error',
      'vars-on-top': 'off', // Marked off in original
      yoda: 'error',
      'wrap-iife': ['error', 'any'],
      'object-shorthand': ['error', 'properties'],

      // Variables (no-shadow is handled in TypeScript config block for TS files)
      'no-shadow-restricted-names': 'error',

      // Turn off rules not in original eslint-config-sentry
      'no-useless-escape': 'off',

      // Spacing (let Prettier handle most, but these were in original)
      'computed-property-spacing': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'never'],
      'space-infix-ops': 'error',
      'multiline-comment-style': ['error', 'separate-lines'],
      'spaced-comment': [
        'error',
        'always',
        {
          line: {markers: ['/'], exceptions: ['-', '+']},
          block: {exceptions: ['*'], balanced: true},
        },
      ],
    },
  },
];
