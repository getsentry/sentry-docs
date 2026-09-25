import {bundleMDX} from 'mdx-bundler';
import {expect, test} from 'vitest';

import {escapeApiMarkdownComparisons} from './markdown';

test('compiles API descriptions with numeric comparisons without changing HTML tags', async () => {
  const description =
    'Two release conditions can express a range (>2 AND <4). See <a href="/api/">API docs</a>.';
  const markdown = escapeApiMarkdownComparisons(description);

  expect(markdown).toBe(
    'Two release conditions can express a range (>2 AND &lt;4). See <a href="/api/">API docs</a>.'
  );
  await expect(bundleMDX({source: markdown, cwd: process.cwd()})).resolves.toHaveProperty(
    'code'
  );
});
