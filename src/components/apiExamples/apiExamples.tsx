'use client';

import {Fragment, useState} from 'react';
import {jsx, jsxs} from 'react/jsx-runtime';
import {toJsxRuntime} from 'hast-util-to-jsx-runtime';
import bash from 'refractor/lang/bash.js';
import javascript from 'refractor/lang/javascript.js';
import json from 'refractor/lang/json.js';
import {refractor} from 'refractor/lib/core.js';

import {type API} from 'sentry-docs/build/resolveOpenAPI';

refractor.register(json);
refractor.register(javascript);
refractor.register(bash);

import {Nodes} from 'hastscript/lib/create-h';

import styles from './apiExamples.module.scss';

import {CodeBlock} from '../codeBlock';
import {CodeTabs} from '../codeTabs';

type ExampleProps = {
  api: API;
  selectedResponse: number;
  selectedTabView: number;
};

function Example({api, selectedTabView, selectedResponse}: ExampleProps) {
  let exampleJson: any;
  if (api.responses[selectedResponse].content?.examples) {
    exampleJson = Object.values(
      api.responses[selectedResponse].content?.examples ?? {}
    ).map(e => e.value)[0];
  } else if (api.responses[selectedResponse].content?.example) {
    exampleJson = api.responses[selectedResponse].content?.example;
  }

  return (
    <pre className={styles['api-block-example']}>
      {selectedTabView === 0 &&
        (exampleJson ? (
          <code className="!text-[0.8rem]">
            {toJsxRuntime(
              refractor.highlight(JSON.stringify(exampleJson, null, 2), 'json') as Nodes,
              {Fragment, jsx, jsxs}
            )}
          </code>
        ) : (
          strFormat(api.responses[selectedResponse].description)
        ))}
      {selectedTabView === 1 && (
        <code className="!text-[0.8rem]">
          {toJsxRuntime(
            refractor.highlight(
              JSON.stringify(api.responses[selectedResponse].content?.schema, null, 2),
              'json'
            ) as Nodes,
            {Fragment, jsx, jsxs}
          )}
        </code>
      )}
    </pre>
  );
}

const strFormat = (str: string) => {
  const s = str.trim();
  if (s.endsWith('.')) {
    return s;
  }
  return s + '.';
};

type Props = {
  api: API;
};

export function ApiExamples({api}: Props) {
  const apiExample = [
    `curl https://sentry.io${api.apiPath}`,
    ` -H 'Authorization: Bearer <auth_token>'`,
  ];
  if (['put', 'options', 'delete'].includes(api.method.toLowerCase())) {
    apiExample.push(` -X ${api.method.toUpperCase()}`);
  }
  if (api.bodyContentType) {
    apiExample.push(` -H 'Content-Type: ${api.bodyContentType}'`);
  }
  if (api.bodyParameters.length) {
    const requestBodyExample = api.requestBodyContent?.example || {};

    if (api.bodyContentType === 'multipart/form-data') {
      Object.entries(requestBodyExample).map(
        ([key, value]) => value !== undefined && apiExample.push(` -F ${key}=${value}`)
      );
    } else {
      apiExample.push(` -d '${JSON.stringify(requestBodyExample)}'`);
    }
  }

  const [selectedResponse, selectResponse] = useState(0);

  const [selectedTabView, selectTabView] = useState(0);
  const tabViews = api.responses[selectedResponse].content?.schema
    ? ['RESPONSE', 'SCHEMA']
    : ['RESPONSE'];

  return (
    <Fragment>
      <CodeTabs>
        <CodeBlock language="bash">
          <pre>
            {toJsxRuntime(
              refractor.highlight(apiExample.join(' \\\n'), 'bash') as Nodes,
              {
                Fragment,
                jsx,
                jsxs,
              }
            )}
          </pre>
        </CodeBlock>
      </CodeTabs>
      <div className="api-block">
        <div className="api-block-header response">
          <div className="tabs-group">
            {tabViews.map((view, i) => (
              <span
                key={view}
                className={`tab ${selectedTabView === i && 'selected'}`}
                onClick={() => selectTabView(i)}
              >
                {view}
              </span>
            ))}
          </div>
          <div className="response-status-btn-group">
            {api.responses.map(
              (res, i) =>
                res.status_code && (
                  <button
                    className={`response-status-btn ${
                      selectedResponse === i && 'selected'
                    }`}
                    key={res.status_code}
                    onClick={() => {
                      selectResponse(i);
                      selectTabView(0);
                    }}
                  >
                    {res.status_code}
                  </button>
                )
            )}
          </div>
        </div>
        <Example
          api={api}
          selectedTabView={selectedTabView}
          selectedResponse={selectedResponse}
        />
      </div>
    </Fragment>
  );
}
