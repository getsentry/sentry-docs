import React from 'react';
import Select from 'react-select';
import {graphql, StaticQuery} from 'gatsby';

import usePlatform from './hooks/usePlatform';

const query = graphql`
  query PlatformSelectorQuery {
    allPlatform(sort: {fields: name}) {
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
        guides: {
          key: string;
          title: string;
        }[];
        key: string;
        title: string;
      }[];
    };
  };
};

function platformToOption(platform) {
  return {
    label: platform.title,
    options: [
      {value: platform.key, label: platform.title},
      ...(platform.guides || []).map(g => ({
        value: g.key,
        label: g.title,
      })),
    ],
  };
}

export function BasePlatformSelector({
  data: {
    allPlatform: {nodes: platformList},
  },
}: Props): JSX.Element {
  const [platform, setPlatform] = usePlatform();

  const onChange = value => {
    if (!value) {
      return;
    }
    setPlatform(value.value);
  };

  return (
    <Select
      placeholder="Select Platform"
      defaultValue={{label: platform.title, value: platform.key}}
      options={platformList.map(platformToOption)}
      onChange={onChange}
    />
  );
}

export default function PlatformSelector(): JSX.Element {
  return (
    <StaticQuery query={query} render={data => <BasePlatformSelector data={data} />} />
  );
}
