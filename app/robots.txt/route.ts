import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';

export const GET = (_request: Request) => {
  return new Response(
    `
Sitemap: ${isDeveloperDocs ? 'https://develop.sentry.dev/sitemap.xml' : 'https://docs.sentry.io/sitemap.xml'}
User-agent: *
`.trim(),
    {headers: {'content-type': 'text/plain'}}
  );
};
