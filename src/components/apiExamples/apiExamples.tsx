'use client';

import {Fragment, useEffect, useState} from 'react';
import {jsx, jsxs} from 'react/jsx-runtime';
import {Clipboard} from 'react-feather';
import {toJsxRuntime} from 'hast-util-to-jsx-runtime';
import {Nodes} from 'hastscript/lib/create-h';
import bash from 'refractor/lang/bash.js';
import json from 'refractor/lang/json.js';
import {refractor} from 'refractor/lib/core.js';

import {type API} from 'sentry-docs/build/resolveOpenAPI';

import codeBlockStyles from '../codeBlock/code-blocks.module.scss';
import styles from './apiExamples.module.scss';

import {CodeBlock} from '../codeBlock';
import {CodeTabs} from '../codeTabs';

refractor.register(bash);
refractor.register(json);

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

const codeToJsx = (code: string, lang = 'json') => {
  return toJsxRuntime(refractor.highlight(code, lang) as Nodes, {Fragment, jsx, jsxs});
};

export function ApiExamples({api}: Props) {
  const apiExample = [
    `curl ${api.server}${api.apiPath}`,
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

  const [showCopied, setShowCopied] = useState(false);

  // Show the copy button after js has loaded
  // otherwise the copy button will not work
  const [showCopyButton, setShowCopyButton] = useState(false);
  useEffect(() => {
    setShowCopyButton(true);
  }, []);
  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1200);
  }

  let exampleJson: any;
  if (api.responses[selectedResponse].content?.examples) {
    exampleJson = Object.values(
      api.responses[selectedResponse].content?.examples ?? {}
    ).map(e => e.value)[0];
  } else if (api.responses[selectedResponse].content?.example) {
    exampleJson = api.responses[selectedResponse].content?.example;
  }

  const codeToCopy =
    selectedTabView === 0
      ? exampleJson
        ? JSON.stringify(exampleJson, null, 2)
        : strFormat(api.responses[selectedResponse].description)
      : JSON.stringify(api.responses[selectedResponse].content?.schema, null, 2);

  return (
    <Fragment>
      <CodeTabs>
        <CodeBlock language="bash">
          <pre>{codeToJsx(apiExample.join(' \\\n'), 'bash')}</pre>
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

          <button className={styles.copy} onClick={() => copyCode(codeToCopy)}>
            {showCopyButton && <Clipboard size={16} />}
          </button>
        </div>
        <pre className={`${styles['api-block-example']} relative`}>
          <div className={codeBlockStyles.copied} style={{opacity: showCopied ? 1 : 0}}>
            Copied
          </div>
          {selectedTabView === 0 &&
            (exampleJson ? (
              <code className="!text-[0.8rem]">
                {codeToJsx(JSON.stringify(exampleJson, null, 2), 'json')}
              </code>
            ) : (
              strFormat(api.responses[selectedResponse].description)
            ))}
          {selectedTabView === 1 && (
            <code className="!text-[0.8rem]">
              {codeToJsx(
                JSON.stringify(api.responses[selectedResponse].content?.schema, null, 2),
                'json'
              )}
            </code>
          )}
        </pre>
      </div>
    </Fragment>
  );
}
