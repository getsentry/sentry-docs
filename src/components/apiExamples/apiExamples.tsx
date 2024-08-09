'use client';

import {Fragment, useEffect, useRef, useState} from 'react';

import {type API} from 'sentry-docs/build/resolveOpenAPI';

import styles from './apiExamples.module.scss';

type ExampleProps = {
  api: API;
  selectedResponse: number;
  selectedTabView: number;
};

const requestStyles = `${styles['api-block-example']} ${styles.request}`;
const responseStyles = `${styles['api-block-example']} ${styles.response}`;

// overwriting global code block font size
const jsonCodeBlockStyles = `!text-[0.8rem] language-json`;

function Example({api, selectedTabView, selectedResponse}: ExampleProps) {
  const ref = useRef(null);
  let exampleJson: any;
  if (api.responses[selectedResponse].content?.examples) {
    exampleJson = Object.values(
      api.responses[selectedResponse].content?.examples ?? {}
    ).map(e => e.value)[0];
  } else if (api.responses[selectedResponse].content?.example) {
    exampleJson = api.responses[selectedResponse].content?.example;
  }

  // load prism dynamically for these codeblocks,
  // otherwise the highlighting applies globally
  useEffect(() => {
    (async () => {
      const {highlightAllUnder} = await import('prismjs');
      await import('prismjs/components/prism-json');
      if (ref.current) {
        highlightAllUnder(ref.current);
      }
    })();
  }, [selectedResponse, selectedTabView]);

  return (
    <pre className={responseStyles} ref={ref}>
      {selectedTabView === 0 &&
        (exampleJson ? (
          <code
            className={jsonCodeBlockStyles}
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(exampleJson, null, 2),
            }}
          />
        ) : (
          strFormat(api.responses[selectedResponse].description)
        ))}
      {selectedTabView === 1 && (
        <code
          className={jsonCodeBlockStyles}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              api.responses[selectedResponse].content?.schema,
              null,
              2
            ),
          }}
        />
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
      <div className="api-block">
        <pre className={requestStyles}>{apiExample.join(' \\\n')}</pre>
      </div>
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
