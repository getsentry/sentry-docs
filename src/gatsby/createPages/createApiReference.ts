import {GatsbyNode} from 'gatsby';

import {getChild, getDataOrPanic} from '../helpers';

type CreatePageArgs = Parameters<GatsbyNode['createPages']>[0];

export const createApiReference = async ({
  actions,
  graphql,
  reporter,
}: CreatePageArgs) => {
  const data = await getDataOrPanic(
    `
      query {
        allFile(filter: {absolutePath: {}, relativePath: {in: ["permissions.mdx", "auth.mdx", "index.mdx", "requests.mdx", "pagination.mdx", "ratelimits.mdx"]}, dir: {regex: "/api/"}}) {
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

  const component = require.resolve(`../../templates/doc.tsx`);
  data.allFile.nodes.forEach((node: any) => {
    const child = getChild(node);
    if (child && child.fields) {
      actions.createPage({
        path: `api${child.fields.slug}`,
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
