#!/usr/bin/env node

import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import {
  extractDocsLinks,
  uniqueLinksByPath,
  validateLinks,
} from './lib/doc-link-contract.mjs';

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (!argument.startsWith('--')) continue;
    const [key, inlineValue] = argument.slice(2).split('=', 2);
    args[key] = inlineValue ?? argv[++index];
  }
  return args;
}

function checkoutWorktree(repoRoot, ref, prefix) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  execFileSync('git', ['-C', repoRoot, 'worktree', 'add', '--detach', tempRoot, ref], {
    stdio: 'ignore',
  });
  return {
    path: tempRoot,
    cleanup() {
      execFileSync('git', ['-C', repoRoot, 'worktree', 'remove', '--force', tempRoot], {
        stdio: 'ignore',
      });
    },
  };
}

function missingByPath(results) {
  return new Map(
    results
      .filter(result => result.resolution.status !== 'valid')
      .filter(result => result.resolution.status !== 'external')
      .map(result => [result.pathname, result])
  );
}

function routeTopologyChanged(docsRoot, baseRef) {
  const output = execFileSync(
    'git',
    ['-C', docsRoot, 'diff', '--name-status', '--find-renames', baseRef, 'HEAD'],
    {encoding: 'utf8'}
  );

  return output.split('\n').some(line => {
    if (!line) return false;
    const [status, ...files] = line.split('\t');
    if (
      files.some(
        file =>
          file === 'redirects.js' ||
          file === 'middleware.ts' ||
          file === 'scripts/data/static-sites-www-astro-docs-paths.json'
      )
    ) {
      return true;
    }
    if (
      files.some(file =>
        /^docs\/platforms\/[^/]+\/(?:guides\/[^/]+\/)?config\.yml$/.test(file)
      )
    ) {
      return true;
    }
    return (
      /^[ADR]/.test(status) && files.some(file => /^docs\/.*\.(?:md|mdx)$/.test(file))
    );
  });
}

function printIssues(title, issues) {
  if (issues.length === 0) return;
  console.log(`\n${title} (${issues.length}):`);
  for (const issue of issues) {
    console.log(`- ${issue.raw}`);
    if (issue.file) {
      console.log(`  ${issue.file}:${issue.line || 1}`);
    }
    console.log(`  ${issue.resolution.chain.join(' -> ')} [${issue.resolution.status}]`);
  }
}

function loadLinksFromFile(linksFile) {
  const payload = JSON.parse(fs.readFileSync(linksFile, 'utf8'));
  const paths = Array.isArray(payload) ? payload : payload.paths;
  if (!Array.isArray(paths)) {
    throw new Error(`links file must be an array or {paths: []}: ${linksFile}`);
  }

  const relative = path.basename(linksFile);
  return paths.map(pathname => ({
    file: relative,
    line: 1,
    pathname,
    raw: `https://docs.sentry.io${pathname}`,
  }));
}

function writeLinksFile(linksFile, consumerRoot, links) {
  const payload = {
    source: consumerRoot,
    generated_at: new Date().toISOString(),
    generated_note:
      'Regenerate from a static-sites checkout: node scripts/check-doc-link-contract.mjs --consumer-root <static-sites>/packages/www-astro --write-links-file scripts/data/static-sites-www-astro-docs-paths.json',
    paths: [...uniqueLinksByPath(links).keys()].sort(),
  };
  fs.mkdirSync(path.dirname(linksFile), {recursive: true});
  fs.writeFileSync(linksFile, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${payload.paths.length} paths to ${linksFile}`);
}

const args = parseArgs(process.argv.slice(2));
const docsRoot = path.resolve(args['docs-root'] || process.cwd());
const linksFile = args['links-file'] ? path.resolve(args['links-file']) : null;
const writeLinksFilePath = args['write-links-file']
  ? path.resolve(args['write-links-file'])
  : null;
const consumerRoot = args['consumer-root'] ? path.resolve(args['consumer-root']) : null;
const baselineRef = args['baseline-ref'];
const consumerBaselineRef = args['consumer-baseline-ref'];
const consumerRepoRoot = path.resolve(
  args['consumer-repo-root'] || consumerRoot || process.cwd()
);

if (writeLinksFilePath) {
  if (!consumerRoot || !fs.existsSync(consumerRoot)) {
    console.error(`--write-links-file requires an existing --consumer-root`);
    process.exit(2);
  }
  writeLinksFile(writeLinksFilePath, consumerRoot, extractDocsLinks(consumerRoot));
  process.exit(0);
}

if (!fs.existsSync(path.join(docsRoot, 'redirects.js'))) {
  console.error(`docs root does not look like sentry-docs: ${docsRoot}`);
  process.exit(2);
}

if (
  args['only-if-route-changed'] &&
  baselineRef &&
  !routeTopologyChanged(docsRoot, baselineRef)
) {
  console.log('No docs route-topology changes detected; skipping cross-repo link check.');
  process.exit(0);
}

let links;
if (linksFile) {
  if (!fs.existsSync(linksFile)) {
    console.error(`links file does not exist: ${linksFile}`);
    process.exit(2);
  }
  links = loadLinksFromFile(linksFile);
} else {
  if (!consumerRoot || !fs.existsSync(consumerRoot)) {
    console.error(`consumer root does not exist: ${consumerRoot}`);
    process.exit(2);
  }
  links = [...uniqueLinksByPath(extractDocsLinks(consumerRoot)).values()];
}

const candidateResults = validateLinks(docsRoot, links);
const candidateMissing = missingByPath(candidateResults);
let regressions = [...candidateMissing.values()];
let existing = [];

if (baselineRef) {
  const baseline = checkoutWorktree(docsRoot, baselineRef, 'sentry-docs-baseline-');
  try {
    const baselineMissing = missingByPath(validateLinks(baseline.path, links));
    regressions = [...candidateMissing.values()].filter(
      issue => !baselineMissing.has(issue.pathname)
    );
    existing = [...candidateMissing.values()].filter(issue =>
      baselineMissing.has(issue.pathname)
    );
  } finally {
    baseline.cleanup();
  }
} else if (consumerBaselineRef) {
  if (!consumerRoot) {
    console.error(`--consumer-baseline-ref requires --consumer-root`);
    process.exit(2);
  }
  const baseline = checkoutWorktree(
    consumerRepoRoot,
    consumerBaselineRef,
    'docs-consumer-baseline-'
  );
  try {
    const relativeConsumerRoot = path.relative(consumerRepoRoot, consumerRoot);
    const baselineConsumerRoot = path.join(baseline.path, relativeConsumerRoot);
    const baselinePaths = uniqueLinksByPath(extractDocsLinks(baselineConsumerRoot));
    regressions = [...candidateMissing.values()].filter(
      issue => !baselinePaths.has(issue.pathname)
    );
    existing = [...candidateMissing.values()].filter(issue =>
      baselinePaths.has(issue.pathname)
    );
  } finally {
    baseline.cleanup();
  }
}

console.log(`Validated ${links.length} unique docs.sentry.io paths.`);
printIssues('Newly broken links', regressions);
if (existing.length) {
  console.log(`\nExisting unresolved paths (not blocking): ${existing.length}`);
}

if (regressions.length) process.exit(1);
console.log('\nNo newly broken docs links.');
