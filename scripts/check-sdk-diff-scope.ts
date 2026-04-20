#!/usr/bin/env bun
import {readFileSync} from 'fs';
/**
 * Enforces the policy that a single PR should only contain non-trivial changes
 * to one SDK at a time. PRs spanning multiple SDKs are harder to review and
 * increase the risk of inconsistencies between platforms.
 *
 * Reads `git diff --numstat` from stdin (one `<added>\t<deleted>\t<path>` line
 * per changed file) and attributes each file to an SDK. If the total lines
 * changed for at least MIN_VIOLATING_SDKS SDKs each exceed LINE_THRESHOLD,
 * the script prints the violating SDK list and exits 1.
 *
 * Used in CI as:
 *   git diff --numstat origin/$BASE...HEAD | bun scripts/check-sdk-diff-scope.ts
 */

/** SDKs with fewer total changed lines than this are ignored (e.g. a one-line typo fix that touches two SDKs should not block the PR). */
const LINE_THRESHOLD = 5;
/** Minimum number of SDKs that must exceed LINE_THRESHOLD for the check to fail. */
const MIN_VIOLATING_SDKS = 2;

/**
 * Extracts the SDK name from a changed file path, or returns null if the
 * file is not attributed to any SDK.
 *
 * Two path patterns are recognised:
 *   - docs/platforms/<sdk>/...          → sdk is the first path segment after platforms/
 *   - platform-includes/.../<sdk>.<variant>.mdx → sdk is the first dot-segment of the filename
 *     e.g. `javascript.angular.mdx` → `javascript`, `react-native.mdx` → `react-native`
 */
function sdkForPath(path: string): string | null {
  const segs = path.split('/');
  if (segs[0] === 'docs' && segs[1] === 'platforms') {
    return segs[2] ?? null;
  }
  if (segs[0] === 'platform-includes') {
    return segs.at(-1)!.split('.')[0];
  }
  return null;
}

// Accumulate total lines changed (added + deleted) per SDK.
const sdkLines = new Map<string, number>();

const input = readFileSync(0, 'utf-8');
for (const line of input.split('\n')) {
  const [added, deleted, path] = line.split('\t');
  if (!path || added === '-') continue; // binary file or empty line
  const sdk = sdkForPath(path.trim());
  if (sdk) {
    sdkLines.set(sdk, (sdkLines.get(sdk) ?? 0) + +added + +deleted);
  }
}

// Collect SDKs that exceed the line threshold, ignoring trivial touches.
const violating = [...sdkLines.entries()]
  .filter(([, n]) => n > LINE_THRESHOLD)
  .map(([sdk]) => sdk)
  .sort();

if (violating.length >= MIN_VIOLATING_SDKS) {
  // Print the list for the CI step to capture and include in the PR comment.
  console.log(violating.map(s => `\`${s}\``).join(', '));
  process.exit(1);
}
