#!/usr/bin/env ts-node

/**
 * Create Linear Project with Issues
 *
 * Creates a Linear project "Replace stale images" under the DOCS team,
 * with one issue per doc page that has stale screenshots or Arcade embeds.
 *
 * Priority mapping:
 *   - /product/issues/ and /product/sentry-basics/ -> High (urgent)
 *   - /platforms/ -> Medium (normal)
 *   - Everything else -> Low
 *
 * Usage:
 *   LINEAR_API_KEY=xxx LINEAR_TEAM_ID=yyy npx ts-node tools/create-linear-project.ts
 *   LINEAR_API_KEY=xxx LINEAR_TEAM_ID=yyy npx ts-node tools/create-linear-project.ts --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import {LinearClient} from '@linear/sdk';

interface IssuePlan {
  doc_path: string;
  priority: 'high' | 'medium' | 'low';
  screenshot_count: number;
  arcade_count: number;
  total: number;
  is_include?: boolean;
}

// Linear priority values: 0=none, 1=urgent, 2=high, 3=medium, 4=low
const PRIORITY_MAP: Record<string, number> = {
  high: 2,
  medium: 3,
  low: 4,
};

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const apiKey = process.env.LINEAR_API_KEY;
  const teamId = process.env.LINEAR_TEAM_ID;

  if (!apiKey) {
    console.error('Error: LINEAR_API_KEY environment variable required');
    process.exit(1);
  }
  if (!teamId) {
    console.error('Error: LINEAR_TEAM_ID environment variable required');
    process.exit(1);
  }

  console.log('=== Create Linear Project: Replace stale images ===');
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // Load the issues plan
  const planPath = path.join(__dirname, '../output/linear-issues-plan.json');
  if (!fs.existsSync(planPath)) {
    console.error('Error: Run the crawler first to generate the issues plan');
    console.error('  npm run crawl && then run the python grouping command');
    process.exit(1);
  }

  const issues: IssuePlan[] = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
  console.log(`Loaded ${issues.length} issues to create\n`);

  const client = new LinearClient({apiKey});

  // Step 1: Create the project
  let projectId: string;

  if (dryRun) {
    console.log('[DRY RUN] Would create project: "Replace stale images"');
    projectId = 'dry-run-project-id';
  } else {
    console.log('Creating project: "Replace stale images"...');

    // Check if project already exists
    const existingProjects = await client.projects({
      filter: {
        name: {eq: 'Replace stale images'},
        state: {nin: ['canceled']},
      },
    });

    if (existingProjects.nodes.length > 0) {
      projectId = existingProjects.nodes[0].id;
      console.log(`  Project already exists: ${existingProjects.nodes[0].id}`);
    } else {
      const projectResult = await client.createProject({
        name: 'Replace stale images',
        description:
          'Replace stale docs screenshots and Arcade embeds after UI refresh. ' +
          'High=issues+basics, Medium=platforms, Low=everything else.',
        teamIds: [teamId],
      });
      const project = await projectResult.project;
      if (!project) {
        console.error('Failed to create project');
        process.exit(1);
      }
      projectId = project.id;
      console.log(`  Created project: ${project.id}`);
    }
  }

  // Step 2: Get or create labels
  const labelIds: Record<string, string> = {};

  if (!dryRun) {
    for (const labelName of ['docs-screenshots', 'Playwright', 'stale-image', 'arcade']) {
      try {
        const existing = await client.issueLabels({
          filter: {name: {eq: labelName}},
        });
        if (existing.nodes.length > 0) {
          labelIds[labelName] = existing.nodes[0].id;
        } else {
          const result = await client.createIssueLabel({
            name: labelName,
            teamId,
          });
          const label = await result.issueLabel;
          if (label) {
            labelIds[labelName] = label.id;
          }
        }
      } catch (err) {
        console.warn(`  Warning: Could not resolve label "${labelName}": ${err}`);
      }
    }
    console.log(`  Resolved ${Object.keys(labelIds).length} labels\n`);
  }

  // Step 3: Create issues
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    const progress = `[${i + 1}/${issues.length}]`;

    // Build title and description
    const pageName = issue.doc_path
      .replace(/^docs\//, '')
      .replace(/\/index\.mdx$/, '')
      .replace(/\.mdx$/, '');

    const assetSummary: string[] = [];
    if (issue.screenshot_count > 0) {
      assetSummary.push(
        `${issue.screenshot_count} screenshot${issue.screenshot_count > 1 ? 's' : ''}`
      );
    }
    if (issue.arcade_count > 0) {
      assetSummary.push(
        `${issue.arcade_count} Arcade${issue.arcade_count > 1 ? 's' : ''}`
      );
    }

    let title: string;
    let description: string;

    if (issue.is_include) {
      // Include-based issue: fixing this updates all pages that use the include
      title = `Update stale shared images: ${pageName} (${assetSummary.join(', ')})`;

      const repoUrl = `https://github.com/getsentry/sentry-docs/tree/master/${issue.doc_path}`;

      description = `## Stale Shared Images: \`${pageName}\`

**Source directory:** [${issue.doc_path}](${repoUrl})
**Stale screenshots:** ${issue.screenshot_count}
**Priority:** ${issue.priority}

### Why this matters

This is a **shared include** used across multiple docs pages (platform docs, SDK guides, etc.). Fixing the images here updates them everywhere they're referenced.

### What to do

1. Open the source directory and check each image in the \`img/\` subfolder
2. Recapture screenshots from the current Sentry UI
3. Replace the image files in place
4. Commit and open a PR

### Notes

- This issue was auto-generated by the screenshot pipeline
- Shared includes are referenced via \`<Include name="..." />\` across many docs pages
- Updating images here is high-leverage: one fix, many pages updated`;
    } else {
      // Direct page issue
      title = `Update stale images: ${pageName} (${assetSummary.join(', ')})`;

      const docsUrl = `https://docs.sentry.io/${issue.doc_path
        .replace(/^docs\//, '')
        .replace(/\/index\.mdx$/, '/')
        .replace(/\.mdx$/, '/')}`;

      const repoUrl = `https://github.com/getsentry/sentry-docs/blob/master/${issue.doc_path}`;

      description = `## Stale Images: \`${pageName}\`

**Docs page:** [${docsUrl}](${docsUrl})
**Source file:** [${issue.doc_path}](${repoUrl})
**Stale screenshots:** ${issue.screenshot_count}
**Stale Arcades:** ${issue.arcade_count}
**Priority:** ${issue.priority}

### What to do

1. Open the [docs page](${docsUrl}) and compare each screenshot against the current Sentry UI
2. For screenshots: recapture from the current UI and replace the image file
3. For Arcades: re-record the interactive walkthrough and update the embed URL
4. Ensure alt text is still accurate for any replaced images
5. Commit and open a PR

### Notes

- This issue was auto-generated by the screenshot pipeline
- See the source MDX file for all image references
- Images are stored in the \`img/\` folder next to the MDX file`;
    }

    // Determine labels
    const issueLabelIds: string[] = [];
    if (labelIds['docs-screenshots']) issueLabelIds.push(labelIds['docs-screenshots']);
    if (labelIds['Playwright']) issueLabelIds.push(labelIds['Playwright']);
    if (labelIds['stale-image']) issueLabelIds.push(labelIds['stale-image']);
    if (issue.arcade_count > 0 && labelIds['arcade']) {
      issueLabelIds.push(labelIds['arcade']);
    }

    if (dryRun) {
      console.log(`${progress} [DRY RUN] [${issue.priority}] ${title}`);
      created++;
      continue;
    }

    try {
      const result = await client.createIssue({
        teamId,
        title,
        description,
        priority: PRIORITY_MAP[issue.priority],
        labelIds: issueLabelIds.length > 0 ? issueLabelIds : undefined,
        projectId,
      });

      const createdIssue = await result.issue;
      if (createdIssue) {
        console.log(`${progress} Created: ${createdIssue.identifier} [${issue.priority}] ${pageName}`);
        created++;
      } else {
        console.error(`${progress} Failed to create: ${title}`);
        failed++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`${progress} Error: ${msg}`);
      failed++;
    }

    // Rate limiting
    if (i < issues.length - 1) {
      await sleep(300);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${issues.length}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
