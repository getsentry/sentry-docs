import {Fragment} from 'react';

import {type API} from 'sentry-docs/build/resolveOpenAPI';

import './styles.scss';

import {ApiExamples} from '../apiExamples/apiExamples';
import {DocPage} from '../docPage';
import {SmartLink} from '../smartLink';

/**
 * Renders pre-compiled HTML from markdown.
 * The HTML is compiled at build time in resolveOpenAPI.ts to avoid
 * needing esbuild/mdx-bundler at runtime.
 * Fixes: DOCS-A3H
 */
function MarkdownHtml({html}: {html: string}) {
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

function Params({params}) {
  return (
    <dl className="api-params">
      {params.map(param => {
        return (
          <Fragment key={param.name}>
            <dt>
              <div>
                <code data-index>{param.name}</code>
                {!!param.schema?.type && (
                  <em>
                    {' '}
                    ({param.schema.type}
                    {param.schema.items && `(${param.schema.items.type})`})
                  </em>
                )}
              </div>
              {!!param.required && <div className="required">REQUIRED</div>}
            </dt>

            {!!param.description && (
              <dd>
                {param.schema?.enum && (
                  <Fragment>
                    <b>choices</b>:
                    <ul>
                      <code>
                        {param.schema?.enum.map(e => {
                          return <li key={e}>{e}</li>;
                        })}
                      </code>
                    </ul>
                  </Fragment>
                )}
                {param.schema?.items?.enum && (
                  <Fragment>
                    <b>choices</b>:
                    <ul>
                      <code>
                        {param.schema?.items?.enum.map(e => {
                          return <li key={e}>{e}</li>;
                        })}
                      </code>
                    </ul>
                  </Fragment>
                )}
                {/* Parameter descriptions are simple text, render directly */}
                {param.description}
              </dd>
            )}
          </Fragment>
        );
      })}
    </dl>
  );
}

const getScopes = (data, securityScheme) => {
  const obj = data.security.find(e => e[securityScheme]);
  return obj[securityScheme];
};

type Props = {
  api: API;
};

export function ApiPage({api}: Props) {
  const frontMatter = {
    title: api.name,
  };
  return (
    <DocPage frontMatter={frontMatter} notoc fullWidth>
      <div className="flex">
        <div className="w-full">
          <div className="api-block">
            <div className="api-block-header request">
              <span className="api-request-block-verb">{api.method.toUpperCase()}</span>{' '}
              <span>{api.apiPath}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          {api.summary && <p>{api.summary}</p>}

          {/* Use pre-compiled HTML instead of runtime bundleMDX (fixes DOCS-A3H) */}
          {api.descriptionHtml && <MarkdownHtml html={api.descriptionHtml} />}

          {!!api.pathParameters.length && (
            <div className="api-info-row">
              <h3>Path Parameters</h3>
              <Params params={api.pathParameters} />
            </div>
          )}

          {!!api.queryParameters.length && (
            <div className="api-info-row">
              <h3>Query Parameters:</h3>
              <Params params={api.queryParameters} />
            </div>
          )}

          {!!api.bodyParameters.length && (
            <div className="api-info-row">
              <h3>Body Parameters</h3>
              <Params params={api.bodyParameters} />
            </div>
          )}

          {api.security?.length && (
            <div className="api-info-row">
              <h3>Scopes</h3>

              <div>
                <div>
                  {'You need to '}
                  <SmartLink to="/api/auth">
                    authenticate via bearer auth token.
                  </SmartLink>
                </div>
                <code>{'<auth_token>'}</code> requires one of the following scopes:
              </div>

              <ul>
                {getScopes(api, 'auth_token').map(scope => (
                  <li key={scope} style={{fontWeight: 'bold'}}>
                    <code>{scope}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2">
          <ApiExamples api={api} />
        </div>
      </div>
    </DocPage>
  );
}
