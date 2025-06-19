#!/usr/bin/env node

import {mkdir, opendir, readFile, rm, writeFile} from 'node:fs/promises';
import * as path from 'node:path';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import {unified} from 'unified';
import {remove} from 'unist-util-remove';

const root = process.cwd(); // fix this
const INPUT_DIR = path.join(root, '.next', 'server', 'app');
const OUTPUT_DIR = path.join(root, 'public', 'md-exports');

export const genMDFromHTML = async (source, target) => {
  const text = await readFile(source, {encoding: 'utf8'});
  await writeFile(
    target,
    String(
      await unified()
        .use(rehypeParse)
        .use(rehypeRemark)
        .use(() => tree => remove(tree, {type: 'text', value: 'Copied'}))
        .use(remarkGfm)
        .use(remarkStringify)
        .process(text)
    )
  );
};

async function main() {
  console.log('🚀 Starting markdown export generation...');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);

  // Clear output directory
  await rm(OUTPUT_DIR, {recursive: true, force: true});
  await mkdir(OUTPUT_DIR, {recursive: true});
  let counter = 0;
  try {
    // Need a high buffer size here otherwise Node skips some subdirectories!
    // See https://github.com/nodejs/node/issues/48820
    const dir = await opendir(INPUT_DIR, {recursive: true, bufferSize: 1024});
    for await (const dirent of dir) {
      if (dirent.name.endsWith('.html') && dirent.isFile()) {
        const sourcePath = path.join(dirent.parentPath || dirent.path, dirent.name);
        const targetDir = path.join(
          OUTPUT_DIR,
          path.relative(INPUT_DIR, dirent.parentPath || dirent.path)
        );
        await mkdir(targetDir, {recursive: true});
        const targetPath = path.join(targetDir, dirent.name.slice(0, -5) + '.md');
        await genMDFromHTML(sourcePath, targetPath);
        counter++;
      }
    }
  } catch (err) {
    console.error(err);
  }

  console.log(`📄 Generated ${counter} markdown files from HTML.`);
  console.log('✅ Markdown export generation complete!');
}

main().catch(console.error);
