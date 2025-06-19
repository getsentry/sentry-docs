#!/usr/bin/env node

import {selectAll} from 'hast-util-select';
import {existsSync} from 'node:fs';
import {mkdir, opendir, readFile, rm, writeFile} from 'node:fs/promises';
import * as path from 'node:path';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import {unified} from 'unified';
import {remove} from 'unist-util-remove';

let root = process.cwd();
while (!existsSync(path.join(root, 'package.json'))) {
  const parent = path.dirname(root);
  if (parent === root) {
    throw new Error('Could not find package.json in parent directories');
  }
  root = parent;
}
const INPUT_DIR = path.join(root, '.next', 'server', 'app');
const OUTPUT_DIR = path.join(root, 'public', 'md-exports');

export const genMDFromHTML = async (source, target) => {
  const text = await readFile(source, {encoding: 'utf8'});
  await writeFile(
    target,
    String(
      await unified()
        .use(rehypeParse)
        // Need the `main div > hgroup` selector for the headers
        .use(() => tree => selectAll('main div > hgroup, div#main', tree))
        // If we don't do this wrapping, rehypeRemark just returns an empty string -- yeah WTF?
        .use(() => tree => ({
          type: 'element',
          tagName: 'div',
          properties: {},
          children: tree,
        }))
        .use(rehypeRemark, {
          document: false,
          handlers: {
            // Remove buttons as they usually get confusing in markdown, especially since we use them as tab headers
            button() {},
          },
        })
        // We end up with empty inline code blocks, probably from some tab logic in the HTML, remove them
        .use(() => tree => remove(tree, {type: 'inlineCode', value: ''}))
        .use(remarkGfm)
        .use(remarkStringify)
        .process(text)
    )
  );
};

async function main() {
  console.log(`🚀 Starting markdown generation from: ${INPUT_DIR}`);
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
