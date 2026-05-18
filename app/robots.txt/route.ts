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

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot-Extended
Allow: /
`.trim(),
    {headers: {'content-type': 'text/plain'}}
  );
};
