/**
 * Checks that the agent skills documented in docs/ai/agent-skills.mdx
 * are in sync with the skills in the getsentry/sentry-for-ai repository.
 *
 * Usage: node scripts/check-agent-skills-sync.mjs
 *
 * Requires: `gh` CLI authenticated, or GITHUB_TOKEN env var.
 * Exit code: always 0 (warn-only, does not fail the build).
 */

import {execSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = 'getsentry/sentry-for-ai';
const DOCS_PATH = resolve(__dirname, '../docs/ai/agent-skills.mdx');

async function getRepoSkills() {
  try {
    const output = execSync(
      `gh api repos/${REPO}/contents/skills --jq '.[].name'`,
      {encoding: 'utf-8', timeout: 15000}
    );
    return output
      .trim()
      .split('\n')
      .filter(name => name && !name.startsWith('.'));
  } catch (err) {
    console.error('Failed to fetch skills from GitHub. Is `gh` CLI installed and authenticated?');
    console.error(err.message);
    process.exit(2);
  }
}

function getDocSkills() {
  const content = readFileSync(DOCS_PATH, 'utf-8');
  const skills = new Set();

  // Match backtick-wrapped skill names in table rows (e.g. `sentry-react-sdk`)
  const tableRowRegex = /\|\s*`([^`]+)`\s*\|/g;
  let match;
  while ((match = tableRowRegex.exec(content)) !== null) {
    skills.add(match[1]);
  }

  return [...skills];
}

async function main() {
  console.log(`Checking agent skills sync between docs and ${REPO}...\n`);

  const repoSkills = await getRepoSkills();
  const docSkills = getDocSkills();

  const repoSet = new Set(repoSkills);
  const docSet = new Set(docSkills);

  const missingFromDocs = repoSkills.filter(s => !docSet.has(s));
  const missingFromRepo = docSkills.filter(s => !repoSet.has(s));

  let drifted = false;

  if (missingFromDocs.length > 0) {
    console.log('Skills in repo but MISSING from docs:');
    missingFromDocs.forEach(s => console.log(`  - ${s}`));
    console.log();
    drifted = true;
  }

  if (missingFromRepo.length > 0) {
    console.log('Skills in docs but NOT in repo:');
    missingFromRepo.forEach(s => console.log(`  - ${s}`));
    console.log();
    drifted = true;
  }

  if (!drifted) {
    console.log(`All ${repoSkills.length} repo skills are documented. No drift detected.`);
  } else {
    console.warn('⚠ Drift detected — please update docs/ai/agent-skills.mdx to match the repo.');
  }
}

main();
