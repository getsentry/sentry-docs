import React from "react";
import Select from "react-select";
import { StaticQuery, graphql } from "gatsby";

import usePlatform from "./hooks/usePlatform";

const query = graphql`
  query PlatformSelectorQuery {
    allPlatform(sort: { fields: name }) {
      nodes {
        name
        title
        guides {
          name
          title
        }
      }
    }
  }
`;

type Props = {
  data: {
    allPlatform: {
      nodes: {
        name: string;
        title: string;
        guides: {
          name: string;
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
        { value: platform.name, label: platform.title },
        ...(platform.guides || []).map(g => ({
          value: `${platform.name}.${g.name}`,
          label: g.title,
        })),
      ],
    };
  };

  return (
    <Select
      placeholder="Select Platform"
      defaultValue={toOption(platform)}
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
