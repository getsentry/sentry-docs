import * as Sentry from '@sentry/nextjs';
import {
  extrapolate,
  htmlToAlgoliaRecord,
  sentryAlgoliaIndexSettings,
  standardSDKSlug,
} from '@sentry-internal/global-search';
import algoliasearch, {SearchIndex} from 'algoliasearch';
import {createHash} from 'crypto';
import fs from 'fs';
import pLimit from 'p-limit';
import {join} from 'path';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';

import {getDevDocsFrontMatter, getDocsFrontMatter} from '../src/mdx';
import {FrontMatter} from '../src/types';

const ALGOLIA_SENTRY_DSN = process.env.ALGOLIA_SENTRY_DSN;
if (ALGOLIA_SENTRY_DSN) {
  Sentry.init({dsn: ALGOLIA_SENTRY_DSN});
}

const staticHtmlFilesPath = join(process.cwd(), '.next', 'server', 'app');

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const DOCS_INDEX_NAME = process.env.DOCS_INDEX_NAME;
const ALOGOLIA_SKIP_ON_ERROR = process.env.ALOGOLIA_SKIP_ON_ERROR === 'true';

if (!ALGOLIA_APP_ID) {
  throw new Error('`ALGOLIA_APP_ID` env var must be configured in repo secrets');
}
if (!ALGOLIA_API_KEY) {
  throw new Error('`ALGOLIA_API_KEY` env var must be configured in repo secrets');
}
if (!DOCS_INDEX_NAME) {
  throw new Error('`DOCS_INDEX_NAME` env var must be configured in repo secrets');
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const index = client.initIndex(DOCS_INDEX_NAME);

const CONCURRENCY = 50;
const CACHE_VERSION = 1;
const CACHE_DIR = join(process.cwd(), '.next', 'cache', 'algolia-records');

const docsType = isDeveloperDocs ? 'developer-docs' : 'user-docs';
const metricTags = {
  docs_type: docsType,
  commit_sha: process.env.GITHUB_SHA?.slice(0, 8) ?? 'local',
};

function md5(data: string): string {
  return createHash('md5').update(data).digest('hex');
}

indexAndUpload();
async function indexAndUpload() {
  const startTime = performance.now();

  fs.mkdirSync(CACHE_DIR, {recursive: true});

  const pageFrontMatters = await (isDeveloperDocs
    ? getDevDocsFrontMatter()
    : getDocsFrontMatter());

  const pages = pageFrontMatters.filter(
    frontMatter => !frontMatter.draft && !frontMatter.noindex && frontMatter.title
  );
  console.log(`📄 Processing ${pages.length} pages with concurrency ${CONCURRENCY}`);

  const {records, cacheHits, cacheMisses} = await generateAlgoliaRecords(pages);
  const generateTime = performance.now();
  const generateSeconds = (generateTime - startTime) / 1000;
  console.log(
    `🔥 Generated ${records.length} records from ${pages.length} pages in ${generateSeconds.toFixed(1)}s (cache: ${cacheHits} hits, ${cacheMisses} misses)`
  );

  Sentry.metrics.gauge('algolia.pages_total', pages.length, {attributes: metricTags});
  Sentry.metrics.gauge('algolia.records_total', records.length, {attributes: metricTags});
  Sentry.metrics.distribution('algolia.generate_duration', generateSeconds, {
    attributes: metricTags,
    unit: 'second',
  });
  Sentry.metrics.gauge('algolia.cache_hits', cacheHits, {attributes: metricTags});
  Sentry.metrics.gauge('algolia.cache_misses', cacheMisses, {attributes: metricTags});

  const existingRecordIds = await fetchExistingRecordIds(index);
  console.log(
    `🔥 Found ${existingRecordIds.length} existing records in \`${DOCS_INDEX_NAME}\``
  );

  console.log(`🔥 Saving records to \`${DOCS_INDEX_NAME}\`...`);
  const saveResult = await index.saveObjects(records, {
    batchSize: 10000,
    autoGenerateObjectIDIfNotExist: true,
  });
  const newRecordIDs = new Set(saveResult.objectIDs);
  console.log(`🔥 Saved ${newRecordIDs.size} records`);

  const recordsToDelete = existingRecordIds.filter(id => !newRecordIDs.has(id));
  if (recordsToDelete.length > 0) {
    console.log(`🔥 Deleting ${recordsToDelete.length} stale records...`);
    await index.deleteObjects(recordsToDelete);
  }

  if (!isDeveloperDocs) {
    await index.setSettings(sentryAlgoliaIndexSettings);
  }

  const totalSeconds = (performance.now() - startTime) / 1000;
  Sentry.metrics.distribution('algolia.total_duration', totalSeconds, {
    attributes: metricTags,
    unit: 'second',
  });
  console.log(`✅ Done in ${totalSeconds.toFixed(1)}s`);

  await Sentry.flush(5000);
}

async function fetchExistingRecordIds(algoliaIndex: SearchIndex) {
  const existingRecordIds = new Set<string>();
  await algoliaIndex.browseObjects({
    attributesToRetrieve: ['objectID'],
    batch: chunk => {
      chunk.forEach(record => {
        existingRecordIds.add(record.objectID);
      });
    },
  });
  return Array.from(existingRecordIds);
}

const usedCacheFiles = new Set<string>();

async function generateAlgoliaRecords(pages: FrontMatter[]) {
  const limit = pLimit(CONCURRENCY);
  let cacheHits = 0;
  let cacheMisses = 0;

  const results = await Promise.all(
    pages.map(fm =>
      limit(async () => {
        const {records: pageRecords, cached} = await getRecords(fm);
        if (cached) {
          cacheHits++;
        } else {
          cacheMisses++;
        }
        return pageRecords;
      })
    )
  );

  const allFiles = fs.readdirSync(CACHE_DIR);
  const stale = allFiles.filter(f => !usedCacheFiles.has(f));
  for (const f of stale) {
    fs.unlinkSync(join(CACHE_DIR, f));
  }
  if (stale.length > 0) {
    console.log(`🧹 Cleaned up ${stale.length} stale cache files`);
  }

  return {records: results.flat(), cacheHits, cacheMisses};
}

const frameworkPopularity: Record<string, number> = {
  nextjs: 1,
  react: 2,
  'react-native': 3,
  python: 4,
  laravel: 5,
  node: 6,
  vue: 7,
  ios: 8,
  angular: 9,
  nestjs: 10,
  django: 11,
  spring: 12,
  go: 13,
  ruby: 14,
  kotlin: 15,
  dart: 16,
  unity: 17,
};

const getPopularity = (sdk: string | undefined, framework: string | undefined) => {
  if (sdk && frameworkPopularity[sdk]) {
    return frameworkPopularity[sdk];
  }
  if (framework && frameworkPopularity[framework]) {
    return frameworkPopularity[framework];
  }
  return Number.MAX_SAFE_INTEGER;
};

async function getRecords(
  pageFm: FrontMatter
): Promise<{records: any[]; cached: boolean}> {
  let sdk: string | undefined;
  let framework: string | undefined;
  if (pageFm.slug.includes('platforms/')) {
    sdk = standardSDKSlug(pageFm.slug.split('/')[1])?.slug as string;
    framework = sdk;

    if (pageFm.slug.includes('/guides/')) {
      framework = standardSDKSlug(pageFm.slug.split('/')[3])?.slug as string;
    }
  }

  try {
    const htmlFile = join(staticHtmlFilesPath, pageFm.slug + '.html');
    const html = fs.readFileSync(htmlFile).toString();

    const meta = {
      title: pageFm.title,
      url: '/' + pageFm.slug + '/',
      pathSegments: extrapolate(pageFm.slug, '/').map(x => `/${x}/`),
      keywords: pageFm.keywords,
      sdk,
      framework,
      ...(!isDeveloperDocs && {popularity: getPopularity(sdk, framework)}),
    };

    const cacheFileName = `v${CACHE_VERSION}_${md5(html + JSON.stringify(meta))}.json`;
    const cacheFile = join(CACHE_DIR, cacheFileName);
    usedCacheFiles.add(cacheFileName);

    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      return {records: cached, cached: true};
    } catch {
      // cache miss
    }

    const pageRecords = await htmlToAlgoliaRecord(html, meta, '#main');

    try {
      fs.writeFileSync(cacheFile, JSON.stringify(pageRecords));
    } catch {
      // cache write failure is non-critical
    }

    return {records: pageRecords, cached: false};
  } catch (e) {
    const error = new Error(`🔴 Error processing ${pageFm.slug}: ${e.message}`, {
      cause: e,
    });
    if (ALOGOLIA_SKIP_ON_ERROR) {
      console.error(error);
      return {records: [], cached: false};
    }
    throw error;
  }
}
