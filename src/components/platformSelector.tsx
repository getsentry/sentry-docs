import React from "react";
import Select from "react-select";
import { useLocation, useNavigate } from "@reach/router";
import { StaticQuery, graphql } from "gatsby";

type Platform = {
  name: string;
  displayName: string;
  children?: Platform[];
};

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

const getPlatformFromLocation = (location): [string, string | null] | null => {
  const pattern = /\/platforms\/([^\/]+)\/(?:guides\/([^\/]+)\/)?/i;
  const match = location.pathname.match(pattern);
  return match ? [match[1], match[2]] : null;
};

const getPathForPlatform = (
  platformValue: string,
  currentPath?: string
): string => {
  const [platformName, guideName] = platformValue.split(".");
  const newPathPrefix = guideName
    ? `/platforms/${platformName}/guides/${guideName}/`
    : `/platforms/${platformName}/`;
  const pattern = /\/platforms\/([^\/]+)\/(?:guides\/([^\/]+)\/)?/i;
  return currentPath
    ? currentPath.replace(pattern, newPathPrefix)
    : newPathPrefix;
};

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
  const navigate = useNavigate();
  const location = useLocation();

  let platformFromLocation = getPlatformFromLocation(location);
  let platform: string | null = platformFromLocation
    ? platformFromLocation.join(".")
    : null;

  const storage = window.localStorage;
  if (!platform && storage) {
    try {
      platform = storage.getItem("platform");
    } catch (ex) {}
  }

  const platforms: Platform[] = [
    {
      name: "python",
      displayName: "Python",
      children: [{ name: "django", displayName: "Django" }],
    },
    {
      name: "javascript",
      displayName: "JavaScript",
    },
  ];

  const defaultPlatform = platforms.find(p => p.name === "javascript");
  let activePlatform: Platform;
  if (platform) {
    let platformSearch = platforms;
    platform.split(".").forEach(bit => {
      if (bit) {
        activePlatform = platformSearch.find(p => p.name === bit);
        if (activePlatform) {
          platformSearch = activePlatform.children;
        }
      }
    });
  }

  if (!activePlatform) {
    activePlatform = defaultPlatform;
    if (platform && storage) {
      try {
        storage.deleteItem("platform");
      } catch (ex) {}
    }
  }

  const onChange = value => {
    if (!value) return;
    try {
      storage.setItem("platform", value.value);
    } catch (ex) {}
    let path = getPathForPlatform(value.value, location.pathname);
    if (!nodes.find(n => n.path === path)) {
      path = getPathForPlatform(value.value);
    }
    if (path !== location.pathname) {
      navigate(path);
    }
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
      defaultValue={activePlatform ? toOption(activePlatform) : null}
      options={platforms.map(toOption)}
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
