import { getChild, getDataOrPanic } from "../helpers";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
      query {
        allFile(filter: { sourceInstanceName: { eq: "docs" } }) {
          nodes {
            id
            childMarkdownRemark {
              frontmatter {
                title
                description
                draft
                noindex
                sidebar_order
                sidebar_title
                redirect_from
                keywords
              }
              fields {
                slug
                legacy
              }
              excerpt(pruneLength: 5000)
            }
            childMdx {
              frontmatter {
                title
                description
                draft
                noindex
                sidebar_order
                sidebar_title
                redirect_from
                keywords
              }
              fields {
                slug
                legacy
              }
              excerpt(pruneLength: 5000)
            }
          }
        }
      }
    `,
    graphql,
    reporter
  );

  const component = require.resolve(`../../templates/internal-doc.tsx`);
  data.allFile.nodes.map((node: any) => {
    const child = getChild(node);
    if (child && child.fields) {
      actions.createPage({
        path: child.fields.slug,
        component,
        context: {
          excerpt: child.excerpt,
          ...child.frontmatter,
          id: node.id,
          legacy: child.fields.legacy,
        },
      });
    }
  });
};
