import { getDataOrPanic } from "../helpers";

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

  const component = require.resolve(`../../templates/api.tsx`);
  data.allApiDoc.nodes.map((node: any) => {
    actions.createPage({
      path: node.fields.slug,
      component,
      context: {
        id: node.id,
        title: node.title,
      },
    });
  });
};
