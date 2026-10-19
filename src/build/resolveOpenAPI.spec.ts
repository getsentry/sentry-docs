import {describe, expect, test} from 'vitest';

import {toDocumentedParameter} from './resolveOpenAPI';

const EXPERIMENTAL_NOTICE =
  '**Experimental:** This parameter is under active development and may change.\n\n';

describe('toDocumentedParameter', () => {
  test('marks a parameter experimental and keeps the notice in the description', () => {
    const description = `${EXPERIMENTAL_NOTICE}Optional fields to expand. Pass \`context\` to include attribute metadata.`;
    const parameter = toDocumentedParameter({
      name: 'expand',
      description,
      required: false,
      'x-sentry-experimental': true,
    });

    expect(parameter.experimental).toBe(true);
    expect(parameter.description).toBe(description);
  });

  test('keeps the description when the extension is set without a notice', () => {
    const parameter = toDocumentedParameter({
      name: 'expand',
      description: 'Optional fields to expand.',
      required: false,
      'x-sentry-experimental': true,
    });

    expect(parameter.experimental).toBe(true);
    expect(parameter.description).toBe('Optional fields to expand.');
  });

  test('leaves stable parameters unchanged', () => {
    const parameter = toDocumentedParameter({
      name: 'project',
      description: '**Experimental:** not really, this is just text.',
      required: true,
    });

    expect(parameter.experimental).toBe(false);
    expect(parameter.description).toBe(
      '**Experimental:** not really, this is just text.'
    );
  });
});
