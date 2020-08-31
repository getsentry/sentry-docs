import { graphql, useStaticQuery } from "gatsby";
import { useLocation, useNavigate, WindowLocation } from "@reach/router";

import useLocalStorage from "./useLocaleStorage";

const query = graphql`
  query UsePlatformQuery {
    allPlatform {
      nodes {
        id
        name
        title
        caseStyle
        supportLevel
        guides {
          name
          title
          caseStyle
          supportLevel
        }
      }
    }
  }
`;

export enum CaseStyle {
  canonical,
  camelCase,
  PascalCase,
  snake_case,
}

export enum SupportLevel {
  production,
}

export type Guide = {
  name: string;
  title: string;
  caseStyle: CaseStyle;
  supportLevel: SupportLevel;
};

export type Platform = {
  name: string;
  title: string;
  caseStyle: CaseStyle;
  supportLevel: SupportLevel;
  guides?: Guide[];
};

export const DEFAULT_PLATFORM = "javascript";

const getPlatformFromLocation = (
  location: WindowLocation
): [string, string | null] | null => {
  const pattern = /\/platforms\/([^\/]+)\/(?:guides\/([^\/]+)\/)?/i;
  const match = location.pathname.match(pattern);
  return match ? [match[1], match[2]] : null;
};

const rebuildPathForPlatform = (
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

/**
 * The usePlatform() hook will allow you to reference the currently active platform.
 *
 * ```
 * const [platform, setPlatform] = usePlatform()
 * ```
 *
 * The function signatures differ, where the returned `platform` value is an object of
 * type `Platform`, and `setPlatform` takes the platform name as a string.
 *
 * The active platform is decided based on a few heuristics:
 * - if you're on a platform page, its _always_ pulled from the URL
 * - otherwise its pulled from local storage (last platform selected)
 * - otherwise its pulled from `defaultValue` (or `DEFAULT_PLATFORM` if none)
 *
 * If the `readLocalStorage` option is disabled the saved value will be ignored
 * when falling back to a default.
 *
 * If you're operating in a context that is _only_ for a specific platform, you
 * want to pass `defaultValue` with the effective platform to avoid fallbacks.
 */
export default (
  defaultValue: string | null = DEFAULT_PLATFORM,
  readLocalStorage = true
): [Platform, (value: string) => void] => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const location = useLocation();
  const navigate = useNavigate();
  const {
    allPlatform: { nodes: platformList },
  } = useStaticQuery(query);

  const [storedValue, setStoredValue] = useLocalStorage<string | null>(
    "platform",
    null
  );

  let valueFromLocation = getPlatformFromLocation(location);
  let currentValue: string | null = valueFromLocation
    ? valueFromLocation.join(".")
    : null;

  if (!currentValue && readLocalStorage) {
    currentValue = storedValue;
  }

  let activeValue: Platform = null;
  if (currentValue) {
    let valueSearch = platformList;
    currentValue.split(".").forEach(bit => {
      if (bit && valueSearch) {
        activeValue = valueSearch.find(p => p.name === bit);
        if (activeValue) {
          valueSearch = activeValue.guides;
        }
      }
    });
  }

  if (!activeValue) {
    activeValue = platformList.find(
      p => p.name === defaultValue || DEFAULT_PLATFORM
    );
    // TODO(dcramer): ideally we'd clear invalid saved values, but its not a huge deal
    // if (currentValue) {
    //   setStoredValue(DEFAULT_PLATFORM);
    // }
  }

  const setValue = (value: string) => {
    if (value == currentValue) return;
    setStoredValue(value);
    // if (!nodes.find(n => n.path === path)) {
    //   path = rebuildPathForPlatform(value);
    // }
    if (!value) return;
    let activeValue: Platform;
    value.split(".").forEach(bit => {
      let valueSearch = platformList;
      if (bit) {
        activeValue = valueSearch.find(p => p.name === bit);
        if (activeValue) {
          valueSearch = activeValue.guides;
        }
      }
    });
    let path = rebuildPathForPlatform(value, location.pathname);
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  return [activeValue, setValue];
};
