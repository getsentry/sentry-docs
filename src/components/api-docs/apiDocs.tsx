'use client';

import 'swagger-ui-react/swagger-ui.css';

import {Fragment, useState} from 'react';
import styled from '@emotion/styled';
// import {type} from 'swagger-ui-plugin-hierarchical-tags';
import SwaggerUI, {SwaggerUIProps} from 'swagger-ui-react';

import {DeRefedOpenAPI} from 'sentry-docs/build/open-api/types';

import {LoadingArticle} from '../changelog/article';
import {DocPage} from '../docPage';

import apiSpec from './api-spec.json';
import {HTTPSnippetGenerators} from './plugins';
import {getSnippetConfig} from './settings';

const spec = apiSpec as any as DeRefedOpenAPI;

// copy from src/build/resolveOpenAPI.ts
const SENTRY_API_SCHEMA_SHA = 'fee7af6df0bb3b71aa57a96fe9569848c9dc8e54';

interface Props {
  tagFilter?: string;
}

export function ApiDocs({tagFilter}: Props) {
  const [loading, setLoading] = useState(true);

  // const specUrl = `https://raw.githubusercontent.com/getsentry/sentry-api-schema/${SENTRY_API_SCHEMA_SHA}/openapi-derefed.json`;
  const sidebarWidth = '300px';

  const snippetConfig = getSnippetConfig(['curl_bash', 'node_axios', 'python', 'php']);

  const plugins: SwaggerUIProps['plugins'] = [HTTPSnippetGenerators];

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
      onComplete={() => setLoading(false)}
    />
  );
}
