import {Fragment} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import {unified} from 'unified';
import {describe, expect, it} from 'vitest';

import {CliSetupMarkdown, InstructionMarkdown} from './markdown';

function htmlToMarkdown(html: string) {
  return String(
    unified()
      .use(rehypeParse, {fragment: true})
      .use(rehypeRemark, {
        document: false,
        handlers: {
          button() {},
        },
      })
      .use(remarkGfm)
      .use(remarkStringify)
      .processSync(html)
  );
}

describe('CLI setup markdown export', () => {
  it('keeps the install commands and drops the interactive card', () => {
    const html = renderToStaticMarkup(
      <Fragment>
        <div data-mdast="ignore">interactive card</div>
        <CliSetupMarkdown platformName="Next.js" />
      </Fragment>
    );

    const markdown = htmlToMarkdown(html);

    expect(markdown).not.toContain('interactive card');
    expect(markdown).toContain('## Set up with Sentry CLI');
    expect(markdown).toContain('the Sentry Next.js SDK');
    expect(markdown).toContain(
      '```bash\ncurl https://cli.sentry.dev/install -fsS | bash'
    );
    expect(markdown).toContain(
      '```powershell\nirm https://cli.sentry.dev/install.ps1 | iex'
    );
    expect(markdown).toContain('```bash\nbrew install getsentry/tools/sentry');
    expect(markdown).toContain('```bash\nnpx sentry@latest');
    expect(markdown).toContain(
      '[Learn more about the Sentry CLI](https://cli.sentry.dev/)'
    );
  });

  it('names Sentry when the page has no platform', () => {
    const markdown = htmlToMarkdown(renderToStaticMarkup(<CliSetupMarkdown />));

    expect(markdown).toContain('Set up Sentry with the Sentry CLI.');
    expect(markdown).not.toContain('SDK');
  });

  it('includes custom instruction prompts', () => {
    const markdown = htmlToMarkdown(
      renderToStaticMarkup(
        <InstructionMarkdown
          title="Agent-Assisted Migration"
          prompt="Read the migration guide before changing the SDK."
          description="Copy this prompt into your AI agent to migrate your Sentry SDK."
        />
      )
    );

    expect(markdown).toContain('## Agent-Assisted Migration');
    expect(markdown).toContain('Read the migration guide before changing the SDK.');
    expect(markdown).toContain(
      'Copy this prompt into your AI agent to migrate your Sentry SDK.'
    );
  });
});
