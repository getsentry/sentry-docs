import React from "react";
import { StaticQuery, graphql } from "gatsby";

import SmartLink from "./smartLink";
import { sortBy } from "../utils";

const query = graphql`
  query PlatformGuideQuery {
    allSitePage(
      filter: {
        path: { regex: "//guides/[^/]+/$/" }
        context: { guide: { name: { ne: null } } }
      }
    ) {
      nodes {
        path
        context {
          platform {
            name
          }
          guide {
            name
            title
          }
        }
      }
    }
  }
`;

type Node = {
  path: string;
  context: {
    platform: {
      name: string;
    };
    guide: {
      name: string;
      title: string;
    };
  };
};

type Props = {
  platform: string;
};

type ChildProps = Props & {
  data: {
    allSitePage: {
      nodes: Node[];
    };
  };
};

export const GuideGrid = ({ platform, data }: ChildProps): JSX.Element => {
  let matches = sortBy(
    data.allSitePage.nodes.filter(n => n.context.platform.name === platform),
    (n: Node) => n.context.guide.title
  );
  return (
    <ul>
      {matches.map(n => (
        <li key={n.context.guide.name}>
          <SmartLink to={n.path}>{n.context.guide.title}</SmartLink>
        </li>
      ))}
    </ul>
  );
};

export default (props: Props): JSX.Element => {
  return (
    <StaticQuery
      query={query}
      render={data => <GuideGrid data={data} {...props} />}
    />
  );
};
