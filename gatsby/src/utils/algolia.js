const pageQuery = `{
    pages: allFile(
      filter: {
        absolutePath: { regex: "/(pages|docs)/" },
      }
    ) {
      edges {
        node {
          objectID: id
          childMarkdownRemark {
            frontmatter {
              title
            }
            fields {
              slug
              gatsbyOnly
            }
            excerpt(pruneLength: 5000)
          }
          childMdx {
            frontmatter {
              title
            }
            fields {
              slug
              gatsbyOnly
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
        (childMarkdownRemark || childMdx) &&
        (childMarkdownRemark || childMdx).fields.gatsbyOnly
    )
    .map(({ node: { childMarkdownRemark, childMdx, objectID } }) => ({
      objectID,
      ...(childMarkdownRemark || childMdx).frontmatter,
      fields: (childMarkdownRemark || childMdx).fields,
      excerpt: (childMarkdownRemark || childMdx).excerpt
    }));

const settings = { attributesToSnippet: [`excerpt:20`] };

const indexPrefix = process.env.GATSBY_ALGOLIA_INDEX_PREFIX;
if (!indexPrefix) {
  throw new Error('`GATSBY_ALGOLIA_INDEX_PREFIX` must be configured!');
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
