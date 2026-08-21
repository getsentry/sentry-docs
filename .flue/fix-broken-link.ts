import {execFile} from 'node:child_process';
import {lstat, readFile, writeFile} from 'node:fs/promises';
import {isAbsolute, normalize, relative, resolve} from 'node:path';
import {promisify} from 'node:util';

import * as v from 'valibot';

import {
  GitHubIssueContextSchema,
  type ShadowTriageResult,
  TriageDecisionSchema,
} from './triage';

const exec = promisify(execFile);

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

export function safeDocumentationUrl(value: string): string {
  if (/[\r\n]/.test(value))
    throw new Error('Documentation URLs cannot contain newlines.');
  if (value.startsWith('/')) {
    canonicalPath(value);
    return value;
  }
  const url = new URL(value);
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(`Documentation URL contains unsupported components: ${value}`);
  }
  canonicalPath(url.pathname);
  if (!['docs.sentry.io', 'develop.sentry.dev'].includes(url.hostname)) {
    throw new Error(`Automated fixes only support Sentry documentation URLs: ${value}`);
  }
  return `https://${url.hostname}${url.pathname}`;
}

function urlPath(value: string): {host: 'docs' | 'develop'; path: string} {
  const safe = safeDocumentationUrl(value);
  if (safe.startsWith('/')) return {host: 'docs', path: safe};
  const url = new URL(safe);
  if (url.hostname === 'docs.sentry.io') return {host: 'docs', path: url.pathname};
  if (url.hostname === 'develop.sentry.dev') {
    return {host: 'develop', path: url.pathname};
  }
  throw new Error(`Automated fixes only support Sentry documentation URLs: ${value}`);
}

export function canonicalPath(value: string): string {
  if (!/^\/(?!\/)[A-Za-z0-9._~/%-]*$/.test(value)) {
    throw new Error(`Expected an exact root-relative path: ${value}`);
  }
  return value === '/' || value.endsWith('/') ? value : `${value}/`;
}

export function allowedContentPath(path: string): boolean {
  if (isAbsolute(path) || path.includes('\\') || normalize(path) !== path) return false;
  const fromRoot = relative(process.cwd(), resolve(path));
  return (
    !fromRoot.startsWith('..') &&
    /^(?:docs|develop-docs|includes|platform-includes)\/.+\.mdx?$/.test(fromRoot)
  );
}

