import {getDataOrPanic} from '../helpers';

async function main({actions, graphql, reporter}) {
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
  data.allOpenApi.nodes.forEach(node => {
    actions.createPage({
      path: `${node.path.readableUrl}`,
      component,
      context: {
        id: node.id,
        title: node.path.operationId,
        notoc: true,
      },
    });
  });
}

export default main;
