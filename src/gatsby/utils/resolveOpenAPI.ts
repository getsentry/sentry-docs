/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */
/* eslint-disable no-console */

import {promises as fs} from 'fs';

// SENTRY_API_SCHEMA_SHA is used in the sentry-docs GHA workflow in getsentry/sentry-api-schema.
// DO NOT change variable name unless you change it in the sentry-docs GHA workflow in getsentry/sentry-api-schema.
const SENTRY_API_SCHEMA_SHA = 'e137f7d1fd74fcc1f5fc7ed8e239242c5dc2eb88';

const activeEnv = process.env.GATSBY_ENV || process.env.NODE_ENV || 'development';

async function main() {
  if (activeEnv === 'development' && process.env.OPENAPI_LOCAL_PATH) {
    try {
      console.log(`Fetching from ${process.env.OPENAPI_LOCAL_PATH}`);
      const data = await fs.readFile(process.env.OPENAPI_LOCAL_PATH, 'utf8');
      return data;
    } catch (error) {
      console.log(
        `Failed to connect to  ${process.env.OPENAPI_LOCAL_PATH}. Continuing to fetch versioned schema from GitHub.
        ${error}`
      );
    }
  }
  const response = await fetch(
    `https://raw.githubusercontent.com/getsentry/sentry-api-schema/${SENTRY_API_SCHEMA_SHA}/openapi-derefed.json`
  );
  return await response.json();
}

export default main;
