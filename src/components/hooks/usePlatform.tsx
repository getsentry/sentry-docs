import { useLocation, useNavigate, WindowLocation } from "@reach/router";

import useLocalStorage from "./useLocaleStorage";

export type Platform = {
  name: string;
  displayName: string;
  children?: Platform[];
};

export const PLATFORMS: Platform[] = [
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

export default (
  defaultValue: string | null,
  readLocalStorage = true
): [Platform, (value: string) => void] => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const location = useLocation();
  const navigate = useNavigate();

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
    let valueSearch = PLATFORMS;
    currentValue.split(".").forEach(bit => {
      if (bit) {
        activeValue = valueSearch.find(p => p.name === bit);
        if (activeValue) {
          valueSearch = activeValue.children;
        }
      }
    });
  }

  if (!activeValue) {
    activeValue = PLATFORMS.find(
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
      let valueSearch = PLATFORMS;
      if (bit) {
        activeValue = valueSearch.find(p => p.name === bit);
        if (activeValue) {
          valueSearch = activeValue.children;
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
