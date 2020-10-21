export type RequestBodySchema = {
  required: string[];
  type: string;
  properties: {
    [key: string]: { type: string; description: string };
  };
};

export type Parameter = {
  schema: {
    type: string;
    format: string;
    enum: string[];
  };
  name: string;
  in: string;
  description: string;
  required: boolean;
};

type Markdown = {
  childMdx: {
    body: string;
  };
};

export type DeRefedOpenAPI = {
  paths: {
    [key: string]: {
      [key: string]: {
        operationId: string;
        tags: string[];
        parameters: Parameter[];
        requestBody: {
          content: {
            "application/json": {
              schema: RequestBodySchema;
              example: any;
            };
          };
          required: boolean;
        };
        responses: {
          [key: string]: {
            description: string;
            content: {
              "application/json": {
                schema: any;
                example: any;
              };
            };
          };
        };
      };
    };
  };
};

export type ResponseContent = {
  content_type: string;
  example: string;
  schema: string;
};

export type Response = {
  content: ResponseContent | null;
  description: string;
  status_code: string;
};

export type RequestBody = {
  content: {
    content_type: string;
    schema: string;
    example: string;
  };
  required: boolean;
};

export type OpenApiPath = {
  description: string;
  method: string;
  operationId: string;
  summary: string | null;
  tags: string[];
  apiPath: string;
  readableUrl: string;
  parameters: Parameter[];
  responses: Response[];
  requestBody: RequestBody | null;
  security: { [key: string]: string[] }[];
};

export type OpenAPI = {
  id: string;
  path: OpenApiPath;
  childOpenApiPathDescription: Markdown;
  childrenOpenApiPathParameter: (Parameter & Markdown)[];
};
