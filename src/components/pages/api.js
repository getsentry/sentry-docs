import React from "react";
import { graphql } from "gatsby";

import Layout from "../layout";
import Markdown from "../markdown";

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
  const { apiDoc } = props.data;
  return (
    <Layout {...props}>
      <p>
        <strong>
          {apiDoc.method} {apiDoc.api_path}
        </strong>
      </p>

      {apiDoc.warning && <p>Caution: {apiDoc.warning}</p>}

      {apiDoc.description && (
        <div className="pb-3 content-flush-bottom">
          <Markdown value={apiDoc.fields.markdownDescription.childMdx.body} />
        </div>
      )}

      <table className="table">
        {apiDoc.path_parameters && (
          <tr>
            <td>
              <strong>Path Parameters:</strong>
            </td>
            <td className="content-flush-bottom">
              <Params params={apiDoc.path_parameters} />
            </td>
          </tr>
        )}

        {apiDoc.query_parameters && (
          <tr>
            <td>
              <strong>Query Parameters:</strong>
            </td>
            <td className="content-flush-bottom">
              <Params params={apiDoc.query_parameters} />
            </td>
          </tr>
        )}

        {apiDoc.parameters && (
          <tr>
            <td>
              <strong>Parameters:</strong>
            </td>
            <td className="content-flush-bottom">
              <Params params={apiDoc.parameters} />
            </td>
          </tr>
        )}

        {apiDoc.authentication && (
          <tr>
            <td>
              <strong>Authentication:</strong>
            </td>
            <td>{apiDoc.authentication}</td>
          </tr>
        )}

        {apiDoc.method && (
          <tr>
            <td>
              <strong>Method:</strong>
            </td>
            <td>{apiDoc.method}</td>
          </tr>
        )}

        {apiDoc.api_path && (
          <tr>
            <td>
              <strong>Path:</strong>
            </td>
            <td>{apiDoc.api_path}</td>
          </tr>
        )}
      </table>

      {apiDoc.example_request && (
        <React.Fragment>
          <h2>Example Request</h2>

          <pre>{apiDoc.example_request}</pre>
        </React.Fragment>
      )}

      {apiDoc.example_response && (
        <React.Fragment>
          <h2>Example Response</h2>

          <pre>{apiDoc.example_response}</pre>
        </React.Fragment>
      )}
    </Layout>
  );
};

export const pageQuery = graphql`
  query ApiQuery($id: String) {
    site {
      siteMetadata {
        title
        homeUrl
        sitePath
      }
    }
    apiDoc(id: { eq: $id }) {
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
