export type RequestBodySchema = {
  properties: {
    [key: string]: {description: string; type: string};
  };
  required: string[];
  type: string;
};

export type Parameter = {
  description: string;
  in: string;
  name: string;
  required: boolean;
  schema: {
    enum: string[];
    format: string;
    type: string;
    items?: {[key: string]: {}};
  };
};

type Markdown = {
  childMdx: {
    body: string;
  };
};

type Tag = {
  description: string;
  externalDocs: {
    description: string;
    url: string;
  };
  name: string;
};

export type DeRefedOpenAPI = {
  paths: {
    [key: string]: {
      [key: string]: {
        operationId: string;
        parameters: Parameter[];
        requestBody: {
          content: {
            'application/json': {
              example: any;
              schema: RequestBodySchema;
            };
          };
          required: boolean;
        };
        responses: {
          [key: string]: {
            content: {
              'application/json': {
                example: any;
                schema: any;
              };
            };
            description: string;
          };
        };
        tags: string[];
      };
    };
  };
  tags: Tag[];
};

export type ResponseContent = {
  content_type: string;
  example: string;
  examples: string;
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
    example: string;
    schema: string;
  };
  required: boolean;
};

export type OpenApiPath = {
  apiPath: string;
  description: string;
  method: string;
  operationId: string;
  parameters: Parameter[];
  readableUrl: string;
  requestBody: RequestBody | null;
  responses: Response[];
  security: {[key: string]: string[]}[];
  summary: string | null;
  tags: string[];
};

export type OpenAPI = {
  childOpenApiPathDescription: Markdown;
  childrenOpenApiBodyParameter: (Parameter & Markdown)[];
  childrenOpenApiPathParameter: (Parameter & Markdown)[];
  id: string;
  path: OpenApiPath;
};
