/**
 * Pre-commit hook wrapper for lychee external link checker.
 * Runs lychee on provided files and warns on broken links without blocking commits.
 *
 * Usage: bun scripts/lint-external-links.ts [files...]
 */

import {spawnSync} from 'child_process';

// Check if lychee is installed
const versionCheck = spawnSync('lychee', ['--version'], {
  encoding: 'utf-8',
  stdio: 'pipe',
});
if (versionCheck.error || versionCheck.status !== 0) {
  console.log('Warning: lychee not installed. Skipping external link check.');
  console.log(
    'Install with: brew install lychee (macOS) or cargo install lychee (cross-platform)'
  );
  process.exit(0);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  process.exit(0);
}

// Run lychee on the provided files
const result = spawnSync('lychee', ['--no-progress', ...files], {
  stdio: 'inherit',
  encoding: 'utf-8',
});

if (result.status !== 0) {
  console.log('');
  console.log('⚠️  External link issues found (commit not blocked)');
}

// Always exit 0 so commit proceeds
process.exit(0);
