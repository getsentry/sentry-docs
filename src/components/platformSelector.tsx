import React from "react";
import Select from "react-select";
import { StaticQuery, graphql } from "gatsby";

import usePlatform, { Platform, PLATFORMS } from "./hooks/usePlatform";

const query = graphql`
  query PlatformSelectorQuery {
    allSitePage(
      filter: {
        context: { draft: { ne: false } }
        path: { regex: "/^/platforms/" }
      }
    ) {
      nodes {
        path
        context {
          title
          platform {
            name
          }
          guide {
            name
          }
        }
      }
    }
  }
`;

type Props = {
  data: {
    allSitePage: {
      nodes: {
        path: string;
        context: {
          title: string;
          platform?: {
            name: string;
          };
          guide?: {
            name: string;
          };
        };
      }[];
    };
  };
};

export const PlatformSelector = ({
  data: {
    allSitePage: { nodes },
  },
}: Props): JSX.Element => {
  const [platform, setPlatform] = usePlatform();

  const onChange = value => {
    if (!value) return;
    setPlatform(value.value);
  };

  const toOption = (platform: Platform) => {
    return {
      label: platform.displayName,
      options: [
        { value: platform.name, label: platform.displayName },
        ...(platform.children || []).map((p: Platform) => ({
          value: `${platform.name}.${p.name}`,
          label: p.displayName,
        })),
      ],
    };
  };

  return (
    <Select
      placeholder="Select Platform"
      defaultValue={toOption(platform)}
      options={PLATFORMS.map(toOption)}
      onChange={onChange}
    />
  );
};

export default (): JSX.Element => {
  return (
    <StaticQuery
      query={query}
      render={data => <PlatformSelector data={data} />}
    />
  );
};
