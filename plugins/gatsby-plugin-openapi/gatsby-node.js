exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions;

  let content = null;
  try {
    content = await pluginOptions.resolve();
  } catch (error) {
    console.warn(`There was an error resolving spec '${spec.name}': `, error);
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

    data.forEach(path => {
      let nodeContent = { ...parsedContent, path };
      delete nodeContent.paths;

      let apiNode = {
        ...nodeContent,
        id: createNodeId(`openAPI-${path.method}-${path.apiPath}`),
        children: [],
        parent: null,
        internal: {
          contentDigest: createContentDigest(nodeContent),
          type: "openAPI",
        },
      };

      createNode(apiNode);
    });
  } catch (error) {
    console.log(error);
  }
};
