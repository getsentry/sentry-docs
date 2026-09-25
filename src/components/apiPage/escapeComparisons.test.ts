import {compile} from '@mdx-js/mdx';
import {describe, expect, it} from 'vitest';

import {escapeComparisons} from './escapeComparisons';

describe('escapeComparisons', () => {
  it('makes numeric comparisons in OpenAPI prose valid MDX', async () => {
    const source =
      'Conditions are combined with AND: an event must match every condition to be filtered out. ' +
      'There is no OR between conditions, so e.g. two release conditions can express a range (>2 AND <4). ' +
      "To broaden matching, widen a condition's values or add separate filters.";
    await expect(compile(source)).rejects.toThrow('Unexpected character `4`');
    const escaped = escapeComparisons(source);
    expect(escaped).toBe(source.replace('<4', '&lt;4'));
    await expect(compile(escaped)).resolves.toBeDefined();
  });

  it('escapes multiple text nodes without shifting their offsets', () => {
    expect(escapeComparisons('Use **<4** and [<10](/example/).')).toBe(
      'Use **&lt;4** and [&lt;10](/example/).'
    );
  });

  it.each([
    '`<4`',
    '```js\nx <4\n```',
    '    x <4\n',
    '<span title="<4">Example</span>',
    '[Example](/example/ "<4")',
    String.raw`Already escaped: \<4 and &lt;4`,
  ])('preserves code, HTML, links, and existing escapes: %s', source => {
    expect(escapeComparisons(source)).toBe(source);
  });

  it('escapes comparisons after an escaped backslash', async () => {
    const escaped = escapeComparisons(String.raw`Value \\<4`);
    expect(escaped).toBe(String.raw`Value \\&lt;4`);
    await expect(compile(escaped)).resolves.toBeDefined();
  });
});
