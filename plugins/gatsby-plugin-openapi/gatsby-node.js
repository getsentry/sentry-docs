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
    const parsedContent = (() => {
      try {
        return JSON.parse(content);
      } catch (error) {
        return content;
      }
    })();

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

    var data =
      parsedContent.paths &&
      Object.keys(parsedContent.paths).reduce((acc, path) => {
        let result = Object.entries(parsedContent.paths[path]).map(
          ([method, rest]) => {
            const methodPath = parsedContent.paths[path][method];

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
                              ([k, v]) => (acc[k] = JSON.stringify(v))
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
                          ([k, v]) => (acc[k] = JSON.stringify(v))
                        );
                        acc["content-type"] = content_type;
                        return acc;
                      },
                      {}
                    )) ||
                  null,
              }) ||
              null;

            return { ...rest, method, path, responses, requestBody };
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

  function transformObject(obj, id, type) {
    const apiNode = {
      ...obj,
      id,
      children: [],
      parent: node.id,
      internal: {
        contentDigest: createContentDigest(obj),
        type,
      },
    };
    createNode(apiNode);
    createParentChildLink({ parent: node, child: apiNode });
  }

  // if (node.internal.mediaType !== `text/yaml`) {
  //   return
  // }

  // const content = await loadNodeContent(node)
  // const parsedContent = jsYaml.load(content)

  // if (_.isArray(parsedContent)) {
  //   parsedContent.forEach((obj, i) => {
  //     transformObject(
  //       obj,
  //       obj.id ? obj.id : createNodeId(`${node.id} [${i}] >>> YAML`),
  //       getType({ node, object: obj, isArray: true })
  //     )
  //   })
  // } else if (_.isPlainObject(parsedContent)) {
  //   transformObject(
  //     parsedContent,
  //     parsedContent.id ? parsedContent.id : createNodeId(`${node.id} >>> YAML`),
  //     getType({ node, object: parsedContent, isArray: false })
  //   )
  // }
};

// exports.onCreateNode = async (
//   { node, actions, loadNodeContent, createNodeId, createContentDigest },
//   pluginOptions
// ) => {
//   const { createNode, createParentChildLink } = actions;

//   console.log(node.internal.owner);
//   if (node.internal["owner"] === "gatsby-plugin-openapi") {
//     console.log("plugin-openapi");

//     let content = null;
//     try {
//       content = await pluginOptions.resolve();
//       // console.log(jsonText)
//     } catch (exception) {
//       console.warn(
//         `There was an error resolving spec '${spec.name}', ${exception.name} ${exception.message} ${exception.stack}`
//       );
//     }

//     if (content === null) {
//       return;
//     }
//     try {
//       const parsedContent = JSON.parse(content);
//       const infoNode = {
//         ...parsedContent["info"],
//         id: createNodeId(`info`),
//         children: [],
//         parent: node.id,
//         internal: {
//           contentDigest: createContentDigest("info"),
//           type: "info",
//         },
//       };
//       createNode(infoNode);
//       createParentChildLink({ parent: node, child: infoNode });
//     } catch (err) {
//       console.log(err);
//     }
//   }
// };
