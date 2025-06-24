#!/usr/bin/env node
/* eslint-disable no-console */
import {selectAll} from 'hast-util-select';
import {createHash} from 'node:crypto';
import {createReadStream, createWriteStream, existsSync} from 'node:fs';
import {mkdir, opendir, readFile, rm} from 'node:fs/promises';
import {cpus} from 'node:os';
import * as path from 'node:path';
import {Readable} from 'node:stream';
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

function taskFinishHandler(data) {
  if (data.failedTasks.length === 0) {
    console.log(
      `💰 Worker[${data.id}]: Cache hits: ${data.cacheHits} (${Math.round((data.cacheHits / data.success) * 100)}%)`
    );
    console.log(`✅ Worker[${data.id}]: ${data.success} files successfully.`);
    return false;
  }
  console.error(`❌ Worker[${data.id}]: ${data.failedTasks.length} files failed:`);
  console.error(data.failedTasks);
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
      workerTasks[workerIdx].push({sourcePath, targetPath});
      workerIdx = (workerIdx + 1) % numWorkers;
      numFiles++;
    }
  }

  console.log(`📄 Converting ${numFiles} files with ${numWorkers} workers...`);

  const selfPath = fileURLToPath(import.meta.url);
  const workerPromises = new Array(numWorkers - 1).fill(null).map((_, id) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(selfPath, {
        workerData: {id, noCache, cacheDir: CACHE_DIR, tasks: workerTasks[id]},
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
      noCache,
      cacheDir: CACHE_DIR,
      tasks: workerTasks[workerTasks.length - 1],
      id: workerTasks.length - 1,
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
  const text = await readFile(source, {encoding: 'utf8'});
  const hash = md5(text);
  const cacheFile = path.join(cacheDir, hash);
  if (!noCache) {
    try {
      const {resolve, reject, promise} = Promise.withResolvers();
      const reader = createReadStream(cacheFile);
      reader.on('error', reject);
      reader.pause();

      const writer = createWriteStream(target, {
        encoding: 'utf8',
      });
      writer.on('error', reject);

      const decompressor = createBrotliDecompress();
      const stream = reader.pipe(decompressor).pipe(writer);
      stream.on('error', reject);
      stream.on('finish', resolve);

      reader.resume();

      await promise;
      return true;
    } catch {
      // pass
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
      .process(text)
  );
  const reader = Readable.from(data);
  reader.pause();

  const {resolve, reject, promise} = Promise.withResolvers();
  const writer = createWriteStream(target, {
    encoding: 'utf8',
  });
  writer.on('error', reject);

  const compressor = createBrotliCompress({
    chunkSize: 32 * 1024,
    params: {
      [zlibConstants.BROTLI_PARAM_MODE]: zlibConstants.BROTLI_MODE_TEXT,
      [zlibConstants.BROTLI_PARAM_QUALITY]: CACHE_COMPRESS_LEVEL,
      [zlibConstants.BROTLI_PARAM_SIZE_HINT]: data.length,
    },
  });
  const cacheWriter = createWriteStream(cacheFile);

  const writeStream = reader.pipe(writer);
  writeStream.on('error', reject);
  writeStream.on('finish', resolve);

  const cacheWriteStream = reader.pipe(compressor).pipe(cacheWriter);
  cacheWriteStream.on('error', err => console.warn('Error writing cache file:', err));
  reader.resume();

  await promise;
  return false;
}

async function processTaskList({id, tasks, cacheDir, noCache}) {
  const failedTasks = [];
  let cacheHits = 0;
  for (const {sourcePath, targetPath} of tasks) {
    try {
      cacheHits += await genMDFromHTML(sourcePath, targetPath, {
        cacheDir,
        noCache,
      });
    } catch (error) {
      failedTasks.push({sourcePath, targetPath, error});
    }
  }
  return {id, success: tasks.length - failedTasks.length, failedTasks, cacheHits};
}

async function doWork(work) {
  parentPort.postMessage(await processTaskList(work));
}

if (isMainThread) {
  await createWork();
} else {
  await doWork(workerData);
}
