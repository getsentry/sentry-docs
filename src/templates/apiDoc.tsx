import React from 'react';
import {graphql} from 'gatsby';

import ApiSidebar from '~src/components/apiSidebar';
import BasePage from '~src/components/basePage';
import Content from '~src/components/content';
import SmartLink from '~src/components/smartLink';

export default function ApiDoc(props) {
  const {
    data: {allOpenApi, apiDescription},
  } = props;
  return (
    <BasePage sidebar={<ApiSidebar />} {...props}>
      {apiDescription && <Content file={apiDescription} />}
      <ul data-noindex>
        {allOpenApi.edges.map(({node: {path}}) => (
          <li
            key={path.operationId}
            style={{
              marginBottom: '1rem',
            }}
          >
            <h4>
              <SmartLink to={path.readableUrl}>{path.operationId}</SmartLink>
            </h4>
          </li>
        ))}
      </ul>
    </BasePage>
  );
}

export const pageQuery = graphql`
  query OpenApiDocQuery($tag: [String]) {
    allOpenApi(filter: {path: {tags: {in: $tag}}}, sort: {fields: path___operationId}) {
      edges {
        node {
          id
          path {
            operationId
            readableUrl
          }
        }
      }
    }
    apiDescription(name: {in: $tag}) {
      childMdx {
        body
      }
    }
  }
`;
