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
import {isVersioned} from '../src/versioning';

const ALGOLIA_SENTRY_DSN = process.env.ALGOLIA_SENTRY_DSN;
if (ALGOLIA_SENTRY_DSN) {
  Sentry.init({dsn: ALGOLIA_SENTRY_DSN});
}

const staticHtmlFilesPath = join(process.cwd(), '.next', 'server', 'app');

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const DOCS_INDEX_NAME = process.env.DOCS_INDEX_NAME;
const ALGOLIA_SKIP_ON_ERROR = process.env.ALGOLIA_SKIP_ON_ERROR === 'true';
// Dry run generates records but skips all Algolia API calls. Used by PR CI to exercise the
// build + indexing import graph without secrets or mutating the production index.
const DRY_RUN = process.env.ALGOLIA_DRY_RUN === 'true';

if (!DRY_RUN) {
  if (!ALGOLIA_APP_ID) {
    throw new Error('`ALGOLIA_APP_ID` env var must be configured in repo secrets');
  }
  if (!ALGOLIA_API_KEY) {
    throw new Error('`ALGOLIA_API_KEY` env var must be configured in repo secrets');
  }
  if (!DOCS_INDEX_NAME) {
    throw new Error('`DOCS_INDEX_NAME` env var must be configured in repo secrets');
  }
}

const index =
  ALGOLIA_APP_ID && ALGOLIA_API_KEY && DOCS_INDEX_NAME
    ? algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY).initIndex(DOCS_INDEX_NAME)
    : null;

