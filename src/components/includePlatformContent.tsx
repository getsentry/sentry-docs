import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';

import Content from './content';

const includePlatformContentQuery = graphql`
  query IncludePlatformContentQuery {
    allFile(filter: {sourceInstanceName: {eq: "platforms"}}) {
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

export default function IncludePlatformContent({name}: Props): JSX.Element {
  const {
    allFile: {nodes: files},
  } = useStaticQuery(includePlatformContentQuery);

  const match = files.find(node => node.relativePath === name);
  if (match) {
    return <Content file={match} />;
  }
  throw Error(`could not find platform file for ${name}`);
}
