import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import Prism from "prismjs";

import BasePage from "~src/components/basePage";
import SmartLink from "~src/components/smartLink";

import "prismjs/components/prism-json";

const Params = ({ params }) => (
  <dl className="api-params">
    {params.map(param => (
      <React.Fragment key={param.name}>
        <dt>
          <code>{param.name}</code>
          {!!param.schema?.type && <em> ({param.schema.type})</em>}
        </dt>
        <dd>{!!param.description && param.description}</dd>
      </React.Fragment>
    ))}
  </dl>
);

const getScopes = (data, securityScheme) => {
  let obj = data.security.find(e => e[securityScheme]);
  return obj[securityScheme];
};

const strFormat = str => {
  let s = str.trim();
  if (s.endsWith(".")) {
    return s;
  }
  return s + ".";
};

export default props => {
  const data = props.data?.openApi?.path || {};
  const parameters =
    (data.requestBody?.content?.schema &&
      JSON.parse(data.requestBody.content.schema)) ||
    null;

  const apiExample = [
    `curl https://sentry.io${data.apiPath} `,
    ` -H "Authorization: Bearer <auth_token>" `,
  ];

  if (parameters) {
    let body = {};
    Object.entries(parameters.properties).map(
      ([key, { example }]) => (body[key] = example)
    );

    apiExample.push(` -d '${JSON.stringify(body)}'`);
  }

  const [selectedResponse, selectResponse] = useState(0);
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <BasePage {...props}>
      <div className="row">
        <div className="col-6">
          {data.summary && <p>{data.summary}</p>}

          {data.description && (
            <div className="pb-3 content-flush-bottom">
              <p>{data.description}</p>
            </div>
          )}
          {!!data.parameters.filter(param => param.in === "path").length && (
            <div className="api-info-row">
              <strong>Path Parameters:</strong>
              <Params
                params={data.parameters.filter(param => param.in === "path")}
              />
            </div>
          )}

          {!!data.parameters.filter(param => param.in === "query").length && (
            <div className="api-info-row">
              <strong>Query Parameters:</strong>

              <Params
                params={data.parameters.filter(param => param.in === "query")}
              />
            </div>
          )}

          {parameters && (
            <div className="api-info-row">
              <strong>Body Parameters:</strong>
              <Params
                params={Object.entries(parameters.properties).map(
                  ([name, { type, description }]) => ({
                    schema: { type },
                    description,
                    name,
                  })
                )}
              />
            </div>
          )}

          {data.security.length && (
            <div className="api-info-row">
              <strong>Scopes:</strong>

              <div>
                <div>
                  {"You need to "}
                  <SmartLink to={"/development-api/authentication"}>
                    authenticate via bearer auth token.
                  </SmartLink>
                </div>
                <code>{"<auth_token>"}</code> requires the following scopes:
              </div>

              <ul>
                {getScopes(data, "auth_token").map(scope => (
                  <li key={scope} style={{ fontWeight: "bold" }}>
                    <code>{scope}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="col-6">
          <div className="api-block">
            <div className="api-block-header request">
              <span className="api-request-block-verb">
                {data.method.toUpperCase()}
              </span>{" "}
              {data.apiPath}
            </div>
            <pre className="api-block-example request">
              {apiExample.join("\\\n")}
            </pre>
          </div>
          <div className="api-block">
            <div className="api-block-header response">
              {"RESPONSE"}{" "}
              <div className="response-status-btn-group">
                {data.responses.map(
                  (res, i) =>
                    res.status_code && (
                      <button
                        className={`response-status-btn ${selectedResponse ===
                          i && "selected"}`}
                        key={res.status_code}
                        onClick={() => selectResponse(i)}
                      >
                        {res.status_code}
                      </button>
                    )
                )}
              </div>
            </div>
            <pre className="api-block-example response">
              {data.responses[selectedResponse].content?.example ? (
                <code
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(
                      data.responses[selectedResponse].content.example,
                      Prism.languages.json,
                      "json"
                    ),
                  }}
                />
              ) : (
                strFormat(data.responses[selectedResponse].description)
              )}
            </pre>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export const pageQuery = graphql`
  query OpenApiQuery($id: String) {
    openApi(id: { eq: $id }) {
      id
      path {
        description
        method
        operationId
        summary
        tags
        apiPath
        readableUrl
        parameters {
          schema {
            type
            format
            enum
          }
          name
          in
          description
          required
        }
        responses {
          content {
            content_type
            example
            schema
          }
          description
          status_code
        }
        requestBody {
          content {
            content_type
            schema
          }
          required
        }
        summary
        tags
        security {
          auth_token
        }
      }
    }
  }
`;
