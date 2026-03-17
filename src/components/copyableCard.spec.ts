// @vitest-environment jsdom
import {describe, expect, it} from 'vitest';

import {domToMarkdown} from './copyableCard';

function parse(html: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

describe('domToMarkdown', () => {
  describe('headings', () => {
    it.each([
      ['h1', '# text\n\n'],
      ['h2', '## text\n\n'],
      ['h3', '### text\n\n'],
      ['h4', '#### text\n\n'],
      ['h5', '##### text\n\n'],
      ['h6', '###### text\n\n'],
    ])('converts %s', (tag, expected) => {
      expect(domToMarkdown(parse(`<${tag}>text</${tag}>`))).toBe(expected);
    });
  });

  describe('inline formatting', () => {
    it.each([
      ['<strong>bold</strong>', '**bold**'],
      ['<b>bold</b>', '**bold**'],
      ['<em>italic</em>', '*italic*'],
      ['<i>italic</i>', '*italic*'],
      ['<code>foo()</code>', '`foo()`'],
    ])('converts %s', (html, expected) => {
      expect(domToMarkdown(parse(html))).toBe(expected);
    });

    it('converts a', () => {
      expect(domToMarkdown(parse('<a href="https://example.com">link</a>'))).toBe(
        '[link](https://example.com)'
      );
    });
  });

  describe('block elements', () => {
    it('converts p', () => {
      expect(domToMarkdown(parse('<p>hello</p>'))).toBe('hello\n\n');
    });
    it('converts ul with li', () => {
      expect(domToMarkdown(parse('<ul><li>a</li><li>b</li></ul>'))).toBe('- a\n- b\n\n');
    });
    it('converts ol with li', () => {
      expect(domToMarkdown(parse('<ol><li>first</li><li>second</li></ol>'))).toBe(
        '1. first\n2. second\n\n'
      );
    });
  });

  describe('checkboxes', () => {
    it('converts unchecked checkbox', () => {
      expect(domToMarkdown(parse('<input type="checkbox" />'))).toBe('[ ] ');
    });
    it('converts checked checkbox', () => {
      const div = parse('<input type="checkbox" />');
      (div.querySelector('input') as HTMLInputElement).checked = true;
      expect(domToMarkdown(div)).toBe('[x] ');
    });
  });

  describe('document structure', () => {
    it('preserves heading prefixes in a full document', () => {
      const result = domToMarkdown(
        parse('<h1>Title</h1><h2>Section</h2><p>Body text.</p>')
      );
      expect(result).toBe('# Title\n\n## Section\n\nBody text.\n\n');
    });
  });
});
