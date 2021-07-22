import {
  standardSDKSlug,
  extrapolate,
  sentryAlgoliaIndexSettings,
} from "@sentry-internal/global-search";
import fs from "fs";
import { resolve, join } from "path";
import { parse } from "node-html-parser";
import { htmlToAlgoliaRecord } from "@sentry-internal/global-search";

const pageQuery = `{
    pages: allSitePage {
      nodes {
        id
        path
        context {
          draft
          title
          noindex
          keywords
          platform {
            name
          }
          guide {
            name
          }
        }
      }
    }
  }`;

const pub = resolve(process.cwd(), "public");

const flatten = async (pages: any[]) => {
  const records = (
    await Promise.all(
      pages
        .filter(
          ({ context }) =>
            context && !context.draft && !context.noindex && context.title
        )
        .map(async page => {
          // It's prohibitively difficult to query fully rendered html out of MDX even though it's the
          // preferred output format, due to performance and configuration problems.
          // Instead, we're pulling in the generated pages and parsing out the sections we care about.
          // This runs the risk of dirtier records but is much quicker and easier to work with.

          const { context, path } = page;
          const htmlFile = join(pub, path, "index.html");
          const src = (await fs.promises.readFile(htmlFile)).toString();
          const html = parse(src)
            .querySelector("#main")
            .toString();
          // https://github.com/getsentry/sentry-global-search#algolia-record-stategy
          let platforms = [];
          if (context.platform) {
            const { slug } = standardSDKSlug(context.platform.name);

            let fullSlug = slug;

            if (context.guide) {
              const { slug } = standardSDKSlug(context.guide.name);
              fullSlug += `.${slug}`;
            }
            platforms = extrapolate(fullSlug, ".");
          }

          const newRecords = htmlToAlgoliaRecord(html, {
            title: context.title,
            url: path,
            platforms,
            pathSegments: extrapolate(path, "/").map(x => `/${x}/`),
            keywords: context.keywords || [],
            legacy: context.legacy || false,
          });

          return newRecords;
        })
    )
  ).reduce((a, x) => {
    return [...a, ...x];
  }, []);

  return records;
};

const indexPrefix = process.env.GATSBY_ALGOLIA_INDEX_PREFIX;
if (!indexPrefix) {
  throw new Error("`GATSBY_ALGOLIA_INDEX_PREFIX` must be configured!");
}

export default [
  {
    query: pageQuery,
    transformer: ({ data }) => {
      flatten(data.pages.nodes);
      return [];
    },
    indexName: `${indexPrefix}docs`,
    settings: {
      ...sentryAlgoliaIndexSettings,
    },
  },
];
