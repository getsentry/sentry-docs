import {
  extrapolate,
  htmlToAlgoliaRecord,
  sentryAlgoliaIndexSettings,
  standardSDKSlug,
} from '@sentry-internal/global-search';
import algoliasearch, {SearchIndex} from 'algoliasearch';
import fs from 'fs';
import pLimit from 'p-limit';
import {join} from 'path';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';

import {getDevDocsFrontMatter, getDocsFrontMatter} from '../src/mdx';
import {FrontMatter} from '../src/types';

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

indexAndUpload();
async function indexAndUpload() {
  const startTime = performance.now();

  const pageFrontMatters = await (isDeveloperDocs
    ? getDevDocsFrontMatter()
    : getDocsFrontMatter());

  const pages = pageFrontMatters.filter(
    frontMatter => !frontMatter.draft && !frontMatter.noindex && frontMatter.title
  );
  console.log('📄 Processing %d pages with concurrency %d', pages.length, CONCURRENCY);

  const records = await generateAlgoliaRecords(pages);
  const generateTime = performance.now();
  console.log(
    '🔥 Generated %d records from %d pages in %.1fs',
    records.length,
    pages.length,
    (generateTime - startTime) / 1000
  );

  const existingRecordIds = await fetchExistingRecordIds(index);
  console.log(
    '🔥 Found %d existing records in `%s`',
    existingRecordIds.length,
    DOCS_INDEX_NAME
  );

  console.log('🔥 Saving records to `%s`...', DOCS_INDEX_NAME);
  const saveResult = await index.saveObjects(records, {
    batchSize: 10000,
    autoGenerateObjectIDIfNotExist: true,
  });
  const newRecordIDs = new Set(saveResult.objectIDs);
  console.log('🔥 Saved %d records', newRecordIDs.size);

  const recordsToDelete = existingRecordIds.filter(id => !newRecordIDs.has(id));
  if (recordsToDelete.length > 0) {
    console.log('🔥 Deleting %d stale records...', recordsToDelete.length);
    await index.deleteObjects(recordsToDelete);
  }

  if (!isDeveloperDocs) {
    await index.setSettings(sentryAlgoliaIndexSettings);
  }

  const totalTime = performance.now();
  console.log('✅ Done in %.1fs', (totalTime - startTime) / 1000);
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

async function generateAlgoliaRecords(pages: FrontMatter[]) {
  const limit = pLimit(CONCURRENCY);
  const results = await Promise.all(pages.map(fm => limit(() => getRecords(fm))));
  return results.flat();
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

async function getRecords(pageFm: FrontMatter) {
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
    const pageRecords = await htmlToAlgoliaRecord(
      html,
      {
        title: pageFm.title,
        url: '/' + pageFm.slug + '/',
        pathSegments: extrapolate(pageFm.slug, '/').map(x => `/${x}/`),
        keywords: pageFm.keywords,
        sdk,
        framework,
        ...(!isDeveloperDocs && {popularity: getPopularity(sdk, framework)}),
      },
      '#main'
    );

    return pageRecords;
  } catch (e) {
    const error = new Error(`🔴 Error processing ${pageFm.slug}: ${e.message}`, {
      cause: e,
    });
    if (ALOGOLIA_SKIP_ON_ERROR) {
      console.error(error);
      return [];
    }
    throw error;
  }
}
