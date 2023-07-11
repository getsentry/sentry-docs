import {GatsbyNode} from 'gatsby';

import {getDataOrPanic} from '../helpers';

type CreatePageArgs = Parameters<NonNullable<GatsbyNode['createPages']>>[0];

export const createApiPages = async ({actions, graphql, reporter}: CreatePageArgs) => {
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
};
