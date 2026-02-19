#!/usr/bin/env node
/* eslint-disable no-console */
import {ListObjectsV2Command, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import imgLinks from '@pondorasti/remark-img-links';
import {selectAll} from 'hast-util-select';
import {createHash} from 'node:crypto';
import {createReadStream, createWriteStream, existsSync} from 'node:fs';
import {mkdir, opendir, readdir, readFile, rm, writeFile} from 'node:fs/promises';
import {cpus} from 'node:os';
import * as path from 'node:path';
import {compose, Readable} from 'node:stream';
import {text} from 'node:stream/consumers';
import {pipeline} from 'node:stream/promises';
import {fileURLToPath} from 'node:url';
import {isMainThread, parentPort, Worker, workerData} from 'node:worker_threads';
import {
  constants as zlibConstants,
  createBrotliCompress,
  createBrotliDecompress,
} from 'node:zlib';
import pLimit from 'p-limit';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import RemarkLinkRewrite from 'remark-link-rewrite';
import remarkStringify from 'remark-stringify';
import {unified} from 'unified';
import {remove} from 'unist-util-remove';

const DOCS_ORIGIN = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
  ? 'https://develop.sentry.dev'
  : 'https://docs.sentry.io';
const CACHE_VERSION = 7;
const CACHE_COMPRESS_LEVEL = 4;
const R2_BUCKET = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
  ? 'sentry-develop-docs'
  : 'sentry-docs';
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

// --- Doc tree helpers for generating structured navigation ---

function findNode(node, pathParts) {
  for (const part of pathParts) {
    node = node.children?.find(c => c.slug === part);
    if (!node) {
      return null;
    }
  }
  return node;
}

function getTitle(node) {
  return node.frontmatter?.sidebar_title || node.frontmatter?.title || node.slug;
}

function isVisible(node) {
  return (
    !node.frontmatter?.sidebar_hidden &&
    !node.frontmatter?.draft &&
    !node.path?.includes('__v') &&
    (node.frontmatter?.title || node.frontmatter?.sidebar_title)
  );
}

function getVisibleChildren(node) {
  return (node.children || []).filter(isVisible).sort((a, b) => {
    const orderDiff =
      (a.frontmatter?.sidebar_order ?? 99) - (b.frontmatter?.sidebar_order ?? 99);
    return orderDiff !== 0 ? orderDiff : getTitle(a).localeCompare(getTitle(b));
  });
}

function getS3Client() {
  return new S3Client({
    endpoint: 'https://773afa1f62ff86c80db4f24f7ff1e9c8.r2.cloudflarestorage.com',
    region: 'auto',
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    retryMode: 'adaptive',
  });
}

async function uploadToCFR2(s3Client, relativePath, data) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: relativePath,
    Body: data,
    ContentType: 'text/markdown',
  });
  await s3Client.send(command);
}

// --- Shared link resolver utilities for page overrides ---

function nodeLinks(node, subtreePath) {
  if (!node) {
    return [];
  }
  const subtree = subtreePath ? findNode(node, subtreePath.split('/')) : node;
  if (!subtree) {
    return [];
  }
  return getVisibleChildren(subtree).map(child => ({
    title: getTitle(child),
    url: `${DOCS_ORIGIN}/${child.path}.md`,
  }));
}

function childLinks(ctx, filter) {
  let pages = ctx.children;
  if (filter) {
    pages = pages.filter(filter);
  }
  return pages
    .map(p => {
      const parts = p.replace(/\.md$/, '').split('/');
      const node = findNode(ctx.docTree, parts);
      return {
        title: node ? getTitle(node) : parts[parts.length - 1],
        url: `${DOCS_ORIGIN}/${p}`,
        order: node?.frontmatter?.sidebar_order ?? 99,
      };
    })
    .sort((a, b) => {
      const orderDiff = a.order - b.order;
      return orderDiff !== 0 ? orderDiff : a.title.localeCompare(b.title);
    });
}

function siblingGuideLinks(ctx) {
  const platformSlug = ctx.pathParts[1];
  const guideSlug = ctx.pathParts[3];
  const platformNode = findNode(ctx.docTree, ['platforms', platformSlug]);
  if (!platformNode) {
    return [];
  }
  const guidesNode = findNode(platformNode, ['guides']);
  if (!guidesNode) {
    return [];
  }
  return getVisibleChildren(guidesNode)
    .filter(g => g.slug !== guideSlug)
    .map(g => ({
      title: getTitle(g),
      url: `${DOCS_ORIGIN}/platforms/${platformSlug}/guides/${g.slug}.md`,
    }));
}

function platformTitle(ctx) {
  const platformNode = findNode(ctx.docTree, ['platforms', ctx.pathParts[1]]);
  return platformNode ? getTitle(platformNode) : ctx.pathParts[1];
}