const CONCURRENCY = 50;
// Pages are generated and uploaded in batches so peak heap stays flat as the corpus grows.
// Holding every record from every page in one array is what previously OOM'd the job: ~10k pages
// produce ~240k records, which blows past Node's default ~4GB old-space limit.
const UPLOAD_BATCH_PAGES = 500;
const DEFAULT_DRY_RUN_PAGE_LIMIT = 200;
// In dry-run we only need enough pages to exercise the build + import graph, not the full corpus.
// Raise it (ALGOLIA_DRY_RUN_PAGE_LIMIT) to load-test the full corpus without touching the index.
// A missing, non-numeric, or non-positive override falls back to the default: `slice(0, NaN)` and
// `slice(0, 0)` would silently process zero pages and report a green dry run that checked nothing.
const dryRunPageLimitOverride = Number.parseInt(
  process.env.ALGOLIA_DRY_RUN_PAGE_LIMIT ?? '',
  10
);
const DRY_RUN_PAGE_LIMIT =
  dryRunPageLimitOverride > 0 ? dryRunPageLimitOverride : DEFAULT_DRY_RUN_PAGE_LIMIT;
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

  const allPages = pageFrontMatters.filter(
    frontMatter =>
      !frontMatter.draft &&
      !frontMatter.noindex &&
      frontMatter.title &&
      // Versioned pages document superseded SDK majors and outrank the current
      // docs for the same query. They stay reachable via the version selector.
      !isVersioned(frontMatter.slug)
  );
  const pages = DRY_RUN ? allPages.slice(0, DRY_RUN_PAGE_LIMIT) : allPages;
  const uploadIndex = DRY_RUN ? null : index;
  console.log(
    `📄 Processing ${pages.length}${DRY_RUN ? ` of ${allPages.length} (dry-run cap)` : ''} pages in batches of ${UPLOAD_BATCH_PAGES} with concurrency ${CONCURRENCY}`
  );

  // Read the pre-existing objectIDs *before* uploading anything: record objectIDs are
  // auto-generated per run, so every run writes a fresh set and deletes the previous one.
  let existingRecordIds: string[] = [];
  if (uploadIndex) {
    existingRecordIds = await fetchExistingRecordIds(uploadIndex);
    console.log(
      `🔥 Found ${existingRecordIds.length} existing records in \`${DOCS_INDEX_NAME}\``
    );
    console.log(`🔥 Saving records to \`${DOCS_INDEX_NAME}\`...`);
  }

  const newRecordIDs = new Set<string>();
  let recordCount = 0;
  let cacheHits = 0;
  let cacheMisses = 0;
  let generateSeconds = 0;

  for (let offset = 0; offset < pages.length; offset += UPLOAD_BATCH_PAGES) {
    const batch = pages.slice(offset, offset + UPLOAD_BATCH_PAGES);

    const batchStart = performance.now();
    const batchResult = await generateAlgoliaRecords(batch);
    generateSeconds += (performance.now() - batchStart) / 1000;

    cacheHits += batchResult.cacheHits;
    cacheMisses += batchResult.cacheMisses;
    recordCount += batchResult.records.length;

    if (uploadIndex) {
      const saveResult = await uploadIndex.saveObjects(batchResult.records, {
        batchSize: 10000,
        autoGenerateObjectIDIfNotExist: true,
      });
      saveResult.objectIDs.forEach(id => newRecordIDs.add(id));
    }

    // `batchResult` is the only reference to this batch's records, so dropping it here lets the
    // GC reclaim them before the next batch is generated. This is what keeps peak heap flat.
    console.log(
      `   ↳ ${Math.min(offset + batch.length, pages.length)}/${pages.length} pages, ${recordCount} records`
    );
  }

  if (!DRY_RUN) {
    cleanupStaleCacheFiles();
  }

  console.log(
    `🔥 Generated ${recordCount} records from ${pages.length} pages in ${generateSeconds.toFixed(1)}s (cache: ${cacheHits} hits, ${cacheMisses} misses)`
  );

  Sentry.metrics.gauge('algolia.pages_total', pages.length, {attributes: metricTags});
  Sentry.metrics.gauge('algolia.records_total', recordCount, {attributes: metricTags});
  Sentry.metrics.distribution('algolia.generate_duration', generateSeconds, {
    attributes: metricTags,
    unit: 'second',
  });
  Sentry.metrics.gauge('algolia.cache_hits', cacheHits, {attributes: metricTags});
  Sentry.metrics.gauge('algolia.cache_misses', cacheMisses, {attributes: metricTags});

  if (!uploadIndex) {
    console.log(`🧪 Dry run: generated ${recordCount} records, skipping Algolia upload`);
  } else {
    console.log(`🔥 Saved ${newRecordIDs.size} records`);

    const recordsToDelete = existingRecordIds.filter(id => !newRecordIDs.has(id));
    if (recordsToDelete.length > 0) {
      console.log(`🔥 Deleting ${recordsToDelete.length} stale records...`);
      await uploadIndex.deleteObjects(recordsToDelete);
    }

    if (!isDeveloperDocs) {
      await uploadIndex.setSettings({
        ...sentryAlgoliaIndexSettings,
        searchableAttributes: [
          'unordered(title)',
          'unordered(section)',
          'unordered(keywords)',
          'text',
        ],
        ranking: [
          'filters',
          'typo',
          'words',
          'attribute',
          'exact',
          'proximity',
          'desc(sectionRank)',
          'asc(position)',
          'asc(popularity)',
        ],
      });
    }
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

  return {records: results.flat(), cacheHits, cacheMisses};
}

// Must run only after every batch has been generated, otherwise pages from later batches would
// still look unused and get their cache files deleted. Skipped in dry-run: we only process a
// subset of pages there, so most cache files would look "stale" and poison the shared cache.
function cleanupStaleCacheFiles() {
  const allFiles = fs.readdirSync(CACHE_DIR);
  const stale = allFiles.filter(f => !usedCacheFiles.has(f));
  for (const f of stale) {
    fs.unlinkSync(join(CACHE_DIR, f));
  }
  if (stale.length > 0) {
    console.log(`🧹 Cleaned up ${stale.length} stale cache files`);
  }
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

const PRODUCT_DOC_PREFIXES = [
  'product/',
  'concepts/',
  'cli/',
  'guides/',
  'integrations/',
];

const getPopularity = (
  slug: string,
  sdk: string | undefined,
  framework: string | undefined
) => {
  if (sdk && frameworkPopularity[sdk]) {
    return frameworkPopularity[sdk];
  }
  if (framework && frameworkPopularity[framework]) {
    return frameworkPopularity[framework];
  }
  if (PRODUCT_DOC_PREFIXES.some(prefix => slug.startsWith(prefix))) {
    return 0;
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
      ...(!isDeveloperDocs && {popularity: getPopularity(pageFm.slug, sdk, framework)}),
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
    if (ALGOLIA_SKIP_ON_ERROR) {
      console.error(error);
      return {records: [], cached: false};
    }
    throw error;
  }
}
