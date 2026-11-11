#!/usr/bin/env node

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
    const {DOCTREE_FILENAME, isDeveloperDocs} = await import('../src/docsSite.mjs');

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

    // Save to .next for standalone builds
    const nextPath = path.join(nextDir, DOCTREE_FILENAME);
    await writeFile(nextPath, treeJSON, 'utf-8');

    // Save to public for serverless (will be accessible as static file)
    const publicPath = path.join(publicDir, DOCTREE_FILENAME);
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
