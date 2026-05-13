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
 * Builds HTML matching what the remark-code-tabs plugin + CodeTabs component
 * produce in the static build output:
 *
 * <div class="code-tabs-wrapper">
 *   <!-- CodeTabs renders the first (active) tab only -->
 *   <div>
 *     <button>tab1</button><button>tab2</button>
 *     <div class="code-block">
 *       <code class="filename">file1</code>
 *       <pre class="language-x"><code>code1</code></pre>
 *     </div>
 *   </div>
 *   <!-- Hidden export blocks from remark-code-tabs (always present) -->
 *   <div hidden data-code-tab-title="tab1" data-code-tab-filename="file1">
 *     <pre class="language-x"><code>code1</code></pre>
 *   </div>
 *   <div hidden data-code-tab-title="tab2" data-code-tab-filename="file2">
 *     <pre class="language-y"><code>code2</code></pre>
 *   </div>
 * </div>
 */
function buildCodeTabsHTML(tabs) {
  const firstTab = tabs[0];

  const codeTabsRendered =
    '<div>' +
    tabs.map((t, i) => `<button data-active="${i === 0}">${t.title}</button>`).join('') +
    '<div class="code-block">' +
    `<code class="filename">${firstTab.filename || ''}</code>` +
    `<pre class="language-${firstTab.lang}"><code>${firstTab.code}</code></pre>` +
    '</div>' +
    '</div>';

  const exportBlocks = tabs
    .map(t => {
      const filenameAttr = t.filename
        ? ` data-code-tab-filename="${t.filename}"`
        : '';
      return (
        `<div hidden data-code-tab-title="${t.title}"${filenameAttr}>` +
        `<pre class="language-${t.lang}"><code>${t.code}</code></pre>` +
        '</div>'
      );
    })
    .join('');

  return `<div class="code-tabs-wrapper">${codeTabsRendered}${exportBlocks}</div>`;
}

describe('rehypeExpandCodeTabs', () => {
  it('replaces wrapper content with all tabs, not just the active one', () => {
    const html = buildCodeTabsHTML([
      {
        title: 'Cloudflare Workers',
        filename: 'index.ts',
        lang: 'typescript',
        code: 'import { sentry } from "@sentry/hono/cloudflare";',
      },
      {
        title: 'Node.js',
        filename: 'app.ts',
        lang: 'typescript',
        code: 'import { sentry } from "@sentry/hono/node";',
      },
      {
        title: 'Bun',
        filename: 'index.ts',
        lang: 'typescript',
        code: 'import { sentry } from "@sentry/hono/bun";',
      },
    ]);

    const md = htmlToMarkdown(html);
    const codeBlocks = md.match(/```[\s\S]*?```/g);

    expect(codeBlocks).toHaveLength(3);
    expect(md).toContain('**index.ts**');
    expect(md).toContain('**app.ts**');
    expect(codeBlocks[0]).toContain('@sentry/hono/cloudflare');
    expect(codeBlocks[1]).toContain('@sentry/hono/node');
    expect(codeBlocks[2]).toContain('@sentry/hono/bun');
  });

  it('removes CodeTabs-rendered content (tab buttons, filename display, active tab)', () => {
    const html = buildCodeTabsHTML([
      {title: 'ESM', filename: 'instrument.mjs', lang: 'javascript', code: 'import init'},
      {title: 'CJS', filename: 'instrument.js', lang: 'javascript', code: 'require init'},
    ]);

    const md = htmlToMarkdown(html);

    expect(md).not.toContain('`instrument.mjs`');
    expect(md).not.toContain('ESM');
    expect(md).not.toContain('CJS');
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
      {title: 'Bun', lang: 'javascript', code: 'bun();'},
    ]);

    const md = htmlToMarkdown(html);

    expect(md).toContain('**Cloudflare Workers**');
    expect(md).toContain('**Bun**');
  });

  it('does not affect code blocks outside of tab wrappers', () => {
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
      {title: 'Node.js', filename: 'instrument.mjs', lang: 'javascript', code: 'Sentry.init();'},
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

  it('skips export block with no pre element', () => {
    const html =
      '<div class="code-tabs-wrapper">' +
      '<div><pre class="language-js"><code>active tab</code></pre></div>' +
      '<div hidden data-code-tab-title="broken"><p>Not a code block</p></div>' +
      '<div hidden data-code-tab-title="ok"><pre class="language-js"><code>works();</code></pre></div>' +
      '</div>';

    const md = htmlToMarkdown(html);

    expect(md).toContain('**ok**');
    expect(md).toContain('works()');
    expect(md).not.toContain('**broken**');
    expect(md).not.toContain('active tab');
  });
});
