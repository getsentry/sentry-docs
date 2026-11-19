import {DOCS_ORIGIN} from 'sentry-docs/docsSite.mjs';

export const GET = (_request: Request) => {
  return new Response(
    `
Sitemap: ${DOCS_ORIGIN}/sitemap.xml

User-agent: *
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes
`.trim(),
    {headers: {'content-type': 'text/plain'}}
  );
};
