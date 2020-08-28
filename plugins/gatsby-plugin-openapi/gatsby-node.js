exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, schema, ...otherfunctions },
  pluginOptions
) => {
  const { createNode, createParentChildLink, createTypes } = actions;

  console.log("plugin-openapi", otherfunctions);

  let content = null;
  try {
    content = await pluginOptions.resolve();
  } catch (exception) {
    console.warn(
      `There was an error resolving spec '${spec.name}', ${exception.name} ${exception.message} ${exception.stack}`
    );
  }

  if (content === null) {
    return;
  }
  try {
    const parseContent = () => {
      try {
        return JSON.parse(content);
      } catch (error) {
        return content;
      }
    };

    const parsedContent = parseContent();

    Object.entries(parsedContent).map(([keys, values]) => {
      console.log(keys);
    });

    // const typeDefs = [
    //   `
    // type OpenApiInfo {
    //   title: String
    //   description: String
    //   termsOfService: String
    //   contact: OpenApiInfoContact
    //   license: OpenApiInfoLicense
    //   version: String
    // }

    // type OpenApiInfoContact {
    //   email: String
    // }

    // type OpenApiInfoLicense {
    //   name: String
    //   url: String
    // }

    // `,
    //   schema.buildObjectType({
    //     name: "OpenApi",
    //     fields: {
    //       openapi: {
    //         type: "String",
    //         resolve: source => source["openapi"],
    //       },
    //       info: {
    //         type: "OpenApiInfo",
    //         resolve: source => source["info"],
    //       },
    //       // servers: {
    //       //   type: "OpenApiServers",
    //       //   fields: {
    //       //     url: "String"
    //       //   },
    //       //   resolve: source => source["servers"]
    //       // },
    //       // tags: {
    //       //   type: "OpenApiTags",
    //       //   resolve: source => source["tags"]
    //       // },
    //     },
    //     interfaces: ["Node"],
    //   }),
    // ];
    // createTypes(typeDefs);

    const readableUrls = {};

    var data =
      parsedContent.paths &&
      Object.keys(parsedContent.paths).reduce((acc, apiPath) => {
        let result = Object.entries(parsedContent.paths[apiPath]).map(
          ([method, rest]) => {
            const methodPath = parsedContent.paths[apiPath][method];

            let readableUrl = methodPath["operationId"]
              .replace(/(?:(the|a|an) +)/g, "")
              .trim()
              .replace(/\s/g, "-")
              .toLowerCase();

            let responses =
              (methodPath["responses"] &&
                Object.entries(methodPath["responses"]).map(
                  ([status_code, responses_rest]) => ({
                    ...responses_rest,
                    content:
                      (responses_rest.content &&
                        Object.entries(responses_rest.content).reduce(
                          (acc, [content_type, content_values]) => {
                            Object.entries(content_values).map(
                              ([k, v]) => (acc[k] = JSON.stringify(v, null, 2))
                            );
                            acc["content-type"] = content_type;
                            return acc;
                          },
                          {}
                        )) ||
                      null,
                    status_code,
                  })
                )) ||
              null;

            let requestBody =
              (methodPath["requestBody"] && {
                ...methodPath["requestBody"],
                content:
                  (methodPath["requestBody"]["content"] &&
                    Object.entries(methodPath["requestBody"]["content"]).reduce(
                      (acc, [content_type, content_values]) => {
                        Object.entries(content_values).map(
                          ([k, v]) => (acc[k] = JSON.stringify(v, null, 2))
                        );
                        acc["content-type"] = content_type;
                        return acc;
                      },
                      {}
                    )) ||
                  null,
              }) ||
              null;

            return {
              ...rest,
              method,
              apiPath,
              responses,
              requestBody,
              readableUrl,
            };
          }
        );

        acc.push(...result);
        return acc;
      }, []);

    const rootNode = {
      ...parsedContent,
      paths: data,
      id: createNodeId(`openAPI-root`),
      children: [],
      parent: null,
      internal: {
        contentDigest: createContentDigest("openAPI"),
        type: "openAPI",
      },
    };

    createNode(rootNode);
  } catch (error) {
    console.log(error);
  }
};