function renderSections(ctx, sections) {
  let result = '';
  for (const section of sections) {
    const heading =
      typeof section.heading === 'function' ? section.heading(ctx) : section.heading;
    const items =
      typeof section.items === 'function' ? section.items(ctx) : section.items;
    if (items.length === 0) {
      continue;
    }
    result += `\n## ${heading}\n\n`;
    result += items.map(item => `- [${item.title}](${item.url})`).join('\n');
    result += '\n';
  }
  return result;
}

// Escape hatch for platforms.md which needs complex grouped structure
function buildPlatformsSection(ctx) {
  const platformsNode = findNode(ctx.docTree, ['platforms']);
  if (!platformsNode) {
    return '';
  }

  const platforms = getVisibleChildren(platformsNode);
  let section = `\n## Platforms\n\n`;
  section += platforms
    .map(p => `- [${getTitle(p)}](${DOCS_ORIGIN}/platforms/${p.slug}.md)`)
    .join('\n');

  const frameworkLines = [];
  for (const platform of platforms) {
    const guidesNode = findNode(platform, ['guides']);
    if (!guidesNode) {
      continue;
    }
    const guides = getVisibleChildren(guidesNode);
    if (guides.length === 0) {
      continue;
    }
    frameworkLines.push(`\n### ${getTitle(platform)}\n`);
    for (const guide of guides) {
      frameworkLines.push(
        `- [${getTitle(guide)}](${DOCS_ORIGIN}/platforms/${platform.slug}/guides/${guide.slug}.md)`
      );
    }
  }
  if (frameworkLines.length > 0) {
    section += `\n\n## Frameworks\n${frameworkLines.join('\n')}\n`;
  }

  return section + '\n';
}

// Declarative page overrides for appended navigation sections.
// First match wins. Unmatched pages with children get default "Pages in this section".
const pageOverrides = [
  {
    match: 'platforms.md',
    build: ctx => buildPlatformsSection(ctx),
  },
  {
    // Platform index pages (e.g., platforms/javascript.md)
    match: ctx => ctx.pathParts[0] === 'platforms' && ctx.pathParts.length === 2,
    sections: [
      {heading: 'Frameworks', items: ctx => nodeLinks(ctx.node, 'guides')},
      {heading: 'Topics', items: ctx => childLinks(ctx, p => !p.includes('/guides/'))},
    ],
  },
  {
    // Guide index pages (e.g., platforms/javascript/guides/nextjs.md)
    match: ctx =>
      ctx.pathParts.length === 4 &&
      ctx.pathParts[0] === 'platforms' &&
      ctx.pathParts[2] === 'guides',
    sections: [
      {
        heading: ctx => `Other ${platformTitle(ctx)} Frameworks`,
        items: ctx => siblingGuideLinks(ctx),
      },
      {heading: 'Topics', items: ctx => childLinks(ctx)},
    ],
  },
];

function buildChildSection(ctx) {
  for (const override of pageOverrides) {
    const matches =
      typeof override.match === 'string'
        ? ctx.relativePath === override.match
        : override.match(ctx);
    if (!matches) {
      continue;
    }
    if (override.build) {
      return override.build(ctx);
    }
    if (override.sections) {
      return renderSections(ctx, override.sections);
    }
    return '';
  }

  // Default: list children sorted by sidebar_order
  return renderSections(ctx, [
    {heading: 'Pages in this section', items: () => childLinks(ctx)},
  ]);
}

function buildFallbackChildSection(parentPath, children) {
  const isPlatformIndex =
    parentPath.startsWith('platforms/') && parentPath.split('/').length === 2;

  const guides = isPlatformIndex ? children.filter(p => p.includes('/guides/')) : [];
  const otherPages = isPlatformIndex
    ? children.filter(p => !p.includes('/guides/'))
    : children;

  let childSection = '';
  if (guides.length > 0) {
    const guideList = guides
      .map(p => {
        const name = p.replace(/\.md$/, '').split('/').pop();
        return `- [${name}](${DOCS_ORIGIN}/${p})`;
      })
      .join('\n');
    childSection += `\n## Guides\n\n${guideList}\n`;
  }
  if (otherPages.length > 0) {
    const pageList = otherPages
      .map(p => {
        const name = p.replace(/\.md$/, '').split('/').pop();
        return `- [${name}](${DOCS_ORIGIN}/${p})`;
      })
      .join('\n');
    childSection += `\n## Pages in this section\n\n${pageList}\n`;
  }
  return childSection;
}

/**
 * Injects a description and navigation links after the first H1 heading.
 * Returns the original content unchanged if no H1 is found.
 */
