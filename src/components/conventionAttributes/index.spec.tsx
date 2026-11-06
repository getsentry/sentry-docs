import {ATTRIBUTE_METADATA} from '@sentry/conventions/attributes';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';

import {ConventionAttributes} from './index';

// Vitest compiles JSX with the classic runtime here (tsconfig `jsx: preserve`).
vi.stubGlobal('React', React);

describe('ConventionAttributes', () => {
  it('renders attributes from the conventions package with a category link', () => {
    const html = renderToStaticMarkup(
      <ConventionAttributes attributes={['gen_ai.tool.name']} />
    );

    expect(html).toContain('<code>gen_ai.tool.name</code>');
    expect(html).toContain(ATTRIBUTE_METADATA['gen_ai.tool.name'].type);
    expect(html).toContain(ATTRIBUTE_METADATA['gen_ai.tool.name'].brief);
    expect(html).toContain(
      'href="https://getsentry.github.io/sentry-conventions/attributes/gen_ai/"'
    );
  });

  it('renders additional context as numbered notes, shared notes once', () => {
    const keys = ['gen_ai.usage.input_tokens', 'gen_ai.usage.output_tokens'];
    const html = renderToStaticMarkup(<ConventionAttributes attributes={keys} />);
    const notes = [
      ...new Set(keys.flatMap(key => ATTRIBUTE_METADATA[key].additionalContext ?? [])),
    ];

    expect(notes.length).toBeGreaterThan(0);
    expect(html.match(/<li /g)).toHaveLength(notes.length);
    expect(html).toContain('href="#gen_ai-usage-input_tokens-note-1"');
    expect(html).toContain('id="gen_ai-usage-input_tokens-note-1"');
  });

  it('renders no notes list when attributes have no additional context', () => {
    const html = renderToStaticMarkup(
      <ConventionAttributes attributes={['gen_ai.tool.name']} />
    );

    expect(html).not.toContain('<ol>');
  });

  it('throws on unknown attributes so the build fails', () => {
    expect(() =>
      renderToStaticMarkup(<ConventionAttributes attributes={['gen_ai.not.a.thing']} />)
    ).toThrow('unknown attribute "gen_ai.not.a.thing"');
  });
});
