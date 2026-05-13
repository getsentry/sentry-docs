import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import {describe, expect, it} from 'vitest';
import {unified} from 'unified';
import {remove} from 'unist-util-remove';

import {rehypeExpandCodeTabs} from './rehype-expand-code-tabs.mjs';

function htmlToMarkdown(html) {
  return String(
    unified()
      .use(rehypeParse)
      .use(rehypeExpandCodeTabs)
      .use(rehypeRemark, {
        document: false,
        handlers: {
          button() {},
        },
      })
      .use(() => tree => remove(tree, {type: 'inlineCode', value: ''}))
      .use(remarkGfm)
      .use(remarkStringify)
      .processSync(html)
  );
}

/**
 * Builds a minimal CodeTabs HTML structure matching what the component renders.
 * Each tab panel contains the CodeBlock chrome (filename display, copy button)
 * wrapping the actual <pre><code> block. The first tab is visible; subsequent
 * tabs have the `hidden` attribute.
 */
function buildCodeTabsHTML(tabs) {
  const buttons = tabs
    .map((t, i) => `<button data-active="${i === 0}">${t.title}</button>`)
    .join('');

  const panels = tabs
    .map((t, i) => {
      const filenameAttr = t.filename ? ` data-code-tab-filename="${t.filename}"` : '';
      const hiddenAttr = i > 0 ? ' hidden' : '';

      return (
        `<div data-code-tab-title="${t.title}"${filenameAttr}${hiddenAttr}>` +
        `<div class="code-block">` +
        `<div class="code-actions">` +
        `<code class="filename">${t.filename || ''}</code>` +
        `<button class="copy"><svg></svg></button>` +
        `</div>` +
        `<div class="copied">Copied</div>` +
        `<div><pre class="language-${t.lang}"><code>${t.code}</code></pre></div>` +
        `</div>` +
        `</div>`
      );
    })
    .join('');

  return `<div><div>${buttons}</div>${panels}</div>`;
}

describe('rehypeExpandCodeTabs', () => {
  it('expands hidden tabs and labels each with a bold heading', () => {
    const html = buildCodeTabsHTML([
      {
        title: 'Cloudflare Workers',
        lang: 'javascript',
        code: 'import { sentry } from "@sentry/hono/cloudflare";',
      },
      {
        title: 'Node.js',
        filename: 'instrument.mjs',
        lang: 'javascript',
        code: 'import * as Sentry from "@sentry/hono/node";',
      },
      {
        title: 'Bun',
        lang: 'javascript',
        code: 'import { sentry } from "@sentry/hono/bun";',
      },
    ]);

    const md = htmlToMarkdown(html);
    const codeBlocks = md.match(/```[\s\S]*?```/g);

    expect(codeBlocks).toHaveLength(3);
    expect(md).toContain('**Cloudflare Workers**');
    expect(md).toContain('**instrument.mjs**');
    expect(md).toContain('**Bun**');
    expect(codeBlocks[0]).toContain('@sentry/hono/cloudflare');
    expect(codeBlocks[1]).toContain('@sentry/hono/node');
    expect(codeBlocks[2]).toContain('@sentry/hono/bun');
  });

  it('prefers filename over tab title for the heading', () => {
    const html = buildCodeTabsHTML([
      {title: 'ESM', filename: 'instrument.mjs', lang: 'javascript', code: 'init();'},
      {title: 'CommonJS', filename: 'instrument.js', lang: 'javascript', code: 'init();'},
    ]);

    const md = htmlToMarkdown(html);

    expect(md).toContain('**instrument.mjs**');
    expect(md).toContain('**instrument.js**');
    expect(md).not.toContain('**ESM**');
    expect(md).not.toContain('**CommonJS**');
  });

  it('falls back to tab title when no filename is set', () => {
    const html = buildCodeTabsHTML([
      {title: 'Cloudflare Workers', lang: 'javascript', code: 'workers();'},
    ]);

    const md = htmlToMarkdown(html);

    expect(md).toContain('**Cloudflare Workers**');
  });

  it('strips CodeBlock chrome (filename display, copy button, copied indicator)', () => {
    const html = buildCodeTabsHTML([
      {title: 'Node.js', filename: 'instrument.mjs', lang: 'javascript', code: 'init();'},
    ]);

    const md = htmlToMarkdown(html);

    expect(md).not.toContain('Copied');
    expect(md).not.toContain('`instrument.mjs`');
  });

  it('does not affect code blocks outside of tabs', () => {
    const html =
      '<div><pre class="language-bash"><code>curl -sL https://sentry.io/get-cli/ | bash</code></pre></div>';

    const md = htmlToMarkdown(html);

    const codeBlocks = md.match(/```[\s\S]*?```/g);
    expect(codeBlocks).toHaveLength(1);
    expect(md).not.toMatch(/\*\*.*\*\*\n/);
    expect(codeBlocks[0]).toContain('curl -sL');
  });

  it('keeps standalone blocks intact when mixed with tabs on the same page', () => {
    const standalone =
      '<pre class="language-bash"><code>npm install @sentry/node</code></pre>';
    const tabs = buildCodeTabsHTML([
      {
        title: 'Node.js',
        filename: 'instrument.mjs',
        lang: 'javascript',
        code: 'Sentry.init();',
      },
      {title: 'Bun', lang: 'javascript', code: 'init();'},
    ]);
    const html = `<div>${standalone}${tabs}</div>`;

    const md = htmlToMarkdown(html);

    const codeBlocks = md.match(/```[\s\S]*?```/g);
    expect(codeBlocks).toHaveLength(3);
    expect(codeBlocks[0]).toContain('npm install');
    expect(md).toContain('**instrument.mjs**');
    expect(md).toContain('**Bun**');
  });

  it('handles two separate tab groups on the same page', () => {
    const group1 = buildCodeTabsHTML([
      {title: 'ESM', filename: 'instrument.mjs', lang: 'javascript', code: 'import init'},
      {title: 'CJS', filename: 'instrument.js', lang: 'javascript', code: 'require init'},
    ]);
    const group2 = buildCodeTabsHTML([
      {title: 'Python', filename: 'main.py', lang: 'python', code: 'import sentry_sdk'},
      {title: 'Ruby', filename: 'config.rb', lang: 'ruby', code: 'require "sentry-ruby"'},
    ]);
    const html = `<div>${group1}${group2}</div>`;

    const md = htmlToMarkdown(html);

    const codeBlocks = md.match(/```[\s\S]*?```/g);
    expect(codeBlocks).toHaveLength(4);
    expect(md).toContain('**instrument.mjs**');
    expect(md).toContain('**instrument.js**');
    expect(md).toContain('**main.py**');
    expect(md).toContain('**config.rb**');
  });

  it('handles tab panel with no pre element gracefully', () => {
    const html =
      '<div>' +
      '<div data-code-tab-title="broken"><p>Not a code block</p></div>' +
      '<div data-code-tab-title="ok" hidden>' +
      '<pre class="language-javascript"><code>works();</code></pre>' +
      '</div>' +
      '</div>';

    const md = htmlToMarkdown(html);

    expect(md).toContain('**ok**');
    expect(md).toContain('works()');
    expect(md).not.toContain('**broken**');
  });
});
