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

  it('appends page-specific notes to the description', () => {
    const html = renderToStaticMarkup(
      <ConventionAttributes
        attributes={[{key: 'gen_ai.usage.input_tokens', notes: '**[2]**'}]}
      />
    );

    expect(html).toContain('<strong>[2]</strong>');
  });

  it('throws on unknown attributes so the build fails', () => {
    expect(() =>
      renderToStaticMarkup(<ConventionAttributes attributes={['gen_ai.not.a.thing']} />)
    ).toThrow('unknown attribute "gen_ai.not.a.thing"');
  });
});
