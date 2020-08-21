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
          }
        }
      }
    }
  }`;

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
      // score: child.legacy ? 0 : 1,
    }))
    .filter(n => !n.draft);

const settings = { attributesToSnippet: [`content:20`] };

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
