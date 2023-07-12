import {GatsbyNode} from 'gatsby';

import {getDataOrPanic} from '../helpers';

type CreatePageArgs = Parameters<NonNullable<GatsbyNode['createPages']>>[0];

export const createApiDocPages = async ({actions, graphql, reporter}: CreatePageArgs) => {
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

  const component = require.resolve(`../../templates/apiDoc.tsx`);
  data.openApi.tags.forEach(node => {
    const name = node.x_sidebar_name || node.name;
    actions.createPage({
      path: `/api/${node.name.toLowerCase()}/`,
      component,
      context: {
        title: name,
        tag: node.name,
      },
    });
  });
};