function injectDescription(markdown, description, {navLinks = []} = {}) {
  let suffix = `\n\n*${description}*\n`;
  if (navLinks.length > 0) {
    suffix += '\n' + navLinks.map(link => `*${link}*`).join('\n') + '\n';
  }
  // Use a replacer function to avoid $ in descriptions being interpreted as
  // special regex replacement patterns (e.g. $1, $&, $')
  return markdown.replace(/^(# .+)$/m, match => match + suffix);
}

// --- MDX template rendering for full-page overrides ---

function buildMdxComponents(docTree, createElement) {
  function PlatformList() {
    if (!docTree) {
      return null;
    }
    const platformsNode = findNode(docTree, ['platforms']);
    if (!platformsNode) {
      return null;
    }
    const platforms = getVisibleChildren(platformsNode);
    return createElement(
      'ul',
      null,
      platforms.map(p =>
        createElement(
          'li',
          {key: p.slug},
          createElement('a', {href: `/platforms/${p.slug}`}, getTitle(p))
        )
      )
    );
  }

  function FrameworkGroups() {
    if (!docTree) {
      return null;
    }
    const platformsNode = findNode(docTree, ['platforms']);
    if (!platformsNode) {
      return null;
    }
    const platforms = getVisibleChildren(platformsNode);
    const groups = [];
    for (const platform of platforms) {
      const guidesNode = findNode(platform, ['guides']);
      if (!guidesNode) {
        continue;
      }
      const guides = getVisibleChildren(guidesNode);
      if (guides.length === 0) {
        continue;
      }
      groups.push(
        createElement('h3', {key: `h-${platform.slug}`}, getTitle(platform)),
        createElement(
          'ul',
          {key: `ul-${platform.slug}`},
          guides.map(g =>
            createElement(
              'li',
              {key: g.slug},
              createElement(
                'a',
                {href: `/platforms/${platform.slug}/guides/${g.slug}`},
                getTitle(g)
              )
            )
          )
        )
      );
    }
    return createElement('div', null, ...groups);
  }

  function DocSectionList({exclude = []}) {
    if (!docTree) {
      return null;
    }
    const sections = getVisibleChildren(docTree).filter(
      child => !exclude.includes(child.slug)
    );
    return createElement(
      'ul',
      null,
      sections.map(child =>
        createElement(
          'li',
          {key: child.slug},
          createElement('a', {href: `/${child.slug}`}, getTitle(child))
        )
      )
    );
  }

  // Renders every top-level section with its visible children as a nested list.
  // Used for the root index.md sitemap.
  function SectionTree({exclude = []}) {
    if (!docTree) {
      return null;
    }
    const sections = getVisibleChildren(docTree).filter(
      child => !exclude.includes(child.slug)
    );
    const elements = [];
    for (const section of sections) {
      elements.push(createElement('h2', {key: `h-${section.slug}`}, getTitle(section)));
      const children = getVisibleChildren(section);
      if (children.length > 0) {
        elements.push(
          createElement(
            'ul',
            {key: `ul-${section.slug}`},
            children.map(child =>
              createElement(
                'li',
                {key: child.slug},
                createElement('a', {href: `/${child.path}`}, getTitle(child))
              )
            )
          )
        );
      }
    }
    return createElement('div', null, ...elements);
  }

  return {PlatformList, FrameworkGroups, DocSectionList, SectionTree};
}

async function renderMdxOverrides(root, docTree) {
  const overrideDir = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
    ? path.join(root, 'md-overrides', 'dev')
    : path.join(root, 'md-overrides');

  const overrides = new Map();

  if (!existsSync(overrideDir)) {
    return overrides;
  }

  const tempDir = path.join(root, '.next', 'cache', 'md-override-html');
  await rm(tempDir, {recursive: true, force: true});
  await mkdir(tempDir, {recursive: true});

  const {evaluate} = await import('@mdx-js/mdx');
  const jsxRuntime = await import('react/jsx-runtime');
  const React = await import('react');
  const {renderToStaticMarkup} = await import('react-dom/server');
  const grayMatter = (await import('gray-matter')).default;

  const components = buildMdxComponents(docTree, React.createElement);
  // Non-recursive: only read .mdx files directly in overrideDir.
  // This prevents dev/ overrides from leaking into production builds.
  const files = await readdir(overrideDir);

  for (const file of files) {
    if (!file.endsWith('.mdx')) {
      continue;
    }

    const mdxSource = await readFile(path.join(overrideDir, file), {encoding: 'utf8'});
    const {data: frontmatter, content} = grayMatter(mdxSource);

    const {default: MDXContent} = await evaluate(content, {
      jsx: jsxRuntime.jsx,
      jsxs: jsxRuntime.jsxs,
      Fragment: jsxRuntime.Fragment,
    });

    const bodyHtml = renderToStaticMarkup(React.createElement(MDXContent, {components}));

    const relativePath = file.replace(/\.mdx$/, '.md');
    const urlPath = file.replace(/\.mdx$/, '').replace(/^index$/, '');
    const canonicalUrl = `${DOCS_ORIGIN}/${urlPath}`;

    const html = [
      '<!DOCTYPE html><html><head>',
      `<title>${frontmatter.title || ''}</title>`,
      `<link rel="canonical" href="${canonicalUrl}" />`,
      '</head><body>',
      `<main><div id="main">${bodyHtml}</div></main>`,
      '</body></html>',
    ].join('\n');

    const htmlPath = path.join(tempDir, file.replace(/\.mdx$/, '.html'));
    await mkdir(path.dirname(htmlPath), {recursive: true});
    await writeFile(htmlPath, html, {encoding: 'utf8'});

    overrides.set(relativePath, {htmlPath, frontmatter});
    console.log(`📝 Rendered MDX override: ${file} → ${relativePath}`);
  }

  return overrides;
}

// Global set to track which cache files are used across all workers
let globalUsedCacheFiles = null;

function taskFinishHandler({id, success, failedTasks, usedCacheFiles}) {
  // Collect cache files used by this worker into the global set
  if (usedCacheFiles && globalUsedCacheFiles) {
    console.log(`🔍 Worker[${id}]: returned ${usedCacheFiles.size} cache files.`);
    usedCacheFiles.forEach(file => globalUsedCacheFiles.add(file));
  } else {
    console.warn(
      `⚠️ Worker[${id}]: usedCacheFiles=${!!usedCacheFiles}, globalUsedCacheFiles=${!!globalUsedCacheFiles}`
    );
  }

  if (failedTasks.length === 0) {
    console.log(`✅ Worker[${id}]: converted ${success} files successfully.`);
    return false;
  }
  console.error(`❌ Worker[${id}]: ${failedTasks.length} files failed:`);
  console.error(failedTasks);
  return true;
}

async function createWork() {
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

  console.log(`🚀 Starting markdown generation from: ${INPUT_DIR}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);

  // Load doctree for structured navigation
  const doctreeFilename = process.env.NEXT_PUBLIC_DEVELOPER_DOCS
    ? 'doctree-dev.json'
    : 'doctree.json';
  const doctreePath = path.join(root, 'public', doctreeFilename);
  let docTree = null;
  try {
    docTree = JSON.parse(await readFile(doctreePath, {encoding: 'utf8'}));
    console.log(`🌳 Loaded doc tree from ${doctreePath}`);
  } catch (err) {
    console.warn(`⚠️ Could not load doctree (${doctreePath}): ${err.message}`);
    console.warn('   Falling back to slug-based navigation');
  }

  // Render MDX template overrides (full-page content replacements)
  const mdxOverrides = await renderMdxOverrides(root, docTree);

  // Clear output directory
  await rm(OUTPUT_DIR, {recursive: true, force: true});
  await mkdir(OUTPUT_DIR, {recursive: true});

  const CACHE_DIR = path.join(root, '.next', 'cache', 'md-exports');
  console.log(`💰 Cache directory: ${CACHE_DIR}`);
  const noCache = !existsSync(CACHE_DIR);
  let initialCacheFiles = [];
  if (noCache) {
    console.log(`ℹ️ No cache directory found, this will take a while...`);
    await mkdir(CACHE_DIR, {recursive: true});
  } else {
    initialCacheFiles = await readdir(CACHE_DIR);
    console.log(
      `📦 Cache directory has ${initialCacheFiles.length} files from previous build`
    );
  }

  // Track which cache files are used during this build
  globalUsedCacheFiles = new Set();

  // On a 16-core machine, 8 workers were optimal (and slightly faster than 16)
  const numWorkers = Math.max(Math.floor(cpus().length / 2), 2);
  const workerTasks = new Array(numWorkers).fill(null).map(() => []);

  let existingFilesOnR2 = null;
  if (accessKeyId && secretAccessKey) {
    existingFilesOnR2 = new Map();
    console.log(`☁️ Getting existing hashes from R2...`);
    const s3Client = getS3Client();
    let continuationToken = undefined;
    do {
      const response = await s3Client.send(
        new ListObjectsV2Command({
          Bucket: R2_BUCKET,
          ContinuationToken: continuationToken,
        })
      );
      continuationToken = response.NextContinuationToken;
      for (const {Key, ETag} of response.Contents || []) {
        existingFilesOnR2.set(Key, ETag.slice(1, -1)); // Remove quotes from ETag
      }
    } while (continuationToken);
    console.log(`✅ Found ${existingFilesOnR2.size} existing files on R2.`);
  }

  console.log(`🔎 Discovering files to convert...`);

  let numFiles = 0;
  let workerIdx = 0;
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
      const relativePath = path.relative(OUTPUT_DIR, targetPath);
      // Use MDX override HTML if available, otherwise use Next.js build HTML
      const mdxOverride = mdxOverrides.get(relativePath);
      workerTasks[workerIdx].push({
        sourcePath: mdxOverride ? mdxOverride.htmlPath : sourcePath,
        targetPath,
        relativePath,
        r2Hash: existingFilesOnR2 ? existingFilesOnR2.get(relativePath) : null,
      });
      workerIdx = (workerIdx + 1) % numWorkers;
      numFiles++;
    }
  }

  // Warn about MDX overrides that didn't match any HTML file
  const usedOverrides = new Set(
    workerTasks
      .flat()
      .filter(t => mdxOverrides.has(t.relativePath))
      .map(t => t.relativePath)
  );
  for (const [key] of mdxOverrides) {
    if (!usedOverrides.has(key)) {
      console.warn(
        `⚠️ MDX override "${key}" did not match any HTML file and will be ignored`
      );
    }
  }

  console.log(`📄 Converting ${numFiles} files with ${numWorkers} workers...`);

  const selfPath = fileURLToPath(import.meta.url);
  const workerPromises = new Array(numWorkers - 1).fill(null).map((_, id) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(selfPath, {
        workerData: {
          id,
          noCache,
          cacheDir: CACHE_DIR,
          tasks: workerTasks[id],
        },
      });
      let hasErrors = false;
      worker.on('message', data => (hasErrors = taskFinishHandler(data)));
      worker.on('error', reject);
      worker.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Worker[${id}] stopped with exit code ${code}`));
        } else {
          hasErrors ? reject(new Error(`Worker[${id}] had some errors.`)) : resolve();
        }
      });
    });
  });
  // The main thread can also process tasks -- That's 65% more bullet per bullet! -Cave Johnson
  const mainThreadUsedFiles = new Set();
  workerPromises.push(
    processTaskList({
      id: workerTasks.length - 1,
      tasks: workerTasks[workerTasks.length - 1],
      cacheDir: CACHE_DIR,
      noCache,
      usedCacheFiles: mainThreadUsedFiles,
    }).then(data => {
      if (taskFinishHandler(data)) {
        throw new Error(`Worker[${data.id}] had some errors.`);
      }
    })
  );

  await Promise.all(workerPromises);

  // Collect all generated paths
  const allPaths = workerTasks
    .flat()
    .map(task => task.relativePath)
    .sort();

  // Append child page listings to section index pages
  // Group paths by their DIRECT parent (handling guides specially)
  const pathsByParent = new Map();
  for (const p of allPaths) {
    const parts = p.replace(/\.md$/, '').split('/');
    if (parts.length <= 1) {
      continue;
    }

    // Determine the parent path - always direct parent, except:
    // Guide index pages (platforms/X/guides/Y.md) -> parent is platform (platforms/X.md)
    let parentPath;
    if (parts.includes('guides')) {
      const guidesIdx = parts.indexOf('guides');
      if (parts.length === guidesIdx + 2 && guidesIdx > 0) {
        // This is a guide index (e.g., platforms/python/guides/django.md)
        // Parent is the platform (platforms/python.md), skipping 'guides' folder
        parentPath = parts.slice(0, guidesIdx).join('/') + '.md';
      } else {
        // Pages inside guides use normal parent-child (direct parent only)
        parentPath = parts.slice(0, -1).join('/') + '.md';
      }
    } else {
      // Standard parent-child relationship (direct parent only)
      parentPath = parts.slice(0, -1).join('/') + '.md';
    }

    if (!pathsByParent.has(parentPath)) {
      pathsByParent.set(parentPath, []);
    }
    pathsByParent.get(parentPath).push(p);
  }

  // Append child listings to parent index files.
  // Skip pages whose MDX override sets append_sections: false.
  const hasR2 = !!(accessKeyId && secretAccessKey && existingFilesOnR2);
  let updatedCount = 0;
  // Always store the latest content per key. Hash comparison happens at upload
  // time so that later writes (description injection) always overwrite earlier
  // entries (child section append) even when the final content matches R2.
  const r2Uploads = new Map();

  function collectR2Upload(key, data) {
    if (!hasR2) {
      return;
    }
    r2Uploads.set(key, data);
  }

  for (const [parentPath, children] of pathsByParent) {
    const overrideFm = mdxOverrides.get(parentPath)?.frontmatter;
    if (overrideFm?.append_sections === false) {
      continue;
    }

    const parentFile = path.join(OUTPUT_DIR, parentPath);
    let existingContent;
    try {
      existingContent = await readFile(parentFile, {encoding: 'utf8'});
    } catch (err) {
      if (err.code === 'ENOENT') {
        continue; // Parent file doesn't exist, skip
      }
      throw err;
    }

    const pathParts = parentPath.replace(/\.md$/, '').split('/');
    const node = docTree ? findNode(docTree, pathParts) : null;
    const ctx = {
      docTree,
      relativePath: parentPath,
      pathParts,
      node,
      children,
    };

    const childSection = docTree
      ? buildChildSection(ctx)
      : buildFallbackChildSection(parentPath, children);

    if (childSection) {
      const updatedContent = existingContent + childSection;
      await writeFile(parentFile, updatedContent, {encoding: 'utf8'});
      updatedCount++;
      collectR2Upload(parentPath, updatedContent);
    }
  }
  console.log(`📑 Added child page listings to ${updatedCount} section index files`);

  // Inject frontmatter descriptions after H1 headings in MD exports.
  // This helps LLM agents quickly assess page relevance from the first few lines.
  // Skip MDX override pages (they have custom intros).
  const mdxOverridePaths = new Set(mdxOverrides.keys());
  let descriptionCount = 0;
  for (const relativePath of allPaths) {
    if (mdxOverridePaths.has(relativePath)) {
      continue;
    }
    const pathParts = relativePath.replace(/\.md$/, '').split('/');
    const node = docTree ? findNode(docTree, pathParts) : null;
    const description = node?.frontmatter?.description;
    if (!description) {
      continue;
    }
    const filePath = path.join(OUTPUT_DIR, relativePath);
    let content;
    try {
      content = await readFile(filePath, {encoding: 'utf8'});
    } catch {
      continue;
    }
    const navLinks = [];
    if (relativePath !== 'index.md') {
      navLinks.push(`Full documentation index: ${DOCS_ORIGIN}/`);
    }
    // Guide pages get a link back to their platform index
    if (pathParts[0] === 'platforms' && pathParts.includes('guides') && pathParts.length >= 4) {
      const platformNode = docTree ? findNode(docTree, ['platforms', pathParts[1]]) : null;
      const platformName = platformNode ? getTitle(platformNode) : pathParts[1];
      navLinks.push(`${platformName} SDK docs: ${DOCS_ORIGIN}/platforms/${pathParts[1]}/`);
    }
    const injected = injectDescription(content, description, {navLinks});
    if (injected === content) {
      continue;
    }
    await writeFile(filePath, injected, {encoding: 'utf8'});
    descriptionCount++;
    collectR2Upload(relativePath, injected);
  }
  if (descriptionCount > 0) {
    console.log(`📝 Injected descriptions into ${descriptionCount} markdown files`);
  }

  // Upload modified files to R2, skipping those whose hash already matches
  if (r2Uploads.size > 0) {
    const toUpload = [...r2Uploads].filter(
      ([key, data]) => existingFilesOnR2.get(key) !== md5(data)
    );
    if (toUpload.length > 0) {
      const limit = pLimit(50);
      const s3Client = getS3Client();
      await Promise.all(
        toUpload.map(([key, data]) => limit(() => uploadToCFR2(s3Client, key, data)))
      );
      console.log(`📤 Uploaded ${toUpload.length} modified files to R2`);
    }
  }

  // Clean up unused cache files to prevent unbounded growth
  if (!noCache) {
    try {
      const filesToDelete = initialCacheFiles.filter(
        file => !globalUsedCacheFiles.has(file)
      );
      const overlaps = initialCacheFiles.filter(file => globalUsedCacheFiles.has(file));

      console.log(`📊 Cache tracking stats:`);
      console.log(`   - Files in cache dir (after build): ${initialCacheFiles.length}`);
      console.log(`   - Files tracked as used: ${globalUsedCacheFiles.size}`);
      console.log(`   - Files that existed and were used: ${overlaps.length}`);
      console.log(`   - Files to delete (old/unused): ${filesToDelete.length}`);
      console.log(`   - Expected after cleanup: ${overlaps.length} files`);

      if (filesToDelete.length > 0) {
        const limit = pLimit(50);
        await Promise.all(
          filesToDelete.map(file =>
            limit(() => rm(path.join(CACHE_DIR, file), {force: true}))
          )
        );
        console.log(`🧹 Cleaned up ${filesToDelete.length} unused cache files`);
      }
    } catch (err) {
      console.warn('Failed to clean unused cache files:', err);
    }
  }

  console.log(`📄 Generated ${numFiles} markdown files from HTML.`);
  console.log('✅ Markdown export generation complete!');
}

