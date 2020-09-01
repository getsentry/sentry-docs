const { standardSDKSlug } = require("sentry-global-search");

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
            platform {
              name
            }
          }
        }
      }
    }
  }`;

const extrapolate = (str, separator) => {
  const segments = str.split(separator).filter(Boolean);
  const fragments = segments.map((segment, i, array) =>
    array.slice(0, i + 1).join(separator)
  );
  return fragments;
};

const flatten = arr =>
  arr
    .filter(
      ({ node: { context } }) =>
        context && !context.draft && !context.noindex && context.title
    )
    .map(({ node: { objectID, context, path } }) => ({
      objectID,
      title: context.title,
      url: path,
      content: context.excerpt,

      // https://github.com/getsentry/sentry-global-search#sorting-by-a-platform
      platforms: context.platform
        ? extrapolate(standardSDKSlug(context.platform.name).slug, ".")
        : [],

      // https://github.com/getsentry/sentry-global-search#sorting-by-path
      pathSegments: extrapolate(path, "/").map(x => `/${x}/`),

      // https://github.com/getsentry/sentry-global-search#sorting-by-legacy
      legacy: context.legacy || false,
    }))
    .filter(n => !n.draft);

const settings = {
  attributesToSnippet: [`content:20`],
  attributesForFaceting: ["platforms", "pathSegments", "legacy"],
  searchableAttributes: ["content", "title"],
};

const indexPrefix = process.env.GATSBY_ALGOLIA_INDEX_PREFIX;
if (!indexPrefix) {
  throw new Error("`GATSBY_ALGOLIA_INDEX_PREFIX` must be configured!");
}

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => flatten(data.pages.edges),
    indexName: `${indexPrefix}docs`,
    settings,
  },
];

module.exports = queries;
