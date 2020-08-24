import { getDataOrPanic } from "./helpers";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
      query {
        allApiDoc {
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

  const component = require.resolve(`../../templates/api.js`);
  await Promise.all(
    data.allApiDoc.nodes.map(async (node: any) => {
      actions.createPage({
        path: node.fields.slug,
        component,
        context: {
          id: node.id,
          title: node.title,
        },
      });
    })
  );
};