const md5 = data => createHash('md5').update(data).digest('hex');

/**
 * Strips build-specific HTML elements that are irrelevant for markdown generation.
 *
 * Next.js build output contains elements that change between builds:
 * - <script> tags: RSC/Flight payloads, JS chunk references with content hashes
 * - <link> tags referencing /_next/static/: CSS files, fonts, JS preloads with hashes
 * - <style> tags with href: inlined CSS with build-specific hash in href attribute
 *
 * These elements are irrelevant for markdown generation (we only use title, canonical
 * link, and div#main content), so stripping them:
 * 1. Speeds up HTML parsing by reducing input size significantly
 * 2. Removes most build-specific variation from the HTML
 *
 * IMPORTANT: This function's output is used as pipeline input for .process(), so it must
 * only remove complete HTML elements — never modify text content or attribute values.
 * For additional normalization that's only safe for cache key computation, see
 * normalizeForCacheKey().
 */
function stripUnstableElements(html) {
  return (
    html
      // Remove script tags (RSC payloads, JS chunk references)
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      // Remove link tags referencing Next.js build assets (CSS, fonts, JS preloads)
      .replace(/<link[^>]*\/_next\/[^>]*>/gi, '')
      // Remove style tags with href attribute (inlined CSS with build hashes)
      .replace(/<style[^>]*href="[^"]*"[^>]*>[\s\S]*?<\/style>/gi, '')
  );
}

