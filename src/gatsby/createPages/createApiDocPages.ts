import {getDataOrPanic} from '../helpers';

async function main({actions, graphql, reporter}) {
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
  data.openApi.tags.forEach((node: any) => {
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
}

export default main;
