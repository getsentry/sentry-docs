'use client';

import './swagger-ui.css';

import {Fragment, useState} from 'react';
import {OpenAPIV3_1} from 'openapi-types';
// import {type} from 'swagger-ui-plugin-hierarchical-tags';
import SwaggerUI, {SwaggerUIProps} from 'swagger-ui-react';

import {API, APICategory} from 'sentry-docs/build/resolveOpenAPI';

import {LoadingArticle} from '../changelog/article';

import apiSpec from './api-spec.json';
import {HTTPSnippetGenerators} from './plugins';
import {getSnippetConfig} from './settings';

const spec = apiSpec as any as OpenApiSpec;

// copy from src/build/resolveOpenAPI.ts
const SENTRY_API_SCHEMA_SHA = 'fee7af6df0bb3b71aa57a96fe9569848c9dc8e54';

type OpenApiSpec = OpenAPIV3_1.Document;

type Props = {
  api?: API;
  category?: APICategory;
};

const filteredSpecByEndpoint = (
  originalSpec: OpenApiSpec,
  endpoint?: string,
  method?: string
) => {
  const filteredSpec: OpenApiSpec = {
    info: originalSpec.info,
    openapi: originalSpec.openapi,
    components: {},
    paths: {},
  };

  if (endpoint) {
    Object.entries(originalSpec?.paths || {}).forEach(([path, methods]) => {
      if (filteredSpec.paths && methods && path === endpoint) {
        if (method) {
          const filteredMethods = {...methods};
          Object.keys(methods).forEach(methodName => {
            if (methodName !== method) {
              delete filteredMethods[methodName];
            }
          });
          filteredSpec.paths[path] = filteredMethods;
        } else {
          filteredSpec.paths[path] = methods;
        }
      }
    });
  } else {
    filteredSpec.paths = spec.paths;
  }

  return filteredSpec;
};

/**
 * Removes information that we don't want rendered in swagger
 * @param spec The openapi spec
 */
const removeUnrenderedInfo = (originalSpec: OpenApiSpec) => {
  originalSpec.info.title = '';
  originalSpec.info.description = '';
  originalSpec.info.version = '';
};

export function ApiDocs({api}: Props) {
  const [loading, setLoading] = useState(true);
  const renderedSpec = api
    ? filteredSpecByEndpoint(spec, api?.apiPath, api?.method)
    : spec;

  removeUnrenderedInfo(renderedSpec);

  // const specUrl = `https://raw.githubusercontent.com/getsentry/sentry-api-schema/${SENTRY_API_SCHEMA_SHA}/openapi-derefed.json`;

  const snippetConfig = getSnippetConfig(['curl_bash', 'node_axios', 'python', 'php']);
  const plugins: SwaggerUIProps['plugins'] = [HTTPSnippetGenerators];

  return (
    <Fragment>
      {loading && <LoadingArticle />}
      <SwaggerUI
        spec={renderedSpec}
        requestSnippetsEnabled
        requestSnippets={snippetConfig}
        plugins={plugins}
        docExpansion={api ? 'full' : 'none'}
        onComplete={() => setLoading(false)}
      />
    </Fragment>
  );
}
