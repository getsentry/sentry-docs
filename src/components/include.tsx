import React from "react";
import styled from "@emotion/styled";
import { graphql, useStaticQuery } from "gatsby";

import usePlatform, {
  getPlatform,
  getPlatformsWithFallback,
  Platform,
} from "./hooks/usePlatform";
import Content from "./content";
import SmartLink from "./smartLink";


const includeQuery = graphql`
  query IncludeQuery {
    allFile(filter: { sourceInstanceName: { eq: "includes" } }) {
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

export default ({ name }: Props): JSX.Element => {
  const {
    allFile: { nodes: files },
  } = useStaticQuery(includeQuery);

  const match = files.find(node => node.relativePath == name);
  if (match) {
    return <Content file={match} />;
  } else {
    throw Error(`could not find include file for ${name}`);
  }
};
