'use client';

import 'swagger-ui-react/swagger-ui.css';

import openapiFilter from 'openapi-filter';
import SwaggerUI, {SwaggerUIProps} from 'swagger-ui-react';

import {DeRefedOpenAPI} from 'sentry-docs/build/open-api/types';

import apiSpec from './api-spec.json';
import {SnippedGeneratorNodeJsPlugin} from './plugins';

const spec = apiSpec as any as DeRefedOpenAPI;

// copy from src/build/resolveOpenAPI.ts
const SENTRY_API_SCHEMA_SHA = 'fee7af6df0bb3b71aa57a96fe9569848c9dc8e54';

interface Props {
  tagFilter?: string;
}

export function ApiDocs({tagFilter}: Props) {
  const specUrl = `https://raw.githubusercontent.com/getsentry/sentry-api-schema/${SENTRY_API_SCHEMA_SHA}/openapi-derefed.json`;

  const sidebarWidth = '300px';
  const snippetConfig = {
    generators: {
      node_native: {
        title: 'NodeJs Native',
        syntax: 'javascript',
      },
    },
  };

  const plugins: SwaggerUIProps['plugins'] = [SnippedGeneratorNodeJsPlugin];

  // const filteredSpec = {...spec, paths: {}};
  // if (filter) {
  //   Object.entries(spec.paths).forEach(([path, methods]) => {
  //     let hasTag = false;
  //     Object.values(methods).forEach(method => {
  //       if (method.tags.includes(filter)) {
  //         hasTag = true;
  //         return;
  //       }
  //     });
  //     if (hasTag) {
  //       filteredSpec.paths[path] = methods;
  //     }
  //   });
  // } else {
  //   filteredSpec.paths = spec.paths;
  // }

  return (
    <SwaggerUI
      spec={spec}
      requestSnippetsEnabled
      requestSnippets={snippetConfig}
      plugins={plugins}
    />
  );
}
