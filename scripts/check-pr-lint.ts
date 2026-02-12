/* eslint-disable no-console */

const VALID_TYPES = [
  'feat',
  'fix',
  'docs',
  'ref',
  'chore',
  'test',
  'style',
  'perf',
  'build',
  'ci',
  'meta',
];

const TITLE_REGEX = new RegExp(`^(${VALID_TYPES.join('|')})(\\(.+\\))?: .{1,70}$`);

// Bot accounts whose PRs should skip lint checks
const BOT_SKIP_PREFIXES = ['dependabot', 'getsantry'];

// Template boilerplate lines to strip before measuring description length
const BOILERPLATE_PATTERNS = [
  /^## DESCRIBE YOUR PR/i,
  /^## IS YOUR CHANGE URGENT/i,
  /^## SLA/i,
  /^## PRE-MERGE CHECKLIST/i,
  /^## LEGAL BOILERPLATE/i,
  /^## EXTRA RESOURCES/i,
  /^\*.*\*/,
  /^- \[ ?\]/,
  /^- \[x\]/i,
  /^<!--/,
  /^Help us prioritize/i,
  /^Teamwork makes the dream work/i,
  /^Please give the docs team/i,
  /^Thanks in advance/i,
  /^Look, I get it/i,
  /^\[Sentry Docs contributor guide\]/i,
  /^Tell us what you're changing/i,
  /^\[Clear description of what the PR does/i,
  /^\[Bullet points of specific changes/i,
  /^- Change \d+/,
  /^Urgent deadline/i,
  /^Other deadline/i,
  /^None: Not urgent/i,
  /^Checked Vercel preview/i,
  /^PR was reviewed/i,
  /^Make sure you've checked/i,
  /^Use this checklist/i,
  /^<!-- ENTER DATE HERE -->/,
  /^the entity doing business/i,
];

function stripBoilerplate(body: string): string {
  return body
    .split('\n')
    .map(line => line.trim())
    .filter(line => {
      if (line === '') return false;
      if (line.startsWith('#')) return false;
      return !BOILERPLATE_PATTERNS.some(pattern => pattern.test(line));
    })
    .join('\n')
    .trim();
}

function validateTitle(title: string): string[] {
  const errors: string[] = [];

  if (!title || title.trim() === '') {
    errors.push('PR title is empty.');
    return errors;
  }

  if (!TITLE_REGEX.test(title.trim())) {
    errors.push(
      `PR title does not follow commit convention: type(scope): subject\n` +
        `  Got: "${title}"\n` +
        `  Valid types: ${VALID_TYPES.join(', ')}\n` +
        `  Example: "docs(javascript): add Hono framework guide"`
    );
  }

  if (title.trim().endsWith('.')) {
    errors.push('PR title should not end with a period.');
  }

  return errors;
}

function validateBody(body: string, title: string): string[] {
  const errors: string[] = [];

  if (!body || body.trim() === '') {
    errors.push(
      'PR description is empty. Explain what changed and why in the "DESCRIBE YOUR PR" section.'
    );
    return errors;
  }

  const meaningful = stripBoilerplate(body);

  if (meaningful.length < 20) {
    errors.push(
      `PR description is too short after stripping template boilerplate (${meaningful.length} chars).\n` +
        `  Add a meaningful explanation of what changed and why in the "DESCRIBE YOUR PR" section.`
    );
  }

  // Check if description just restates the title
  const titleWords = title
    .replace(/^(feat|fix|docs|ref|chore|test|style|perf|build|ci|meta)(\(.+\))?: /i, '')
    .toLowerCase()
    .trim();

  if (titleWords && meaningful.toLowerCase().trim() === titleWords) {
    errors.push(
      'PR description just restates the title. Explain *why* the change was made.'
    );
  }

  return errors;
}

// --- Main ---

const title = process.env.PR_TITLE ?? '';
const body = process.env.PR_BODY ?? '';
const prAuthor = process.env.PR_AUTHOR ?? '';

// Skip lint for bot-authored PRs (dependabot, getsantry, etc.)
// GitHub may format bot logins as "app/getsantry" or "dependabot[bot]"
const normalizedAuthor = prAuthor
  .toLowerCase()
  .replace(/^app\//, '')
  .replace(/\[bot\]$/, '');

if (BOT_SKIP_PREFIXES.some(prefix => normalizedAuthor.startsWith(prefix))) {
  console.log(`PR lint skipped for bot author: ${prAuthor}`);
  process.exit(0);
}

const titleErrors = validateTitle(title);
const bodyErrors = validateBody(body, title);
const allErrors = [...titleErrors, ...bodyErrors];

if (allErrors.length > 0) {
  console.error('PR lint failed:\n');
  allErrors.forEach(err => console.error(`  - ${err}\n`));
  console.error('See commit convention: https://develop.sentry.dev/commit-messages/');
  process.exit(1);
} else {
  console.log('PR lint passed.');
}
