import {readFileSync, writeFileSync} from 'fs';

const isDeveloperDocs = !!process.env.DEVELOPER_DOCS;

// base config that is common to both the developer and sdk docs
const baseVercelJson = JSON.parse(readFileSync('base-vercel.json', 'utf8'));

if (baseVercelJson.redirects?.length > 0 || baseVercelJson.rewrites?.length > 0) {
  throw new Error(
    '🔴 base-vercel.json should not have any redirects or rewrites.\n' +
      'Please add them to sdk-docs-vercel-json-redirects.json or developer-docs-vercel-json-redirects.json file.'
  );
}

// sdk docs redirects
const sdkDocsRedirects = JSON.parse(
  readFileSync('sdk-docs-vercel-json-redirects.json', 'utf8')
);

// TODO: read the developer docs redirects from a file when it's available
const developerDocsRedirects = {};

const vercelJson = {
  ...baseVercelJson,
  ...(isDeveloperDocs ? developerDocsRedirects : sdkDocsRedirects),
};

writeFileSync('vercel.json', JSON.stringify(vercelJson, null, 2));

// eslint-disable-next-line no-console
console.log(`⚡️ Generated ${isDeveloperDocs ? 'Developer' : 'SDK'} docs vercel.json`);
