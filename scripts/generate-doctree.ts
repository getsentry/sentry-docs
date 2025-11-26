#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Pre-compute the doc tree at build time and save it as JSON.
 * This prevents runtime filesystem access in serverless functions.
 */

import {mkdir, writeFile} from 'fs/promises';
import path from 'path';

import {getDocsRootNodeUncached} from '../src/docTree';

const root = process.cwd();

async function main() {
  console.log('🌲 Generating doc tree...');

  try {
    // Generate the doc tree
    const tree = await getDocsRootNodeUncached();

    // Create .next directory if it doesn't exist
    const nextDir = path.join(root, '.next');
    await mkdir(nextDir, {recursive: true});

    // Save to JSON (remove parent references to avoid circular structure)
    const outputPath = path.join(nextDir, 'doctree.json');
    await writeFile(
      outputPath,
      JSON.stringify(tree, (key, value) => (key === 'parent' ? undefined : value)),
      'utf-8'
    );

    console.log(`✅ Doc tree saved to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating doc tree:', error);
    console.error(error);
    process.exit(1);
  }
}

main();
