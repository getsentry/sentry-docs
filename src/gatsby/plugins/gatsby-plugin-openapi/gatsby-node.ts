import {
  DeRefedOpenAPI,
  OpenApiPath,
  RequestBody,
  RequestBodySchema,
  Response,
  ResponseContent,
} from './types';

export const sourceNodes = async (
  {actions, createNodeId, createContentDigest},
  pluginOptions
) => {
  const {createNode} = actions;
  let content = null;
  try {
    content = await pluginOptions.resolve();
  } catch (error) {
    // eslint-disable-next-line no-console
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

    parsedContent.tags.forEach(tag => {
      if (tag['x-display-description']) {
        createNode({
          name: tag.name,
          id: createNodeId(`APIDescription-${tag.name}`),
          children: [],
          parent: null,
          internal: {
            type: 'APIDescription',
            content: tag.description,
            mediaType: 'text/markdown',
            contentDigest: createContentDigest(tag.description),
          },
        });
      }
    });
    const data: OpenApiPath[] =
      parsedContent.paths &&
      Object.keys(parsedContent.paths).reduce((acc, apiPath) => {
        const result = Object.entries(parsedContent.paths[apiPath]).map(
          ([method, rest]) => {
            const methodPath = parsedContent.paths[apiPath][method];

            const readableUrl =
              `/api/` +
              `${methodPath.tags[0]}/${methodPath.operationId}/`
                .replace(/[^a-zA-Z0-9/ ]/g, '')
                .trim()
                .replace(/\s/g, '-')
                .toLowerCase();

            const responses: Response[] =
              (methodPath.responses &&
                Object.entries(methodPath.responses).map(
                  ([status_code, responses_rest]) => ({
                    ...responses_rest,
                    content:
                      (responses_rest.content &&
                        Object.entries(responses_rest.content).reduce(
                          (a, [content_type, content_values]) => {
                            Object.entries(content_values).map(
                              ([k, v]) => (a[k] = JSON.stringify(v, null, 2))
                            );
                            a.content_type = content_type;
                            return a;
                          },
                          {} as ResponseContent
                        )) ||
                      null,
                    status_code,
                  })
                )) ||
              null;

            const requestBody =
              (methodPath.requestBody && {
                ...methodPath.requestBody,
                content:
                  (methodPath.requestBody.content &&
                    Object.entries(methodPath.requestBody.content).reduce(
                      (a, [content_type, content_values]) => {
                        Object.entries(content_values).map(
                          ([k, v]) => (a[k] = JSON.stringify(v, null, 2))
                        );
                        // @ts-ignore(evanpurkhiser): This seems wrong but I
                        // don't really want to mess with it
                        a.content_type = content_type;
                        return a;
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
      const nodeContent = {...parsedContent, path};
      delete nodeContent.paths;

      const apiNode = {
        ...nodeContent,
        id: createNodeId(`openAPI-${path.method}-${path.apiPath}`),
        children: [],
        parent: null,
        internal: {
          contentDigest: createContentDigest(nodeContent),
          type: 'openAPI',
        },
      };

      createNode(apiNode);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const onCreateNode = ({node, actions, createNodeId, createContentDigest}) => {
  if (node.internal.type === 'openAPI') {
    const descriptionNode = {
      id: createNodeId(`openApiPathDescription-${node.id}`),
      parent: node.id,
      children: [],
      internal: {
        type: 'openApiPathDescription',
        content: node.path.description,
        mediaType: 'text/markdown',
        contentDigest: createContentDigest(node.path.description),
      },
    };
    actions.createNode(descriptionNode);
    actions.createParentChildLink({
      parent: node,
      child: descriptionNode,
    });

    node.path.parameters.forEach((param, index) => {
      const paramNode = {
        id: createNodeId(`openApiPathParameter-${node.id}-${index}`),
        parent: node.id,
        children: [],
        ...param,
        internal: {
          type: 'openApiPathParameter',
          content: param.description,
          mediaType: 'text/markdown',
          contentDigest: createContentDigest(param),
        },
      };
      actions.createNode(paramNode);
      actions.createParentChildLink({
        parent: node,
        child: paramNode,
      });
    });

    // Optional chaining seems to affect the Vercel build process
    const bodyParameterSchemaString =
      !!node.path.requestBody &&
      !!node.path.requestBody.content &&
      node.path.requestBody.content.schema;

    if (bodyParameterSchemaString) {
      const bodyParameterSchema: RequestBodySchema = JSON.parse(
        bodyParameterSchemaString
      );
      const bodyParameterRequired = new Set(bodyParameterSchema.required || []);
      Object.entries(bodyParameterSchema.properties || []).forEach(
        ([name, {type, description}], index) => {
          if (description) {
            const bodyParamNode = {
              name,
              description,
              schema: {type, format: null, enum: null},
              required: bodyParameterRequired.has(name),
              in: 'body',
              id: createNodeId(`openApiBodyParameter-${node.id}-${index}`),
              parent: node.id,
              children: [],
              internal: {
                type: 'openApiBodyParameter',
                content: description,
                mediaType: 'text/markdown',
                contentDigest: createContentDigest(description),
              },
            };
            actions.createNode(bodyParamNode);
            actions.createParentChildLink({
              parent: node,
              child: bodyParamNode,
            });
          }
        }
      );
    }
  }
};