async function verifyReplacement(value: string): Promise<void> {
  const replacement = urlPath(value);
  const host = replacement.host === 'develop' ? 'develop.sentry.dev' : 'docs.sentry.io';
  const response = await fetch(`https://${host}${replacement.path}`, {
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Replacement URL did not resolve successfully: ${response.url}`);
  }
}

async function verifyBroken(
  value: string,
  replacementValue: string,
  allowExistingRedirect: boolean
): Promise<void> {
  const source = urlPath(value);
  const host = source.host === 'develop' ? 'develop.sentry.dev' : 'docs.sentry.io';
  const sourceUrl = `https://${host}${source.path}`;
  const response = await fetch(sourceUrl, {
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status < 300) {
    throw new Error(`The reported broken URL currently resolves: ${response.url}`);
  }
  if (response.status < 400 && !allowExistingRedirect) {
    const location = response.headers.get('location');
    if (!location)
      throw new Error('Existing redirect did not include a Location header.');
    const existing = urlPath(new URL(location, sourceUrl).toString());
    const expected = urlPath(replacementValue);
    if (
      existing.host === expected.host &&
      canonicalPath(existing.path) === canonicalPath(expected.path)
    ) {
      throw new Error('An exact redirect already resolves to the proposed destination.');
    }
    throw new Error(
      'An existing redirect points elsewhere; changing it requires human review.'
    );
  }
}

async function findContentTargets(brokenUrl: string): Promise<string[]> {
  const result = await exec('git', [
    'grep',
    '-l',
    '--fixed-strings',
    '-e',
    brokenUrl,
    '--',
    'docs',
    'develop-docs',
    'includes',
    'platform-includes',
  ]).catch(error => {
    if ((error as {code?: number}).code === 1) return {stdout: '', stderr: ''};
    throw error;
  });
  const files = result.stdout.trim().split('\n').filter(Boolean);
  if (
    !files.length ||
    files.length > 5 ||
    files.some(path => !allowedContentPath(path))
  ) {
    throw new Error(
      `Expected 1-5 independently discovered content files, found ${files.length}.`
    );
  }
  for (const path of files) {
    if ((await lstat(path)).isSymbolicLink()) {
      throw new Error(`Symlink targets are not allowed: ${path}`);
    }
  }
  return files;
}

async function applyContentEdit(
  brokenUrl: string,
  replacementUrl: string
): Promise<string[]> {
  const files = await findContentTargets(brokenUrl);
  const changed: string[] = [];
  for (const path of files) {
    const content = await readFile(path, 'utf8');
    if (!content.includes(brokenUrl)) continue;
    await writeFile(path, content.replaceAll(brokenUrl, replacementUrl));
    changed.push(path);
  }
  if (!changed.length)
    throw new Error('The exact broken URL was not found in target files.');
  return changed;
}

async function applyRedirect(
  brokenUrl: string,
  replacementUrl: string
): Promise<string[]> {
  const source = urlPath(brokenUrl);
  const destination = urlPath(replacementUrl);
  if (source.host !== destination.host) {
    throw new Error('Automated redirects cannot cross docs hosts.');
  }
  const from = canonicalPath(source.path);
  const to = canonicalPath(destination.path);
  if (from === to) throw new Error('Redirect source and destination are identical.');

  const path = 'middleware.ts';
  const content = await readFile(path, 'utf8');
  if (content.includes(`from: '${from}'`)) {
    throw new Error(`A redirect already exists for ${from}.`);
  }
  const marker =
    source.host === 'develop'
      ? 'const DEVELOPER_DOCS_REDIRECTS: Redirect[] = [\n'
      : 'const USER_DOCS_REDIRECTS: Redirect[] = [\n';
  if (!content.includes(marker))
    throw new Error('Redirect insertion marker was not found.');
  const entry = `  {\n    from: '${from}',\n    to: '${to}',\n  },\n`;
  await writeFile(path, content.replace(marker, `${marker}${entry}`));
  return [path];
}

async function run(command: string, args: string[]): Promise<void> {
  const result = await exec(command, args, {maxBuffer: 10_000_000});
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

async function validate(changedFiles: string[]): Promise<void> {
  const allowed = new Set(changedFiles);
  const diff = await exec('git', ['diff', '--name-only']);
  const actual = diff.stdout.trim().split('\n').filter(Boolean);
  if (!actual.length || actual.some(path => !allowed.has(path))) {
    throw new Error(`Unexpected changed files: ${actual.join(', ')}`);
  }
  await run('pnpm', ['exec', 'prettier', '--write', ...changedFiles]);
  await run('pnpm', ['enforce-redirects']);
  await run('pnpm', ['lint:redirect-chains']);
  await run('pnpm', [
    'test:ci',
    'scripts/check-redirects-on-rename.spec.ts',
    'scripts/lint-redirect-chains.spec.ts',
    'middleware.test.ts',
  ]);
  await run('git', ['diff', '--check']);
}

async function existingPullRequest(branch: string): Promise<string | undefined> {
  const result = await exec('gh', [
    'pr',
    'list',
    '--repo',
    'getsentry/sentry-docs',
    '--state',
    'all',
    '--head',
    branch,
    '--json',
    'url',
    '--jq',
    '.[0].url // empty',
  ]);
  return result.stdout.trim() || undefined;
}

async function remoteBranchExists(branch: string): Promise<boolean> {
  const result = await exec('git', [
    'ls-remote',
    '--heads',
    'origin',
    `refs/heads/${branch}`,
  ]);
  return Boolean(result.stdout.trim());
}

async function createPullRequest(
  branch: string,
  issue: v.InferOutput<typeof GitHubIssueContextSchema>
): Promise<void> {
  const linearReference = issue.linear?.identifier
    ? `\nFixes ${issue.linear.identifier}`
    : '';
  await run('gh', [
    'pr',
    'create',
    '--repo',
    'getsentry/sentry-docs',
    '--head',
    branch,
    '--title',
    `fix(docs): Resolve broken link from #${issue.number}`,
    '--body',
    `Automated, validated broken-link fix.\n\nFixes #${issue.number}${linearReference}\n\nValidation: redirect rules, redirect-chain lint, focused tests, formatting, and git diff checks passed.`,
  ]);
}

async function main(): Promise<void> {
  if (
    process.env.FLUE_TRIAGE_MODE !== 'apply' ||
    process.env.FLUE_TRIAGE_AUTO_FIX_ENABLED !== 'true'
  ) {
    console.log('Automated broken-link fixes are disabled.');
    return;
  }
  const resultPath = argument('--result');
  if (!resultPath) throw new Error('Usage: pnpm triage:fix --result <triage.json>');
  const raw = JSON.parse(await readFile(resultPath, 'utf8')) as ShadowTriageResult;
  const issue = v.parse(GitHubIssueContextSchema, raw.issue);
  const decision = v.parse(TriageDecisionSchema, raw.decision);
  if (
    decision.actionability !== 'actionable' ||
    decision.classification !== 'broken-link' ||
    decision.automationFlow !== 'broken-link-fix' ||
    decision.confidence < 0.9 ||
    !decision.quickFix
  ) {
    console.log('This decision is not eligible for an automated broken-link fix.');
    return;
  }

  const branch = `bot/fix-broken-link-${issue.number}`;
  const existing = await existingPullRequest(branch);
  if (existing) {
    console.log(`Existing automated PR: ${existing}`);
    return;
  }
  if (await remoteBranchExists(branch)) {
    await createPullRequest(branch, issue);
    return;
  }
  const brokenUrl = safeDocumentationUrl(decision.quickFix.brokenUrl);
  const replacementUrl = safeDocumentationUrl(decision.quickFix.replacementUrl);
  await run('git', ['switch', '-c', branch]);
  await verifyBroken(
    brokenUrl,
    replacementUrl,
    decision.quickFix.kind === 'content-edit'
  );
  await verifyReplacement(replacementUrl);
  const changed =
    decision.quickFix.kind === 'content-edit'
      ? await applyContentEdit(brokenUrl, replacementUrl)
      : await applyRedirect(brokenUrl, replacementUrl);
  await validate(changed);
  await run('git', ['add', '--', ...changed]);
  await run('git', [
    '-c',
    'user.name=getsentry-bot',
    '-c',
    'user.email=bot@getsentry.com',
    'commit',
    '-m',
    `fix(docs): Resolve broken link from issue ${issue.number}`,
  ]);
  await run('git', ['push', '--set-upstream', 'origin', branch]);
  await createPullRequest(branch, issue);
}

if (process.argv[1]?.endsWith('fix-broken-link.ts')) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