/**
 * Extracts only the content-relevant portions of HTML for stable cache key computation.
 *
 * The unified pipeline only uses three pieces of data from each page:
 * 1. <title> — the page title (becomes the H1 heading)
 * 2. <link rel="canonical"> — the canonical URL (used for link rewriting)
 * 3. <div id="main"> — the main content area (becomes the markdown body)
 *
 * Everything else (header, sidebar, footer, scripts, styles, fonts) is irrelevant for
 * markdown output. By extracting only these three elements, we make the cache key immune
 * to layout changes (sidebar updates from merged PRs), CSS hash changes (Emotion, CSS
 * modules), font hash changes, and any other build-specific variation in the surrounding
 * HTML shell.
 *
 * Within the extracted content, we still normalize build-specific hashes that can appear
 * inside div#main (e.g., Emotion classes on code block components, CSS module hashes on
 * interactive elements). These are irrelevant for text content extraction but would
 * otherwise cause cache misses between builds.
 */
function extractContentForCacheKey(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i);
  const mainMatch = html.match(/<div id="main"[^>]*>([\s\S]*)<\/main>/i);

  const title = titleMatch ? titleMatch[1] : '';
  const canonical = canonicalMatch ? canonicalMatch[1] : '';
  const mainContent = mainMatch ? mainMatch[1] : '';

  // Normalize build-specific hashes that appear inside main content
  // (e.g., Emotion CSS classes on code block tabs, CSS module hashes)
  const normalizedMain = mainContent
    // Remove Emotion style tags entirely (e.g., <style data-emotion="css o2ofml">...</style>)
    .replace(/<style data-emotion[^>]*>[\s\S]*?<\/style>/gi, '')
    // Normalize Emotion class names (e.g., css-o2ofml -> css-X)
    .replace(/css-[a-z0-9]+/g, 'css-X')
    // Normalize CSS module hashes (e.g., style_sidebar__iEJoR -> style_sidebar__X)
    .replace(/(\w+__)[a-zA-Z0-9]{5}/g, '$1X');

  return title + '\0' + canonical + '\0' + normalizedMain;
}

