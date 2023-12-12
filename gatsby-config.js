/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

require('ts-node').register({
  files: true, // to that TS node hooks have access to local typings too
});

const activeEnv = process.env.GATSBY_ENV || process.env.NODE_ENV || 'development';

console.log(`Using environment config: '${activeEnv}'`);

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

if (process.env.VERCEL_GITHUB_COMMIT_REF === 'master' && process.env.ALGOLIA_ADMIN_KEY) {
  process.env.ALGOLIA_INDEX = '1';
}

// Note: this will export the config as `{ default: ... }` due to ESM interop
// introduced by `ts-node`. Gatsby automatically handles this output.
module.exports = require('./src/gatsby/config');
