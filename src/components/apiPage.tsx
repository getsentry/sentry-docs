import {Fragment, ReactElement, useMemo} from 'react';
import {bundleMDX} from 'mdx-bundler';
import {getMDXComponent} from 'mdx-bundler/client';

import {type API} from 'sentry-docs/build/resolveOpenAPI';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import remarkCodeTabs from 'sentry-docs/remark-code-tabs';
import remarkCodeTitles from 'sentry-docs/remark-code-title';

import {ApiExamples} from './apiExamples';
import {DocPage} from './docPage';
import {ApiSidebar} from './sidebar';
import {SmartLink} from './smartLink';

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
                {param.description && parseMarkdown(param.description)}
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

// https://stackoverflow.com/a/38137700
function cssToObj(css) {
  const obj = {},
    s = css
      .toLowerCase()
      .replace(/-(.)/g, function (_, g) {
        return g.toUpperCase();
      })
      .replace(/;\s?$/g, '')
      .split(/:|;/g);
  for (let i = 0; i < s.length; i += 2) {
    obj[s[i].replace(/\s/g, '')] = s[i + 1].replace(/^\s+|\s+$/g, '');
  }
  return obj;
}

async function parseMarkdown(source: string): Promise<ReactElement> {
  // Source uses string styles, but MDX requires object styles.
  source = source.replace(/style="([^"]+)"/g, (_, style) => {
    return `style={${JSON.stringify(cssToObj(style))}}`;
  });
  const {code} = await bundleMDX({
    source,
    cwd: process.cwd(),
    mdxOptions(options) {
      options.remarkPlugins = [remarkCodeTitles, remarkCodeTabs];
      return options;
    },
    esbuildOptions: options => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      };
      return options;
    },
  });
  function MDXLayoutRenderer({mdxSource, ...rest}) {
    const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
    return <MDXLayout components={mdxComponents()} {...rest} />;
  }
  return <MDXLayoutRenderer mdxSource={code} />;
}

type Props = {
  api: API;
};

export function ApiPage({api}: Props) {
  const frontMatter = {
    title: api.name,
  };
  return (
    <DocPage frontMatter={frontMatter} notoc sidebar={<ApiSidebar />} fullWidth>
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
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          {api.summary && <p>{api.summary}</p>}

          {api.descriptionMarkdown && parseMarkdown(api.descriptionMarkdown)}

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
