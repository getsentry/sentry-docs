#!/usr/bin/env node
/* eslint-disable no-console */
import {ListObjectsV2Command, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {selectAll} from 'hast-util-select';
import {createHash} from 'node:crypto';
import {createReadStream, createWriteStream, existsSync} from 'node:fs';
import {mkdir, opendir, readFile, rm, writeFile} from 'node:fs/promises';
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
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import {unified} from 'unified';
import {remove} from 'unist-util-remove';

const CACHE_COMPRESS_LEVEL = 4;
const R2_BUCKET = 'sentry-docs';
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

function taskFinishHandler({id, success, failedTasks}) {
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
  if (noCache) {
    console.log(`ℹ️ No cache directory found, this will take a while...`);
    await mkdir(CACHE_DIR, {recursive: true});
  }

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
      for (const {Key, ETag} of response.Contents) {
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
  workerPromises.push(
    processTaskList({
      id: workerTasks.length - 1,
      tasks: workerTasks[workerTasks.length - 1],
      cacheDir: CACHE_DIR,
      noCache,
    }).then(data => {
      if (taskFinishHandler(data)) {
        throw new Error(`Worker[${data.id}] had some errors.`);
      }
    })
  );

  await Promise.all(workerPromises);

  console.log(`📄 Generated ${numFiles} markdown files from HTML.`);
  console.log('✅ Markdown export generation complete!');
}

const md5 = data => createHash('md5').update(data).digest('hex');

async function genMDFromHTML(source, target, {cacheDir, noCache}) {
  const leanHTML = (await readFile(source, {encoding: 'utf8'}))
    // Remove all script tags, as they are not needed in markdown
    // and they are not stable across builds, causing cache misses
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  const cacheKey = md5(leanHTML);
  const cacheFile = path.join(cacheDir, cacheKey);
  if (!noCache) {
    try {
      const data = await text(
        compose(createReadStream(cacheFile), createBrotliDecompress())
      );
      await writeFile(target, data, {encoding: 'utf8'});

      return {cacheHit: true, data};
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.warn(`Error using cache file ${cacheFile}:`, err);
      }
    }
  }

  const data = String(
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
      .process(leanHTML)
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

  return {cacheHit: false, data};
}

async function processTaskList({id, tasks, cacheDir, noCache}) {
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
