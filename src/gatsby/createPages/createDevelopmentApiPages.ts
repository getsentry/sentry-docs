import { getDataOrPanic } from "./helpers";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
      query {
        allOpenApi {
          nodes {
            id
            paths {
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
      await Promise.all(
        node.paths.map(async p => {
          actions.createPage({
            path: `/development-api/${p.readableUrl}`,
            component,
            context: {
              ...p,
              title: p.operationId
            },
          });
        })
      );
    })
  );
};
