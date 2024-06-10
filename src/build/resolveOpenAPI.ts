/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */
/* eslint-disable no-console */

import {promises as fs} from 'fs';

import {DeRefedOpenAPI} from './open-api/types';

// SENTRY_API_SCHEMA_SHA is used in the sentry-docs GHA workflow in getsentry/sentry-api-schema.
// DO NOT change variable name unless you change it in the sentry-docs GHA workflow in getsentry/sentry-api-schema.
const SENTRY_API_SCHEMA_SHA = '958b7085d82dc29e3e0b37643f7050c3f41e9598';

const activeEnv = process.env.GATSBY_ENV || process.env.NODE_ENV || 'development';

async function resolveOpenAPI(): Promise<DeRefedOpenAPI> {
  if (activeEnv === 'development' && process.env.OPENAPI_LOCAL_PATH) {
    try {
      console.log(`Fetching from ${process.env.OPENAPI_LOCAL_PATH}`);
      const data = await fs.readFile(process.env.OPENAPI_LOCAL_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log(
        `Failed to connect to  ${process.env.OPENAPI_LOCAL_PATH}. Continuing to fetch versioned schema from GitHub.
        ${error}`
      );
    }
  }
  const response = await fetch(
    `https://raw.githubusercontent.com/getsentry/sentry-api-schema/${SENTRY_API_SCHEMA_SHA}/openapi-derefed.json`
  );
  return await response.json();
}

export type APIParameter = {
  description: string;
  name: string;
  required: boolean;
  schema: {
    type: string;
    format?: string;
    items?: {
      type: string;
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

type APIData = DeRefedOpenAPI['paths'][string][string];

export type API = {
  apiPath: string;
  bodyParameters: APIParameter[];
  method: string;
  name: string;
  pathParameters: APIParameter[];
  queryParameters: APIParameter[];
  responses: APIResponse[];
  slug: string;
  bodyContentType?: string;
  descriptionMarkdown?: string;
  requestBodyContent?: any;
  security?: {[key: string]: string[]};
  summary?: string;
};

export type APICategory = {
  apis: API[];
  name: string;
  slug: string;

  /** description is a string of markdown with possible links */
  description?: string;
};

function slugify(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9/ ]/g, '')
    .trim()
    .replace(/\s/g, '-')
    .toLowerCase();
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
  const data = await resolveOpenAPI();

  const categoryMap: {[name: string]: APICategory} = {};
  data.tags.forEach(tag => {
    categoryMap[tag.name] = {
      name: tag['x-sidebar-name'] || tag.name,
      slug: slugify(tag.name),
      description: tag['x-display-description'] ? tag.description : undefined,
      apis: [],
    };
  });

  Object.entries(data.paths).forEach(([apiPath, methods]) => {
    Object.entries(methods).forEach(([method, apiData]) => {
      apiData.tags.forEach(tag => {
        categoryMap[tag].apis.push({
          apiPath,
          method,
          name: apiData.operationId,
          slug: slugify(apiData.operationId),
          summary: apiData.summary,
          descriptionMarkdown: apiData.description,
          pathParameters: apiData.parameters.filter(
            p => p.in === 'path'
          ) as APIParameter[],
          queryParameters: apiData.parameters.filter(
            p => p.in === 'query'
          ) as APIParameter[],
          requestBodyContent: {
            example:
              apiData.requestBody?.content &&
              Object.values(apiData.requestBody.content)[0].example,
          },
          bodyContentType: getBodyContentType(apiData),
          bodyParameters: getBodyParameters(apiData),
          security: apiData.security,
          responses: Object.entries(apiData.responses)
            .map(([status_code, response]) => ({
              status_code,
              ...response,
            }))
            .map(response => {
              const {content, ...rest} = response;
              return {
                content:
                  content &&
                  Object.entries(content).map(([content_type, contentData]) => ({
                    content_type,
                    ...contentData,
                  }))[0],
                ...rest,
              };
            }),
        });
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

function getBodyParameters(apiData: APIData): APIParameter[] {
  const content = apiData.requestBody?.content;
  const contentType = content && Object.values(content)[0];
  const properties = contentType?.schema?.properties;
  if (!properties) {
    return [];
  }

  const required: string[] = contentType?.schema?.required || [];

  return Object.entries(properties).map(([name, props]: [string, any]) => ({
    name,
    description: props.description,
    required: required.includes(name),
    schema: {
      type: props.type,
      format: '',
      items: props.items,
    },
  }));
}

function getBodyContentType(apiData: APIData): string | undefined {
  const content = apiData.requestBody?.content;
  const types = content && Object.keys(content);
  if (!types?.length) {
    return undefined;
  }
  return types[0];
}
