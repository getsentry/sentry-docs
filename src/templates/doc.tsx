import React from 'react';
import {graphql} from 'gatsby';

import ApiSidebar from 'sentry-docs/components/apiSidebar';
import BasePage from 'sentry-docs/components/basePage';
import Content from 'sentry-docs/components/content';
import InternalDocsSidebar from 'sentry-docs/components/internalDocsSidebar';

export default function Doc(props: any) {
  let sidebar = null;
  if (props.path.startsWith('/api/')) {
    sidebar = <ApiSidebar />;
  } else if (props.path.startsWith('/contributing/')) {
    sidebar = <InternalDocsSidebar />;
  }
  return (
    <BasePage sidebar={sidebar} {...props}>
      <Content file={props.data.file} />
    </BasePage>
  );
}

export const pageQuery = graphql`
  query DocQuery($id: String) {
    file(id: {eq: $id}) {
      id
      relativePath
      sourceInstanceName
      childMarkdownRemark {
        html
        internal {
          type
        }
      }
      childMdx {
        body
        internal {
          type
        }
      }
    }
  }
`;
