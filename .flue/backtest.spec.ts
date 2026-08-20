import {describe, expect, test} from 'vitest';

import {csv} from './run-backtest';

describe('backtest report', () => {
  test('neutralizes spreadsheet formulas in untrusted text', () => {
    expect(csv('=HYPERLINK("https://example.com")')).toBe(
      '"\'=HYPERLINK(""https://example.com"")"'
    );
    expect(csv('@SUM(A1:A2)')).toBe('"\'@SUM(A1:A2)"');
    expect(csv('\t=SUM(A1:A2)')).toBe('"\'\t=SUM(A1:A2)"');
    expect(csv('  +SUM(A1:A2)')).toBe('"\'  +SUM(A1:A2)"');
    expect(csv('ordinary text')).toBe('"ordinary text"');
  });
});
