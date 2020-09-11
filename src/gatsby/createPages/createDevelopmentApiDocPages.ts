import { getDataOrPanic } from "../helpers";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
      query {
        openApi {
          tags {
            name
          }
        }
      }
    `,
    graphql,
    reporter
  );

  const component = require.resolve(`../../templates/developmentApiDoc.tsx`);
  await Promise.all(
    data.openApi.tags.map(async (node: any) => {
      actions.createPage({
        path: `/development-api/${node.name.toLowerCase()}/`,
        component,
        context: {
          title: node.name,
          tag: node.name,
        },
      });
    })
  );
};
