const pageQuery = `{
    pages: allFile(
      filter: {
        sourceInstanceName: {in: ["docs"]}
      }
    ) {
      edges {
        node {
          objectID: id
          childMarkdownRemark {
            frontmatter {
              title
              draft
            }
            fields {
              slug
            }
            excerpt(pruneLength: 5000)
          }
          childMdx {
            frontmatter {
              title
              draft
            }
            fields {
              slug
            }
            excerpt(pruneLength: 5000)
          }
        }
      }
    }
  }`;

const flatten = arr =>
  arr
    .filter(
      ({ node: { childMarkdownRemark, childMdx } }) =>
        childMarkdownRemark || childMdx
    )
    .map(({ node: { childMarkdownRemark, childMdx, objectID } }) => ({
      objectID,
      ...(childMarkdownRemark || childMdx).frontmatter,
      url: (childMarkdownRemark || childMdx).fields.slug,
      content: (childMarkdownRemark || childMdx).excerpt
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
    settings
  }
];

module.exports = queries;
