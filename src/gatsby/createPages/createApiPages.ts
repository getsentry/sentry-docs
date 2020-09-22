import { getChild, getDataOrPanic } from "../helpers";

export default async ({ actions, graphql, reporter }) => {
  async function createApiPages() {
    // create normal docs
    const data = await getDataOrPanic(
      `
      query {
        allFile(filter: { sourceInstanceName: { eq: "api" } }) {
          nodes {
            id
            childMarkdownRemark {
              frontmatter {
                title
                description
                draft
                noindex
                sidebar_order
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

    const component = require.resolve(`../../templates/apiDoc.tsx`);
    data.allFile.nodes.map((node: any) => {
      const child = getChild(node);
      if (child && child.fields) {
        actions.createPage({
          path: `/api${child.fields.slug}`,
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
  }

  async function createApiEndpoints() {
    // create endpoint pages
    const data = await getDataOrPanic(
      `
      query {
        allApiEndpoint {
          nodes {
            id
            title
            fields {
              slug
            }
          }
        }
      }
    `,
      graphql,
      reporter
    );

    const component = require.resolve(`../../templates/apiEndpoint.tsx`);
    data.allApiEndpoint.nodes.map((node: any) => {
      actions.createPage({
        path: node.fields.slug,
        component,
        context: {
          id: node.id,
          title: node.title,
        },
      });
    });
  }

  await createApiPages();
  await createApiEndpoints();
};
