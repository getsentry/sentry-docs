import React from "react";
import { graphql } from "gatsby";

import ApiSidebar from "~src/components/apiSidebar";
import BasePage from "~src/components/basePage";
import Markdown from "~src/components/markdown";

const Params = ({ params }) => (
  <ul className="api-params">
    {params.map(param => (
      <li key={param.name}>
        <code>{param.name}</code>
        {!!param.type && <em> ({param.type})</em>}
        {!!param.description && ` — ${param.description}`}
      </li>
    ))}
  </ul>
);

export default props => {
  const { apiEndpoint } = props.data;
  return (
    <BasePage sidebar={<ApiSidebar />} {...props}>
      <p>
        <strong>
          {apiEndpoint.method} {apiEndpoint.api_path}
        </strong>
      </p>

      {apiEndpoint.warning && <p>Caution: {apiEndpoint.warning}</p>}

      {apiEndpoint.description && (
        <div className="pb-3 content-flush-bottom">
          <Markdown
            value={apiEndpoint.fields.markdownDescription.childMdx.body}
          />
        </div>
      )}

      <table className="table">
        {apiEndpoint.path_parameters && (
          <tr>
            <td>
              <strong>Path Parameters:</strong>
            </td>
            <td className="content-flush-bottom">
              <Params params={apiEndpoint.path_parameters} />
            </td>
          </tr>
        )}

        {apiEndpoint.query_parameters && (
          <tr>
            <td>
              <strong>Query Parameters:</strong>
            </td>
            <td className="content-flush-bottom">
              <Params params={apiEndpoint.query_parameters} />
            </td>
          </tr>
        )}

        {apiEndpoint.parameters && (
          <tr>
            <td>
              <strong>Parameters:</strong>
            </td>
            <td className="content-flush-bottom">
              <Params params={apiEndpoint.parameters} />
            </td>
          </tr>
        )}

        {apiEndpoint.authentication && (
          <tr>
            <td>
              <strong>Authentication:</strong>
            </td>
            <td>{apiEndpoint.authentication}</td>
          </tr>
        )}

        {apiEndpoint.method && (
          <tr>
            <td>
              <strong>Method:</strong>
            </td>
            <td>{apiEndpoint.method}</td>
          </tr>
        )}

        {apiEndpoint.api_path && (
          <tr>
            <td>
              <strong>Path:</strong>
            </td>
            <td>{apiEndpoint.api_path}</td>
          </tr>
        )}
      </table>

      {apiEndpoint.example_request && (
        <React.Fragment>
          <h2>Example Request</h2>

          <pre>{apiEndpoint.example_request}</pre>
        </React.Fragment>
      )}

      {apiEndpoint.example_response && (
        <React.Fragment>
          <h2>Example Response</h2>

          <pre>{apiEndpoint.example_response}</pre>
        </React.Fragment>
      )}
    </BasePage>
  );
};

export const pageQuery = graphql`
  query ApiEndpointQuery($id: String) {
    apiEndpoint(id: { eq: $id }) {
      title

      fields {
        description {
          internal {
            type
          }
        }
      }

      api_path
      authentication
      method
      example_request
      example_response
      parameters {
        type
        name
        description
      }
      path_parameters {
        type
        name
        description
      }
      query_parameters {
        type
        name
        description
      }
    }
  }
`;
