import React from "react";
import { graphql } from "gatsby";

import BasePage from "~src/components/basePage";
import SmartLink from "~src/components/smartLink";
import DevelopmentApiSidebar from "~src/components/developmentApiSidebar";

export default props => {
  const {
    data: { allOpenApi },
  } = props;

  let groupedByTags = allOpenApi.edges.reduce((acc, { node: { path } }) => {
    const { tags } = path;
    if (!acc[tags[0]]) {
      acc[tags[0]] = [];
    }
    acc[tags[0]].push(path);
    return acc;
  }, {});

  return (
    <BasePage sidebar={<DevelopmentApiSidebar />} {...props}>
      <h2>Endpoints</h2>
      <p>A full list of the currently supported API endpoints:</p>
      <ul>
        {Object.entries(groupedByTags).map(([tag, paths]) => (
          <li key={tag}>
            {tag}{" "}
            <ul>
              {paths.map(path => (
                <li key={path.operationId}>
                  <SmartLink to={path.readableUrl}>
                    {path.operationId}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </BasePage>
  );
};

export const pageQuery = graphql`
  query OpenApiReferenceQuery {
    allOpenApi {
      edges {
        node {
          id
          path {
            operationId
            readableUrl
            tags
          }
        }
      }
    }
  }
`;
