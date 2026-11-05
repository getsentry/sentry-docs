import {ATTRIBUTE_METADATA} from '@sentry/conventions/attributes';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';

import {ConventionAttributes, conventionsUrl} from './index';

// Vitest compiles JSX with the classic runtime here (tsconfig `jsx: preserve`).
vi.stubGlobal('React', React);

describe('ConventionAttributes', () => {
  it('renders type and description from the conventions package', () => {
    const html = renderToStaticMarkup(
      <ConventionAttributes attributes={['gen_ai.tool.name']} />
    );

    expect(html).toContain('<code>gen_ai.tool.name</code>');
    expect(html).toContain(ATTRIBUTE_METADATA['gen_ai.tool.name'].type);
    expect(html).toContain(ATTRIBUTE_METADATA['gen_ai.tool.name'].brief);
  });

  it('appends page-specific notes to the description', () => {
    const html = renderToStaticMarkup(
      <ConventionAttributes
        attributes={[{key: 'gen_ai.usage.input_tokens', notes: '**[2]**'}]}
      />
    );

    expect(html).toContain('<strong>[2]</strong>');
  });

  it('marks deprecated attributes with their replacement', () => {
    const html = renderToStaticMarkup(<ConventionAttributes attributes={['address']} />);

    expect(html).toContain('<strong>Deprecated</strong>');
    expect(html).toContain('<code>server.address</code>');
  });

  it('throws on unknown attributes so the build fails', () => {
    expect(() =>
      renderToStaticMarkup(<ConventionAttributes attributes={['gen_ai.not.a.thing']} />)
    ).toThrow('unknown attribute "gen_ai.not.a.thing"');
  });
});

describe('conventionsUrl', () => {
  it('links to the category page anchor', () => {
    expect(conventionsUrl('gen_ai.usage.input_tokens')).toBe(
      'https://getsentry.github.io/sentry-conventions/attributes/gen_ai/#gen_ai-usage-input_tokens'
    );
  });

  it('handles keys without a namespace and dynamic suffixes', () => {
    expect(conventionsUrl('environment')).toBe(
      'https://getsentry.github.io/sentry-conventions/attributes/general/#environment'
    );
    expect(conventionsUrl('http.request.header.<key>')).toBe(
      'https://getsentry.github.io/sentry-conventions/attributes/http/#http-request-header-key'
    );
  });
});
