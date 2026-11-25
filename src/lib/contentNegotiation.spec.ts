import {describe, expect, it} from 'vitest';

import {formatPreference, shouldServeMarkdown} from './contentNegotiation';

describe('formatPreference', () => {
  it.each([
    ['text/markdown', 'markdown'],
    ['text/x-markdown', 'markdown'],
    ['text/markdown, text/html, */*', 'markdown'],
    ['text/html, text/markdown', 'markdown'],
    ['text/markdown;q=0.9, text/html', 'html'],
    ['text/html, text/markdown;q=0.9', 'html'],
    ['text/html;q=0.5, text/markdown;q=0.8', 'markdown'],
    ['text/markdown;q=0, */*', 'html'],
    ['TEXT/MARKDOWN', 'markdown'],
    [
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8',
      'html',
    ],
    ['*/*', 'none'],
    ['text/*', 'none'],
    ['application/json, text/plain, */*', 'none'],
    ['', 'none'],
  ])('%j → %s', (accept, expected) => {
    expect(formatPreference(accept)).toBe(expected);
  });
});

describe('shouldServeMarkdown', () => {
  it('serves Markdown to a recognized agent with no format preference', () => {
    expect(shouldServeMarkdown('*/*', true)).toBe(true);
    expect(shouldServeMarkdown('', true)).toBe(true);
  });

  it('serves HTML to a recognized agent that asks for HTML', () => {
    expect(shouldServeMarkdown('text/html,*/*;q=0.8', true)).toBe(false);
  });

  it('serves HTML to other clients with no format preference', () => {
    expect(shouldServeMarkdown('*/*', false)).toBe(false);
  });

  it('serves Markdown to any client that prefers it', () => {
    expect(shouldServeMarkdown('text/markdown, text/html', false)).toBe(true);
  });
});
