import {DOCS_ORIGIN} from 'sentry-docs/docsOrigin';

const sitemap = `${DOCS_ORIGIN}/sitemap.xml`;

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
