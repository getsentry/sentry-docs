import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';

import {Content} from './content';

const includeQuery = graphql`
  query IncludeQuery {
    allFile(filter: {sourceInstanceName: {eq: "includes"}}) {
      nodes {
        id
        relativePath
        name
        childMdx {
          body
        }
      }
    }
  }
`;

type Props = {
  name: string;
};

export function Include({name}: Props): JSX.Element {
  const {
    allFile: {nodes: files},
  } = useStaticQuery(includeQuery);

  const match = files.find(node => node.relativePath === name);
  if (match) {
    return <Content file={match} />;
  }
  throw Error(`could not find include file for ${name}`);
}
