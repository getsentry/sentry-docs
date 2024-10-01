export const VERSION_INDICATOR = '__v';

export const getLocalStorageVersionKey = (platform: string) => `version:${platform}`;

export const getUnversionedPath = (path: string) => {
  const unversioned = path.split(VERSION_INDICATOR)[0];
  return unversioned[unversioned.length - 1] === '/' ? unversioned : `${unversioned}/`;
};
