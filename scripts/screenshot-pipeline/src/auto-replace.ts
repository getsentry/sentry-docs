#!/usr/bin/env ts-node

/**
 * Auto-Replacer (Section 2.3 of Tech Spec)
 *
 * For all auto_replace entries in the diff results, copies the new capture
 * over the old image, commits the changes, and opens a PR.
 *
 * Usage:
 *   npx ts-node scripts/screenshot-pipeline/src/auto-replace.ts
 *   npx ts-node scripts/screenshot-pipeline/src/auto-replace.ts --dry-run
 */

import {execSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {Octokit} from '@octokit/rest';
import {DiffResult, loadPipelineConfig} from './lib/types';

// ── Main ──

async function main() {
  const config = loadPipelineConfig();
  const repoRoot = findRepoRoot();
  const dryRun = process.argv.includes('--dry-run') || config.dry_run;

  console.log('=== Screenshot Pipeline: Auto-Replacer ===');
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // Load diff results
  const resultsPath = path.join(repoRoot, config.output_dir, 'diff-results.json');
  if (!fs.existsSync(resultsPath)) {
    console.error(`Error: Diff results not found at ${resultsPath}`);
    console.error('Run the capture + diff step first: npm run capture');
    process.exit(1);
  }

  const results: DiffResult[] = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

  // Filter to auto-replaceable items
  const toReplace = results.filter(
    r => r.status === 'auto_replace' && r.capture_path && fs.existsSync(r.capture_path)
  );

  console.log(`Found ${toReplace.length} screenshots to auto-replace\n`);

  if (toReplace.length === 0) {
    console.log('No screenshots to auto-replace.');
    return;
  }

  // Collect replacement info (don't copy yet -- we'll copy after branching off master)
  const replaced: {assetPath: string; diffPct: number; capturePath: string}[] = [];

  for (const result of toReplace) {
    console.log(`Replacing: ${result.inventory_item.asset_path}`);
    console.log(`  Diff: ${((result.diff_pct || 0) * 100).toFixed(2)}%`);

    if (dryRun) {
      console.log(`  [DRY RUN] Would copy ${result.capture_path} -> ${result.inventory_item.asset_path}`);
    }

    replaced.push({
      assetPath: result.inventory_item.asset_path,
      diffPct: result.diff_pct || 0,
      capturePath: result.capture_path!,
    });
  }

  if (dryRun) {
    console.log(`\n[DRY RUN] Would commit and create PR for ${replaced.length} replacements.`);
    return;
  }

  // Git operations
  const dateStr = new Date().toISOString().slice(0, 10);
  const branchName = `docs/auto-screenshot-update-${dateStr}`;
  const commitMsg = `chore(docs): auto-replace ${replaced.length} stale screenshots`;

  console.log(`\nCreating branch: ${branchName}`);

  try {
    // Configure git identity for CI
    execSync('git config user.name "github-actions[bot]"', {cwd: repoRoot, stdio: 'pipe'});
    execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', {cwd: repoRoot, stdio: 'pipe'});

    // Fetch latest master to branch from
    execSync('git fetch origin master', {cwd: repoRoot, stdio: 'pipe'});

    // Delete the branch if it already exists (from a previous run)
    try {
      execSync(`git branch -D ${branchName}`, {cwd: repoRoot, stdio: 'pipe'});
    } catch {
      // Branch doesn't exist locally, that's fine
    }
    try {
      execSync(`git push origin --delete ${branchName}`, {cwd: repoRoot, stdio: 'pipe'});
    } catch {
      // Branch doesn't exist remotely, that's fine
    }

    // Create new branch off master (not the current branch)
    // This ensures the PR only contains image changes, not pipeline code
    execSync(`git checkout -b ${branchName} origin/master`, {cwd: repoRoot, stdio: 'pipe'});

    // Copy the captured images into the working tree (they were saved to temp paths)
    for (const r of replaced) {
      const targetPath = path.join(repoRoot, r.assetPath);
      const sourcePath = r.capturePath;
      if (sourcePath && fs.existsSync(sourcePath)) {
        fs.mkdirSync(path.dirname(targetPath), {recursive: true});
        fs.copyFileSync(sourcePath, targetPath);
      }
    }

    // Stage all replaced images
    for (const r of replaced) {
      execSync(`git add "${r.assetPath}"`, {cwd: repoRoot, stdio: 'pipe'});
    }

    // Commit
    execSync(`git commit -m "${commitMsg}"`, {cwd: repoRoot, stdio: 'pipe'});

    console.log(`Committed: ${commitMsg}`);

    // Push
    execSync(`git push -u origin ${branchName}`, {cwd: repoRoot, stdio: 'pipe'});
    console.log(`Pushed to: ${branchName}`);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`Git operations failed: ${errorMsg}`);
    console.error('You may need to manually commit and push the changes.');
    return;
  }

  // Create PR
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.warn('Warning: GITHUB_TOKEN not set. Skipping PR creation.');
    console.log('Push succeeded. Create a PR manually.');
    return;
  }

  await createPullRequest(githubToken, branchName, replaced, commitMsg);
}

// ── PR Creation ──

async function createPullRequest(
  token: string,
  branchName: string,
  replaced: {assetPath: string; diffPct: number; capturePath: string}[],
  title: string
): Promise<void> {
  const octokit = new Octokit({auth: token});

  // Build PR body
  const tableRows = replaced
    .map(
      r =>
        `| \`${r.assetPath}\` | ${(r.diffPct * 100).toFixed(2)}% |`
    )
    .join('\n');

  const body = `## Automated Screenshot Replacement

This PR was generated by the screenshot pipeline. It replaces **${replaced.length}** stale screenshots with fresh captures from the Sentry UI.

### Replaced Screenshots

| Asset Path | Diff % |
|------------|--------|
${tableRows}

### Review Checklist

- [ ] Spot-check a few screenshots to verify they look correct
- [ ] Verify no annotated screenshots were accidentally replaced
- [ ] Check that alt text is still appropriate for the new captures

### Notes

- All screenshots were captured from the Sentry staging environment
- Images were optimized before committing
- Only screenshots marked as \`deterministic: true\` with diff below the high threshold were auto-replaced
- Screenshots with diff above ${50}% or marked \`deterministic: false\` were sent to Linear for manual review
`;

  try {
    const {data: pr} = await octokit.pulls.create({
      owner: 'getsentry',
      repo: 'sentry-docs',
      title,
      body,
      head: branchName,
      base: 'master',
    });

    console.log(`\nPR created: ${pr.html_url}`);

    // Request reviewers
    try {
      await octokit.pulls.requestReviewers({
        owner: 'getsentry',
        repo: 'sentry-docs',
        pull_number: pr.number,
        team_reviewers: ['docs', 'product-owners-docs'],
      });
      console.log('Reviewers requested: getsentry/docs, getsentry/product-owners-docs');
    } catch (err) {
      console.warn(`Warning: Could not request reviewers: ${err}`);
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`Failed to create PR: ${errorMsg}`);
  }
}

// ── Helpers ──

function findRepoRoot(): string {
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg.name === 'sentry-docs') {
          return dir;
        }
      } catch {
        // continue
      }
    }
    dir = path.dirname(dir);
  }
  return process.cwd();
}

// ── Entry Point ──

main().catch(err => {
  console.error('Auto-replace failed:', err);
  process.exit(1);
});