async function genMDFromHTML(source, target, {cacheDir, noCache, usedCacheFiles}) {
  const rawHTML = await readFile(source, {encoding: 'utf8'});
  // Strip build-specific HTML elements for faster parsing.
  // See stripUnstableElements() for details on what's removed and why.
  const strippedHTML = stripUnstableElements(rawHTML);
  // Extract only content-relevant portions (title, canonical URL, main content)
  // for cache key computation. This makes the key immune to layout/sidebar/header
  // changes and most build-specific hash variations. See extractContentForCacheKey().
  const cacheKey = `v${CACHE_VERSION}_${md5(extractContentForCacheKey(rawHTML))}`;
  const cacheFile = path.join(cacheDir, cacheKey);
  if (!noCache) {
    try {
      const data = await text(
        compose(createReadStream(cacheFile), createBrotliDecompress())
      );
      await writeFile(target, data, {encoding: 'utf8'});

      // Track that we used this cache file
      if (usedCacheFiles) {
        usedCacheFiles.add(cacheKey);
      }

      return {cacheHit: true, data};
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.warn(`Error using cache file ${cacheFile}:`, err);
      }
    }
  }

  let baseUrl = DOCS_ORIGIN;
  const data = String(
    await unified()
      .use(rehypeParse)
      // Select only the elements we need for markdown (title, canonical URL, main content).
      // Build-specific elements (scripts, CSS links, etc.) are already stripped by
      // stripUnstableElements() above, so we don't need to remove them here.
      .use(
        () => tree =>
          selectAll('head > title, head > link[rel="canonical"], div#main', tree)
      )
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
          // HACK: Extract the canonical URL during parsing
          link: (_state, node) => {
            if (node.properties.rel.includes('canonical') && node.properties.href) {
              baseUrl = node.properties.href;
            }
          },
          // Remove buttons as they usually get confusing in markdown, especially since we use them as tab headers
          button() {},
          // Convert the title to the top level heading
          // This is needed because the HTML title tag is not part of the main content
          // and we want to have a top level heading in the markdown
          title: (_state, node) => ({
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: node.children[0].value,
              },
            ],
          }),
        },
      })
      .use(RemarkLinkRewrite, {
        // There's a chance we might be changing absolute URLs here
        // We'll check the code base and fix that later
        replacer: url => {
          const mdUrl = new URL(url, baseUrl);
          if (mdUrl.origin !== DOCS_ORIGIN) {
            return url;
          }
          const newPathName = mdUrl.pathname.replace(/\/?$/, '');
          if (path.extname(newPathName) === '') {
            mdUrl.pathname = `${newPathName}.md`;
          }
          return mdUrl;
        },
      })
      .use(imgLinks, {absolutePath: DOCS_ORIGIN})
      // We end up with empty inline code blocks, probably from some tab logic in the HTML, remove them
      .use(() => tree => remove(tree, {type: 'inlineCode', value: ''}))
      .use(remarkGfm)
      .use(remarkStringify)
      .process(strippedHTML)
  );
  const reader = Readable.from(data);

  await Promise.all([
    pipeline(
      reader,
      createWriteStream(target, {
        encoding: 'utf8',
      })
    ),
    pipeline(
      reader,
      createBrotliCompress({
        chunkSize: 32 * 1024,
        params: {
          [zlibConstants.BROTLI_PARAM_MODE]: zlibConstants.BROTLI_MODE_TEXT,
          [zlibConstants.BROTLI_PARAM_QUALITY]: CACHE_COMPRESS_LEVEL,
          [zlibConstants.BROTLI_PARAM_SIZE_HINT]: data.length,
        },
      }),
      createWriteStream(cacheFile)
    ).catch(err => console.warn('Error writing cache file:', err)),
  ]);

  // Track that we created this cache file
  if (usedCacheFiles) {
    usedCacheFiles.add(cacheKey);
  }

  return {cacheHit: false, data};
}

