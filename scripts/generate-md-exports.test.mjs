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
        nodeHandlers: {
          comment() {},
        },
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

function buildCodeTabsHTML(tabs, {expand = false} = {}) {
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
      const filenameAttr = t.filename ? ` data-code-tab-filename="${t.filename}"` : '';
      return (
        `<div hidden data-code-tab-title="${t.title}"${filenameAttr}>` +
        `<pre class="language-${t.lang}"><code>${t.code}</code></pre>` +
        '</div>'
      );
    })
    .join('');

  const expandAttr = expand ? ' data-code-tab-md-expand-tabs' : '';
  return `<div class="code-tabs-wrapper"${expandAttr}>${codeTabsRendered}${exportBlocks}</div>`;
}

describe('rehypeExpandCodeTabs', () => {
  describe('default (collapsed)', () => {
    it('outputs only the first tab code block', () => {
      const html = buildCodeTabsHTML([
        {title: 'npm', lang: 'bash', code: 'npm install @sentry/node'},
        {title: 'yarn', lang: 'bash', code: 'yarn add @sentry/node'},
        {title: 'pnpm', lang: 'bash', code: 'pnpm add @sentry/node'},
      ]);

      const md = htmlToMarkdown(html);

      const codeBlocks = md.match(/```[\s\S]*?```/g);
      expect(codeBlocks).toHaveLength(1);
      expect(codeBlocks[0]).toContain('npm install @sentry/node');
    });

    it('appends note listing other tab titles', () => {
      const html = buildCodeTabsHTML([
        {title: 'npm', lang: 'bash', code: 'npm install @sentry/node'},
        {title: 'yarn', lang: 'bash', code: 'yarn add @sentry/node'},
        {title: 'pnpm', lang: 'bash', code: 'pnpm add @sentry/node'},
      ]);

      const md = htmlToMarkdown(html);

      expect(md).toContain(
        '*Other available variations of the above snippet: yarn, pnpm*'
      );
    });

    it('omits the note for a single-tab group', () => {
      const html = buildCodeTabsHTML([
        {title: 'typescript', lang: 'typescript', code: 'Sentry.init();'},
      ]);

      const md = htmlToMarkdown(html);

      const codeBlocks = md.match(/```[\s\S]*?```/g);
      expect(codeBlocks).toHaveLength(1);
      expect(md).not.toContain('Other available variations of the above snippet');
    });

    it('removes the CodeTabs-rendered active tab to avoid duplication', () => {
      const html = buildCodeTabsHTML([
        {
          title: 'ESM',
          filename: 'instrument.mjs',
          lang: 'javascript',
          code: 'import init',
        },
        {
          title: 'CJS',
          filename: 'instrument.js',
          lang: 'javascript',
          code: 'require init',
        },
      ]);

      const md = htmlToMarkdown(html);

      expect(md).not.toContain('`instrument.mjs`');
    });

    it('does not add bold headings to the code block', () => {
      const html = buildCodeTabsHTML([
        {
          title: 'ESM',
          filename: 'instrument.mjs',
          lang: 'javascript',
          code: 'import init',
        },
        {
          title: 'CJS',
          filename: 'instrument.js',
          lang: 'javascript',
          code: 'require init',
        },
      ]);

      const md = htmlToMarkdown(html);

      expect(md).not.toMatch(/\*\*.*\*\*/);
    });
  });

  describe('opt-in expanded ({mdExpandTabs})', () => {
    it('outputs one fenced code block per tab with "[Title] filename" headings', () => {
      const html = buildCodeTabsHTML(
        [
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
        ],
        {expand: true}
      );

      const md = htmlToMarkdown(html);

      const codeBlocks = md.match(/```[\s\S]*?```/g);
      expect(codeBlocks).toHaveLength(3);
      expect(codeBlocks[0]).toContain('@sentry/hono/cloudflare');
      expect(codeBlocks[1]).toContain('@sentry/hono/node');
      expect(codeBlocks[2]).toContain('@sentry/hono/bun');
      expect(md).toContain('**\\[Cloudflare Workers] index.ts**');
      expect(md).toContain('**\\[Node.js] app.ts**');
      expect(md).toContain('**\\[Bun] index.ts**');
    });

    it('uses tab title alone when filename is absent', () => {
      const html = buildCodeTabsHTML(
        [
          {title: 'Cloudflare Workers', lang: 'javascript', code: 'workers();'},
          {title: 'Bun', lang: 'javascript', code: 'bun();'},
        ],
        {expand: true}
      );

      const md = htmlToMarkdown(html);

      const headings = md.match(/\*\*.*?\*\*/g);
      expect(headings).toHaveLength(2);
      expect(headings[0]).toBe('**Cloudflare Workers**');
      expect(headings[1]).toBe('**Bun**');
    });

    it('treats empty filename attribute the same as missing filename', () => {
      const html =
        '<div class="code-tabs-wrapper" data-code-tab-md-expand-tabs>' +
        '<div><button>Tab</button><div class="code-block"><code class="filename"></code>' +
        '<pre class="language-js"><code>active()</code></pre></div></div>' +
        '<div hidden data-code-tab-title="JavaScript" data-code-tab-filename="">' +
        '<pre class="language-js"><code>hello();</code></pre></div>' +
        '</div>';

      const md = htmlToMarkdown(html);

      const headings = md.match(/\*\*.*?\*\*/g);
      expect(headings).toHaveLength(1);
      expect(headings[0]).toBe('**JavaScript**');
    });

    it('drops export blocks that contain no pre element', () => {
      const html =
        '<div class="code-tabs-wrapper" data-code-tab-md-expand-tabs>' +
        '<div><pre class="language-js"><code>active tab</code></pre></div>' +
        '<div hidden data-code-tab-title="broken"><p>Not a code block</p></div>' +
        '<div hidden data-code-tab-title="ok"><pre class="language-js"><code>works();</code></pre></div>' +
        '</div>';

      const md = htmlToMarkdown(html);

      const codeBlocks = md.match(/```[\s\S]*?```/g);
      expect(codeBlocks).toHaveLength(1);
      expect(codeBlocks[0]).toContain('works()');
      expect(md).toContain('**ok**');
      expect(md).not.toContain('broken');
      expect(md).not.toContain('active tab');
    });
  });

  describe('mixed page', () => {
    it('collapses and expands groups independently on the same page', () => {
      const collapsed = buildCodeTabsHTML([
        {title: 'npm', lang: 'bash', code: 'npm install @sentry/node'},
        {title: 'yarn', lang: 'bash', code: 'yarn add @sentry/node'},
      ]);
      const expanded = buildCodeTabsHTML(
        [
          {
            title: 'Cloudflare Workers',
            filename: 'index.ts',
            lang: 'typescript',
            code: 'cf()',
          },
          {title: 'Node.js', filename: 'app.ts', lang: 'typescript', code: 'node()'},
        ],
        {expand: true}
      );

      const md = htmlToMarkdown(`<div>${collapsed}${expanded}</div>`);

      const codeBlocks = md.match(/```[\s\S]*?```/g);
      expect(codeBlocks).toHaveLength(3);
      expect(codeBlocks[0]).toContain('npm install');
      expect(codeBlocks[1]).toContain('cf()');
      expect(codeBlocks[2]).toContain('node()');
      expect(md).toContain('*Other available variations of the above snippet: yarn*');
      expect(md).toContain('**\\[Cloudflare Workers] index.ts**');
      expect(md).toContain('**\\[Node.js] app.ts**');
    });

    it('preserves standalone code blocks alongside tab groups', () => {
      const standalone =
        '<pre class="language-bash"><code>npm install @sentry/node</code></pre>';
      const tabs = buildCodeTabsHTML([
        {title: 'ESM', lang: 'javascript', code: 'import init'},
        {title: 'CJS', lang: 'javascript', code: 'require init'},
      ]);

      const md = htmlToMarkdown(`<div>${standalone}${tabs}</div>`);

      const codeBlocks = md.match(/```[\s\S]*?```/g);
      expect(codeBlocks).toHaveLength(2);
      expect(codeBlocks[0]).toContain('npm install');
      expect(codeBlocks[1]).toContain('import init');
      expect(md).toContain('*Other available variations of the above snippet: CJS*');
    });
  });

  describe('edge cases', () => {
    it('does not modify code blocks outside tab wrappers', () => {
      const html =
        '<div><pre class="language-bash"><code>curl -sL https://sentry.io/get-cli/ | bash</code></pre></div>';

      const md = htmlToMarkdown(html);

      const codeBlocks = md.match(/```[\s\S]*?```/g);
      expect(codeBlocks).toHaveLength(1);
      expect(codeBlocks[0]).toContain('curl -sL');
      expect(md).not.toMatch(/\*\*.*\*\*\n/);
    });

    it('leaves wrapper unchanged when it has no export blocks', () => {
      const html =
        '<div class="code-tabs-wrapper">' +
        '<div><button>Only Tab</button>' +
        '<div class="code-block"><pre class="language-js"><code>solo();</code></pre></div>' +
        '</div>' +
        '</div>';

      const md = htmlToMarkdown(html);

      const codeBlocks = md.match(/```[\s\S]*?```/g);
      expect(codeBlocks).toHaveLength(1);
      expect(codeBlocks[0]).toContain('solo()');
    });
  });
});

describe('comment stripping', () => {
  it('drops React text-node separator comments emitted on component-rendered pages', () => {
    const html =
      '<p><code>organization_id_or_slug</code><em> (<!-- -->string<!-- -->)</em></p>';

    const md = htmlToMarkdown(html);

    expect(md).not.toContain('<!--');
    expect(md).toContain('string');
  });

  it('drops standalone HTML comments', () => {
    const md = htmlToMarkdown('<p>before<!-- a real comment -->after</p>');

    expect(md).not.toContain('<!--');
    expect(md).toContain('before');
    expect(md).toContain('after');
  });
});
