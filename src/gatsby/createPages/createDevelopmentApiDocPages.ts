import { getDataOrPanic } from "../helpers";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
      query {
        openApi {
          tags {
            name
            x_sidebar_name
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
      const name = node.x_sidebar_name || node.name;
      actions.createPage({
        path: `/development-api/${node.name.toLowerCase()}/`,
        component,
        context: {
          title: name,
          tag: name,
        },
      });
    })
  );
};
