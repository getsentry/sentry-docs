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
  return;
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
      workerTasks[workerIdx].push({
        sourcePath,
        targetPath,
        relativePath,
        r2Hash: existingFilesOnR2 ? existingFilesOnR2.get(relativePath) : null,
      });
      workerIdx = (workerIdx + 1) % numWorkers;
      numFiles++;
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

  // Generate hierarchical sitemaps
  const allPaths = workerTasks
    .flat()
    .map(task => task.relativePath)
    .filter(p => p !== 'index.md')
    .sort();

  // Root index.md - only top-level pages (no slashes in path)
  const topLevelPaths = allPaths.filter(p => !p.includes('/'));
  const rootSitemapContent = `# Sentry Documentation

Sentry is a developer-first application monitoring platform that helps you identify and fix issues in real-time. It provides error tracking, performance monitoring, session replay, and more across all major platforms and frameworks.

## Key Features

- **Error Monitoring**: Capture and diagnose errors with full stack traces, breadcrumbs, and context
- **Tracing**: Track requests across services to identify performance bottlenecks
- **Session Replay**: Watch real user sessions to understand what led to errors
- **Profiling**: Identify slow functions and optimize application performance
- **Crons**: Monitor scheduled jobs and detect failures
- **Logs**: Collect and analyze application logs in context

## Documentation Sections

${topLevelPaths
  .filter(p => p !== '_not-found.md')
  .map(p => `- [${p.replace(/\.md$/, '')}](${DOCS_ORIGIN}/${p})`)
  .join('\n')}

${
  process.env.NEXT_PUBLIC_DEVELOPER_DOCS
    ? `## Quick Links

- [Backend Development](${DOCS_ORIGIN}/backend.md) - Backend service architecture
- [Frontend Development](${DOCS_ORIGIN}/frontend.md) - Frontend development guide
- [SDK Development](${DOCS_ORIGIN}/sdk.md) - SDK development documentation
`
    : `## Quick Links

- [Platform SDKs](${DOCS_ORIGIN}/platforms.md) - Install Sentry for your language/framework
- [API Reference](${DOCS_ORIGIN}/api.md) - Programmatic access to Sentry
- [CLI](${DOCS_ORIGIN}/cli.md) - Command-line interface for Sentry operations
`
}`;

  const indexPath = path.join(OUTPUT_DIR, 'index.md');
  await writeFile(indexPath, rootSitemapContent, {encoding: 'utf8'});
  console.log(
    `📑 Generated root index.md with ${topLevelPaths.length} top-level sections`
  );

  // Append child page listings to section index pages
  // Group paths by their DIRECT parent (handling guides specially)
  const pathsByParent = new Map();
  for (const p of allPaths) {
    const parts = p.replace(/\.md$/, '').split('/');
    if (parts.length <= 1) continue;

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

  // Append child listings to parent index files
  let updatedCount = 0;
  const r2Uploads = [];
  for (const [parentPath, children] of pathsByParent) {
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

    // Only show "## Guides" section for platform index pages (e.g., platforms/javascript.md)
    // These are the only pages that have guide children (platforms/X/guides/Y.md)
    const isPlatformIndex =
      parentPath.startsWith('platforms/') && parentPath.split('/').length === 2; // e.g., "platforms/javascript.md"

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

    if (childSection) {
      const updatedContent = existingContent + childSection;
      await writeFile(parentFile, updatedContent, {encoding: 'utf8'});
      updatedCount++;

      // Collect R2 uploads needed (will be uploaded in parallel below)
      if (accessKeyId && secretAccessKey && existingFilesOnR2) {
        const fileHash = md5(updatedContent);
        const existingHash = existingFilesOnR2.get(parentPath);
        if (existingHash !== fileHash) {
          r2Uploads.push({parentPath, updatedContent});
        }
      }
    }
  }

  // Upload all modified section index files to R2 in parallel
  if (r2Uploads.length > 0) {
    const limit = pLimit(50);
    const s3Client = getS3Client();
    await Promise.all(
      r2Uploads.map(({parentPath, updatedContent}) =>
        limit(() => uploadToCFR2(s3Client, parentPath, updatedContent))
      )
    );
    console.log(`📤 Uploaded ${r2Uploads.length} section index files to R2`);
  }
  console.log(`📑 Added child page listings to ${updatedCount} section index files`);

  // Upload index.md to R2 if configured
  if (accessKeyId && secretAccessKey) {
    const s3Client = getS3Client();
    const indexHash = md5(rootSitemapContent);
    const existingHash = existingFilesOnR2?.get('index.md');
    if (existingHash !== indexHash) {
      await uploadToCFR2(s3Client, 'index.md', rootSitemapContent);
      console.log(`📤 Uploaded updated index.md to R2`);
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
