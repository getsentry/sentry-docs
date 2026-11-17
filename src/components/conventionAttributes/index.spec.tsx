import {ATTRIBUTE_METADATA} from '@sentry/conventions/attributes';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it, vi} from 'vitest';

import {ConventionAttributes} from './index';

// Vitest compiles JSX with the classic runtime here (tsconfig `jsx: preserve`).
vi.stubGlobal('React', React);

describe('ConventionAttributes', () => {
  it('renders attributes from the conventions package', () => {
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

  it('throws on unknown attributes so the build fails', () => {
    expect(() =>
      renderToStaticMarkup(<ConventionAttributes attributes={['gen_ai.not.a.thing']} />)
    ).toThrow('unknown attribute "gen_ai.not.a.thing"');
  });

  it('throws on keys inherited from Object.prototype', () => {
    expect(() =>
      renderToStaticMarkup(<ConventionAttributes attributes={['constructor']} />)
    ).toThrow('unknown attribute "constructor"');
  });

  it('single-quotes stringified JSON examples', () => {
    const html = renderToStaticMarkup(
      <ConventionAttributes
        attributes={['gen_ai.tool.call.arguments', 'gen_ai.tool.name']}
      />
    );

    expect(html).toContain(
      `<code>&#x27;${ATTRIBUTE_METADATA['gen_ai.tool.call.arguments'].example}&#x27;</code>`.replaceAll(
        '"',
        '&quot;'
      )
    );
    expect(html).toContain(
      `<code>&quot;${ATTRIBUTE_METADATA['gen_ai.tool.name'].example}&quot;</code>`
    );
  });

  it('renders the example at the given index', () => {
    const html = renderToStaticMarkup(
      <ConventionAttributes attributes={[{key: 'gen_ai.input.messages', example: 1}]} />
    );
    const examples = ATTRIBUTE_METADATA['gen_ai.input.messages'].examples!;

    expect(html).toContain(`&#x27;${examples[1]}&#x27;`.replaceAll('"', '&quot;'));
    expect(html).not.toContain(`&#x27;${examples[0]}&#x27;`.replaceAll('"', '&quot;'));
  });

  it('throws on an example index that does not exist', () => {
    expect(() =>
      renderToStaticMarkup(
        <ConventionAttributes attributes={[{key: 'gen_ai.tool.name', example: 99}]} />
      )
    ).toThrow('attribute "gen_ai.tool.name" has no example at index 99');
  });
});
