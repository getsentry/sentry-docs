/* eslint import/no-nodejs-modules:0 */

import {
  type ApiDocs,
  type ApiDocsOperation,
  type ApiDocsParameter,
  extractDocs,
  operations,
  tags,
} from '@sentry/api/docs';
import {promises as fs} from 'fs';

const activeEnv = process.env.GATSBY_ENV || process.env.NODE_ENV || 'development';

// The API reference comes from the pinned `@sentry/api` version. In development,
// OPENAPI_LOCAL_PATH previews a local `make build-api-docs` spec instead.
async function resolveApiDocs(): Promise<ApiDocs> {
  if (activeEnv === 'development' && process.env.OPENAPI_LOCAL_PATH) {
    try {
      console.log(`Fetching from ${process.env.OPENAPI_LOCAL_PATH}`);
      const data = await fs.readFile(process.env.OPENAPI_LOCAL_PATH, 'utf8');
      return extractDocs(JSON.parse(data));
    } catch (error) {
      console.log(
        `Failed to read ${process.env.OPENAPI_LOCAL_PATH}. Continuing with the API reference from @sentry/api.
        ${error}`
      );
    }
  }
  return {tags, operations};
}

export type APIParameter = {
  description?: string;
  experimental: boolean;
  name: string;
  required: boolean;
  schema: {
    type: string;
    enum?: string[];
    format?: string;
    items?: {
      type: string;
      enum?: string[];
    };
  };
};

type APIExample = {
  summary: string;
  value: any;
};

type APIResponse = {
  description: string;
  status_code: string;
  content?: {
    content_type: string;
    schema: any;
    example?: APIExample;
    examples?: {[key: string]: APIExample};
  };
};

export type API = {
  apiPath: string;
  bodyParameters: APIParameter[];
  deprecated: boolean;
  experimental: boolean;
  method: string;
  name: string;
  pathParameters: APIParameter[];
  queryParameters: APIParameter[];
  responses: APIResponse[];
  server: string;
  slug: string;
  bodyContentType?: string;
  descriptionMarkdown?: string;
  requestBodyContent?: any;
  /** Accepted security requirements: each maps a scheme to the scopes it needs. */
  security?: ApiDocsOperation['security'];
  summary?: string;
};

export type APICategory = {
  apis: API[];
  name: string;
  slug: string;

  /** description is a string of markdown with possible links */
  description?: string;
};

// Slashes become separators: an endpoint slug must be one URL segment, because the
// API route only matches /api/<category>/<endpoint>/.
function slugify(s: string): string {
  return s
    .replace(/\//g, ' ')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\s/g, '-')
    .toLowerCase();
}

const DEPRECATED_PREFIX_REGEX = /^\(DEPRECATED\)\s*/;

// Sentry prepends this notice to the description of every experimental operation, so
// that consumers with no badge of their own still warn the reader. We render a badge
// and the same sentence beside it, so strip the prefix rather than saying it twice.
// Parameter notices stay in the description: the parameter badge does not repeat them.
const EXPERIMENTAL_NOTICE_REGEX = /^\*\*Experimental:\*\*[^\n]*\n+/;

type ExperimentalExtension = {
  description?: string;
  'x-sentry-experimental'?: boolean;
};

// `extensions={"x-sentry-experimental": True}` on an OpenAPI parameter or body
// property lands as a sibling vendor extension.
export function toDocumentedParameter<T extends ExperimentalExtension>(
  param: T
): T & {experimental: boolean} {
  return {
    ...param,
    experimental: param['x-sentry-experimental'] === true,
  };
}

function isDeprecatedOperationId(operationId: string | undefined): boolean {
  return operationId ? DEPRECATED_PREFIX_REGEX.test(operationId) : false;
}

function stripDeprecatedPrefix(operationId: string): string {
  return operationId.replace(DEPRECATED_PREFIX_REGEX, '');
}

let apiCategoriesCache: Promise<APICategory[]> | undefined;

export function apiCategories(): Promise<APICategory[]> {
  if (apiCategoriesCache) {
    return apiCategoriesCache;
  }
  apiCategoriesCache = apiCategoriesUncached();
  return apiCategoriesCache;
}

async function apiCategoriesUncached(): Promise<APICategory[]> {
  const data = await resolveApiDocs();

  const categoryMap: {[name: string]: APICategory} = {};
  data.tags.forEach(tag => {
    categoryMap[tag.name] = {
      name: tag.sidebarName || tag.name,
      slug: slugify(tag.name),
      description: tag.displayDescription ? tag.description : undefined,
      apis: [],
    };
  });

  data.operations.forEach(operation => {
    // Detect deprecation from either field independently — the (DEPRECATED)
    // marker may sit on operationId even when a summary is present.
    const isDeprecated =
      isDeprecatedOperationId(operation.operationId) ||
      isDeprecatedOperationId(operation.summary);
    const isExperimental = operation.experimental;
    const titleSource = operation.summary || operation.operationId || '';
    const cleanName = stripDeprecatedPrefix(titleSource);
    const description = operation.description || undefined;

    operation.tags.forEach(tag => {
      categoryMap[tag].apis.push({
        apiPath: operation.path,
        method: operation.method.toLowerCase(),
        name: cleanName,
        deprecated: isDeprecated,
        experimental: isExperimental,
        server: operation.servers[0] ?? 'https://sentry.io',
        slug: slugify(cleanName),
        summary: operation.summary
          ? stripDeprecatedPrefix(operation.summary)
          : operation.summary,
        descriptionMarkdown: isExperimental
          ? description?.replace(EXPERIMENTAL_NOTICE_REGEX, '')
          : description,
        pathParameters: documentedParameters(operation.parameters, 'path'),
        queryParameters: documentedParameters(operation.parameters, 'query'),
        requestBodyContent: {example: operation.requestBody?.example},
        bodyContentType: operation.requestBody?.contentType,
        bodyParameters: getBodyParameters(operation),
        // An operation without requirements has no Scopes section.
        security: operation.security.length ? operation.security : undefined,
        responses: operation.responses.map(
          ({status, description: responseDescription, contentType, ...content}) => ({
            status_code: status,
            description: responseDescription,
            content: contentType
              ? ({content_type: contentType, ...content} as APIResponse['content'])
              : undefined,
          })
        ),
      });
    });
  });

  const categories = Object.values(categoryMap);
  categories.sort((a, b) => a.name.localeCompare(b.name));
  categories.forEach(c => {
    c.apis.sort((a, b) => a.name.localeCompare(b.name));
  });
  return categories;
}

function documentedParameters(
  parameters: readonly ApiDocsParameter[],
  location: 'path' | 'query'
): APIParameter[] {
  return parameters
    .filter(param => param.in === location)
    .map(param => ({
      name: param.name,
      description: param.description,
      required: param.required,
      experimental: param.experimental,
      // OpenAPI item schemas are an open record; the page only reads type and enum.
      schema: param.schema as APIParameter['schema'],
    }));
}

function getBodyParameters(operation: ApiDocsOperation): APIParameter[] {
  const schema = operation.requestBody?.schema as
    | {properties?: {[name: string]: any}; required?: string[]}
    | undefined;
  const properties = schema?.properties;
  if (!properties) {
    return [];
  }

  const required: string[] = schema?.required || [];

  return Object.entries(properties).map(([name, props]: [string, any]) =>
    toDocumentedParameter({
      name,
      description: props.description,
      required: required.includes(name),
      'x-sentry-experimental': props['x-sentry-experimental'],
      schema: {
        type: props.type,
        format: '',
        items: props.items,
      },
    })
  );
}
