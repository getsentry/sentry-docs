/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

/* eslint-env node */
module.exports = {
  bracketSpacing: false,
  bracketSameLine: false,
  printWidth: 90,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  arrowParens: 'avoid',
  overrides: [
    // For mdx files we use the default prettier configs for codeblocks,
    // since at least for javascript, this is what most people use
    {
      files: ['*.md', '*.mdx'],
      options: {
        bracketSpacing: true,
        printWidth: 80,
        singleQuote: false,
        arrowParens: 'always',
      },
    },
  ],
};
