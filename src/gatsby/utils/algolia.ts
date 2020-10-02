import {
  standardSDKSlug,
  extrapolate,
  sentryAlgoliaIndexSettings,
} from "@sentry-internal/global-search";

const pageQuery = `{
    pages: allSitePage {
      edges {
        node {
          objectID: id
          path
          context {
            draft
            title
            excerpt
            noindex
            keywords
            platform {
              name
            }
          }
        }
      }
    }
  }`;

const flatten = (arr: any[]) =>
  arr
    .filter(
      ({ node: { context } }) =>
        context && !context.draft && !context.noindex && context.title
    )
    .map(({ node: { objectID, context, path } }) => {
      // https://github.com/getsentry/sentry-global-search#algolia-record-stategy
      let platforms = [];
      if (context.platform) {
        const { slug } = standardSDKSlug(context.platform.name);
        platforms = extrapolate(slug, ".");
      }

      return {
        objectID,
        title: context.title,
        section: context.title,
        url: path,
        // Do not remove until the global lib is in sentry. Removing will break sentry.
        content: context.excerpt,
        text: context.excerpt,
        platforms,
        pathSegments: extrapolate(path, "/").map(x => `/${x}/`),
        keywords: context.keywords || [],
        legacy: context.legacy || false,
      };
    });

const indexPrefix = process.env.GATSBY_ALGOLIA_INDEX_PREFIX;
if (!indexPrefix) {
  throw new Error("`GATSBY_ALGOLIA_INDEX_PREFIX` must be configured!");
}

export default [
  {
    query: pageQuery,
    transformer: ({ data }) => flatten(data.pages.edges),
    indexName: `${indexPrefix}docs`,
    settings: {
      ...sentryAlgoliaIndexSettings,

      // Do not remove until the global lib is in sentry
      attributesToSnippet: [`content:15`, `text:15`],
      searchableAttributes: ["section", "title", "content", "text"],
      attributesToHighlight: ["section", "title", "content"],
      attributesToRetrieve: ["section", "title", "content", "text", "url"],
    },
  },
];
