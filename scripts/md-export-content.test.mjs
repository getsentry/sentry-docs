import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import {describe, expect, it} from 'vitest';
import {unified} from 'unified';

import {selectMarkdownContent} from './md-export-content.mjs';

function htmlToMarkdown(html) {
  return String(
    unified()
      .use(rehypeParse)
      .use(() => selectMarkdownContent)
      .use(() => tree => ({
        type: 'element',
        tagName: 'div',
        properties: {},
        children: tree,
      }))
      .use(rehypeRemark, {
        document: false,
        handlers: {
          title: (_state, node) => ({
            type: 'heading',
            depth: 1,
            children: [{type: 'text', value: node.children[0].value}],
          }),
        },
      })
      .use(remarkStringify)
      .processSync(html)
  );
}

describe('Markdown export headings', () => {
  it('uses the SDK browser heading without badges or the metadata title', () => {
    const markdown = htmlToMarkdown(`
      <html><head><title>Configuration | Sentry for React</title></head><body>
        <hgroup><h1><span data-md-heading="">Session Replay Configuration for React</span><span>BETA</span></h1></hgroup>
        <div id="main"><h2>Sampling</h2><p>Configure replay sampling.</p></div>
      </body></html>
    `);

    expect(markdown).toMatch(/^# Session Replay Configuration for React\n/);
    expect(markdown).toContain('## Sampling');
    expect(markdown).not.toContain('Configuration | Sentry for React');
    expect(markdown).not.toContain('BETA');
    expect(markdown.match(/^# /gm)).toHaveLength(1);
  });

  it('preserves the metadata-based heading on non-SDK pages', () => {
    const markdown = htmlToMarkdown(`
      <html><head><title>Snapshots | Sentry Docs</title></head><body>
        <hgroup><h1>Snapshots</h1></hgroup>
        <div id="main"><p>Snapshot docs.</p></div>
      </body></html>
    `);

    expect(markdown).toMatch(/^# Snapshots \| Sentry Docs\n/);
    expect(markdown.match(/^# /gm)).toHaveLength(1);
  });

  it('keeps version labels in the SDK Markdown H1', () => {
    const markdown = htmlToMarkdown(`
      <html><head><title>Configuration | Sentry for React</title></head><body>
        <hgroup><h1><span data-md-heading="">Session Replay Configuration for React (SDK v7.x)</span></h1></hgroup>
        <div id="main"><p>Versioned replay docs.</p></div>
      </body></html>
    `);

    expect(markdown).toMatch(/^# Session Replay Configuration for React \(SDK v7\.x\)\n/);
    expect(markdown.match(/^# /gm)).toHaveLength(1);
  });
});
