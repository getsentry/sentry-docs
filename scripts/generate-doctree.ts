#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Pre-compute the doc tree at build time and save it as JSON.
 * This prevents runtime filesystem access in serverless functions.
 */

import {mkdir, writeFile} from 'fs/promises';
import path from 'path';

const root = process.cwd();

async function main() {
  console.log('🌲 Generating doc tree...');

  try {
    // Dynamically import to respect NEXT_PUBLIC_DEVELOPER_DOCS at build time
    const {getDocsRootNodeUncached} = await import('../src/docTree');
    const {isDeveloperDocs} = await import('../src/isDeveloperDocs');

    // Generate the doc tree
    const tree = await getDocsRootNodeUncached();

    // Save to both .next (for standalone) and public (for serverless)
    const nextDir = path.join(root, '.next');
    const publicDir = path.join(root, 'public');

    await mkdir(nextDir, {recursive: true});
    await mkdir(publicDir, {recursive: true});

    const treeJSON = JSON.stringify(tree, (key, value) =>
      key === 'parent' ? undefined : value
    );

    // Use different filename based on which docs we're building
    const filename = isDeveloperDocs ? 'doctree-dev.json' : 'doctree.json';

    // Save to .next for standalone builds
    const nextPath = path.join(nextDir, filename);
    await writeFile(nextPath, treeJSON, 'utf-8');

    // Save to public for serverless (will be accessible as static file)
    const publicPath = path.join(publicDir, filename);
    await writeFile(publicPath, treeJSON, 'utf-8');

    console.log(
      `✅ Doc tree saved to ${nextPath} and ${publicPath} (isDeveloperDocs: ${isDeveloperDocs})`
    );
  } catch (error) {
    console.error('❌ Error generating doc tree:', error);
    console.error(error);
    process.exit(1);
  }
}

main();