async function processTaskList({id, tasks, cacheDir, noCache, usedCacheFiles}) {
  // Workers don't receive usedCacheFiles in workerData, so create a new Set
  if (!usedCacheFiles) {
    usedCacheFiles = new Set();
  }

  const s3Client = getS3Client();
  const failedTasks = [];
  let cacheMisses = [];
  let r2CacheMisses = [];
  console.log(`🤖 Worker[${id}]: Starting to process ${tasks.length} files...`);
  for (const {sourcePath, targetPath, relativePath, r2Hash} of tasks) {
    try {
      const {data, cacheHit} = await genMDFromHTML(sourcePath, targetPath, {
        cacheDir,
        noCache,
        usedCacheFiles,
      });
      if (!cacheHit) {
        cacheMisses.push(relativePath);
      }

      if (r2Hash !== null) {
        const fileHash = md5(data);
        if (r2Hash !== fileHash) {
          r2CacheMisses.push(relativePath);

          await uploadToCFR2(s3Client, relativePath, data);
        }
      }
    } catch (error) {
      failedTasks.push({sourcePath, targetPath, error});
    }
  }
  const success = tasks.length - failedTasks.length;
  if (r2CacheMisses.length / tasks.length > 0.1) {
    console.warn(
      `⚠️ Worker[${id}]: More than 10% of files had a different hash on R2 with the generation process.`
    );
  } else if (r2CacheMisses.length > 0) {
    console.log(
      `📤 Worker[${id}]: Updated the following files on R2: \n${r2CacheMisses.map(n => ` - ${n}`).join('\n')}`
    );
  }
  const cacheHits = success - cacheMisses.length;
  console.log(
    `📈 Worker[${id}]: Cache stats: ${cacheHits} hits, ${cacheMisses.length} misses (${((cacheMisses.length / success) * 100).toFixed(1)}% miss rate)`
  );

  if (cacheMisses.length / tasks.length > 0.1) {
    console.warn(`⚠️ Worker[${id}]: More than 10% cache miss rate during build.`);
  } else if (cacheMisses.length > 0) {
    console.log(
      `❇️ Worker[${id}]: Updated cache for the following files: \n${cacheMisses.map(n => ` - ${n}`).join('\n')}`
    );
  }

  return {
    id,
    success,
    failedTasks,
    usedCacheFiles,
  };
}

async function doWork(work) {
  parentPort.postMessage(await processTaskList(work));
}

if (isMainThread) {
  await createWork();
} else {
  await doWork(workerData);
}
