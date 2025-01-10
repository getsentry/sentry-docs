'use client';

import './swagger-ui.css';

import {Fragment, useEffect, useState} from 'react';
import {LoadingArticle} from 'apps/changelog/src/client/components/article';
import {OpenAPIV3_1} from 'openapi-types';
import {API, APICategory} from 'src/build/resolveOpenAPI';
// import {resolveRemoteApiSpec} from 'src/build/shared';
import SwaggerUI, {SwaggerUIProps} from 'swagger-ui-react';

import {resolveRemoteApiSpec} from 'sentry-docs/build/shared';

import {HTTPSnippetGenerators} from './plugins';
import {getSnippetConfig} from './settings';

type OpenApiSpec = OpenAPIV3_1.Document;

type Props = {
  api?: API;
  category?: APICategory;
};

const filteredSpecByEndpoint = (
  originalSpec: OpenApiSpec | null,
  endpoint?: string,
  method?: string
) => {
  if (!originalSpec) {
    return null;
  }

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
    filteredSpec.paths = originalSpec.paths;
  }

  return filteredSpec;
};

/**
 * Removes information that we don't want rendered in swagger
 * @param spec The openapi spec
 */
const removeUnrenderedInfo = (originalSpec: OpenApiSpec | null) => {
  if (!originalSpec) {
    return;
  }

  originalSpec.info.title = '';
  originalSpec.info.description = '';
  originalSpec.info.version = '';
};

export function ApiDocs({api}: Props) {
  const [loading, setLoading] = useState(true);
  const [apiSpec, setApiSpec] = useState<OpenApiSpec | null>(null);

  useEffect(() => {
    const fetchApiSpec = async () => {
      // this is temporary, for demo purposed
      const spec = (await resolveRemoteApiSpec()) as any as OpenApiSpec;

      // eslint-disable-next-line no-console
      console.log('resolving spec', spec);
      setApiSpec(spec);
    };

    fetchApiSpec();
  }, []);

  const renderedSpec = api
    ? filteredSpecByEndpoint(apiSpec, api?.apiPath, api?.method)
    : apiSpec;

  removeUnrenderedInfo(renderedSpec);

  // const specUrl = `https://raw.githubusercontent.com/getsentry/sentry-api-schema/${SENTRY_API_SCHEMA_SHA}/openapi-derefed.json`;

  const snippetConfig = getSnippetConfig(['curl_bash', 'node_axios', 'python', 'php']);
  const plugins: SwaggerUIProps['plugins'] = [HTTPSnippetGenerators];

  return (
    <Fragment>
      {loading && <LoadingArticle />}
      {renderedSpec && (
        <SwaggerUI
          spec={renderedSpec}
          requestSnippetsEnabled
          requestSnippets={snippetConfig}
          plugins={plugins}
          docExpansion={api ? 'full' : 'none'}
          onComplete={() => setLoading(false)}
        />
      )}
    </Fragment>
  );
}
