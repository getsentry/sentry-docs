import matter from 'gray-matter';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {limitFunction} from 'p-limit';

import getAllFilesRecursively from './files';
import {FrontMatter} from './types';
import {isNotNil} from './utils';

const root = process.cwd();
const FILE_CONCURRENCY_LIMIT = 20;

const formatSlug = (slug: string): string =>
  slug
    .replace(/^platforms\//, '')
    .replace(/\/_category_.mdx?$/, '')
    .replace(/\/index.mdx?$/, '')
    .replace(/\.mdx?$/, '');

let getDocsFrontMatterCache: Promise<FrontMatter[]> | undefined;

export function getDocsFrontMatter(): Promise<FrontMatter[]> {
  if (!getDocsFrontMatterCache) {
    getDocsFrontMatterCache = getDocsFrontMatterUncached();
  }
  return getDocsFrontMatterCache;
}

async function getDocsFrontMatterUncached(): Promise<FrontMatter[]> {
  const docsPath = path.join(root, 'docs');
  const files = await getAllFilesRecursively(docsPath);
  const allFrontMatter: FrontMatter[] = [];

  await Promise.all(
    files.map(
      limitFunction(
        async file => {
          const fileName = file.slice(docsPath.length + 1);
          if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
            return;
          }

          if (fileName.indexOf('/common/') !== -1) {
            return;
          }

          const source = await readFile(file, 'utf8');
          const {data: frontmatter} = matter(source);
          allFrontMatter.push({
            ...(frontmatter as FrontMatter),
            slug: formatSlug(fileName),
            sourcePath: path.join('docs', fileName),
          });
        },
        {concurrency: FILE_CONCURRENCY_LIMIT}
      )
    )
  );

  return allFrontMatter;
}

let getDevDocsFrontMatterCache: Promise<FrontMatter[]> | undefined;

export function getDevDocsFrontMatter(): Promise<FrontMatter[]> {
  if (!getDevDocsFrontMatterCache) {
    getDevDocsFrontMatterCache = getDevDocsFrontMatterUncached();
  }
  return getDevDocsFrontMatterCache;
}

async function getDevDocsFrontMatterUncached(): Promise<FrontMatter[]> {
  const folder = 'develop-docs';
  const docsPath = path.join(root, folder);
  const files = await getAllFilesRecursively(docsPath);
  const frontMatters = (
    await Promise.all(
      files.map(
        limitFunction(
          async file => {
            const fileName = file.slice(docsPath.length + 1);
            if (path.extname(fileName) !== '.md' && path.extname(fileName) !== '.mdx') {
              return undefined;
            }

            const source = await readFile(file, 'utf8');
            const {data: frontmatter} = matter(source);
            return {
              ...(frontmatter as FrontMatter),
              slug: fileName.replace(/\/index.mdx?$/, '').replace(/\.mdx?$/, ''),
              sourcePath: path.join(folder, fileName),
            };
          },
          {concurrency: FILE_CONCURRENCY_LIMIT}
        )
      )
    )
  ).filter(isNotNil);
  return frontMatters;
}
