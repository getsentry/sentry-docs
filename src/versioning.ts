export const VERSION_INDICATOR = '__v';

export const getLocalStorageVersionKey = (platform: string) => `version:${platform}`;

export const getUnversionedPath = (path: string | string[], trailingSlash = true) => {
  const joined = Array.isArray(path) ? path.join('/') : path;
  const unversioned = joined.split(VERSION_INDICATOR)[0];
  if (trailingSlash) {
    return unversioned[unversioned.length - 1] === '/' ? unversioned : `${unversioned}/`;
  }
  return unversioned;
};

export const isVersioned = (path: string) => path.includes(VERSION_INDICATOR);
