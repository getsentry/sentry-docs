import React from "react";
import Select from "react-select";
import { StaticQuery, graphql } from "gatsby";

import usePlatform from "./hooks/usePlatform";

const query = graphql`
  query PlatformSelectorQuery {
    allPlatform(sort: { fields: name }) {
      nodes {
        key
        name
        title
        guides {
          name
          title
          key
        }
      }
    }
  }
`;

type Props = {
  data: {
    allPlatform: {
      nodes: {
        key: string;
        title: string;
        guides: {
          key: string;
          title: string;
        }[];
      }[];
    };
  };
};

export const PlatformSelector = ({
  data: {
    allPlatform: { nodes: platformList },
  },
}: Props): JSX.Element => {
  const [platform, setPlatform] = usePlatform();

  const onChange = value => {
    if (!value) return;
    setPlatform(value.value);
  };

  const toOption = platform => {
    return {
      label: platform.title,
      options: [
        { value: platform.key, label: platform.title },
        ...(platform.guides || []).map(g => ({
          value: g.key,
          label: g.title,
        })),
      ],
    };
  };

  return (
    <Select
      placeholder="Select Platform"
      defaultValue={{ label: platform.title, value: platform.key }}
      options={platformList.map(toOption)}
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
