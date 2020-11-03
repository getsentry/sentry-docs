import {
  Response,
  ResponseContent,
  DeRefedOpenAPI,
  OpenApiPath,
  RequestBody,
} from "./types";

export const sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  pluginOptions
) => {
  const { createNode } = actions;

  let content = null;
  try {
    content = await pluginOptions.resolve();
  } catch (error) {
    console.warn(`There was an error resolving spec: `, error);
  }

  if (content === null) {
    return;
  }
  try {
    const parseContent = (): DeRefedOpenAPI => {
      try {
        return JSON.parse(content);
      } catch (error) {
        return content;
      }
    };

    const parsedContent = parseContent();

    var data: OpenApiPath[] =
      parsedContent.paths &&
      Object.keys(parsedContent.paths).reduce((acc, apiPath) => {
        let result = Object.entries(parsedContent.paths[apiPath]).map(
          ([method, rest]) => {
            const methodPath = parsedContent.paths[apiPath][method];

            let readableUrl =
              `/api/` +
              `${methodPath["tags"][0]}/${methodPath["operationId"]}/`
                .replace(/[^a-zA-Z0-9/ ]/g, "")
                .trim()
                .replace(/\s/g, "-")
                .toLowerCase();

            let responses: Response[] =
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
                            acc["content_type"] = content_type;
                            return acc;
                          },
                          {} as ResponseContent
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
                        acc["content_type"] = content_type;
                        return acc;
                      },
                      {} as RequestBody
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

export const onCreateNode = async ({
  node,
  actions,
  createNodeId,
  createContentDigest,
}) => {
  if (node.internal.type === "openAPI") {
    const descriptionNode = {
      id: createNodeId(`openApiPathDescription-${node.id}`),
      parent: node.id,
      children: [],
      internal: {
        type: "openApiPathDescription",
        content: node.path.description,
        mediaType: "text/markdown",
        contentDigest: createContentDigest(node.path.description),
      },
    };
    actions.createNode(descriptionNode);
    actions.createParentChildLink({
      parent: node,
      child: descriptionNode,
    });

    node.path.parameters.map((param, index) => {
      const paramNode = {
        id: createNodeId(`openApiPathParameter-${node.id}-${index}`),
        parent: node.id,
        children: [],
        ...param,
        internal: {
          type: "openApiPathParameter",
          content: param.description,
          mediaType: "text/markdown",
          contentDigest: createContentDigest(param),
        },
      };
      actions.createNode(paramNode);
      actions.createParentChildLink({
        parent: node,
        child: paramNode,
      });
    })
  }
};
