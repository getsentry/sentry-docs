import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';

const sitemap = isDeveloperDocs
  ? 'https://develop.sentry.dev/sitemap.xml'
  : 'https://docs.sentry.io/sitemap.xml';

export const GET = (_request: Request) => {
  return new Response(
    `
Sitemap: ${sitemap}

User-agent: *
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes
`.trim(),
    {headers: {'content-type': 'text/plain'}}
  );
};
