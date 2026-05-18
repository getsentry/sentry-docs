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

User-agent: GPTBot
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes

User-agent: OAI-SearchBot
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes

User-agent: Claude-Web
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes

User-agent: anthropic-ai
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes

User-agent: Google-Extended
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes

User-agent: Amazonbot
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes

User-agent: Bytespider
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes

User-agent: CCBot
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes

User-agent: Applebot-Extended
Allow: /
Content-Signal: ai-train=yes, search=yes, ai-input=yes
`.trim(),
    {headers: {'content-type': 'text/plain'}}
  );
};
