import { getDataOrPanic } from "../helpers";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
      query {
        allOpenApi {
          nodes {
            id
            path {
              operationId
              readableUrl
            }
          }
        }
      }
    `,
    graphql,
    reporter
  );

  const component = require.resolve(`../../templates/apiPage.tsx`);
  await Promise.all(
    data.allOpenApi.nodes.map(async node => {
      actions.createPage({
        path: `${node.path.readableUrl}`,
        component,
        context: {
          id: node.id,
          title: node.path.operationId,
          notoc: true
        },
      });
    })
  );
};
