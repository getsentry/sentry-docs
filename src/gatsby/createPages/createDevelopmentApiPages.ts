import { getDataOrPanic } from "./helpers";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
      query {
        allOpenApi {
          nodes {
            id
            path {
              description
              method
              operationId
              summary
              tags
              apiPath
              readableUrl
              parameters {
                schema {
                  type
                  format
                  enum
                }
                name
                in
                description
                required
              }
              responses {
                content {
                  content_type
                  example
                  schema
                }
                description
                status_code
              }
              requestBody {
                content {
                  content_type
                  schema
                }
                required
              }
              summary
              tags
              security {
                auth_token
              }
            }
          }
        }
      }
    `,
    graphql,
    reporter
  );

  const component = require.resolve(`../../templates/developmentAPI.js`);
  await Promise.all(
    data.allOpenApi.nodes.map(async node => {
      actions.createPage({
        path: `/development-api/${node.path.readableUrl}`,
        component,
        context: {
          id: node.id,
          title: node.path.operationId,
        },
      });
    })
  );
};
