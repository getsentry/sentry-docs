import {makeFetchCache} from './fetchCache';
import {BASE_REGISTRY_URL} from './shared';

type FileData = {
  checksums: {
    [name: string]: string;
  };
};

type VersionData = {
  canonical: string;
  main_docs_url: string;
  name: string;
  repo_url: string;
  version: string;
  files?: {
    [name: string]: FileData;
  };
  package_url?: string;
};

interface Options {
  /**
   * The name of the registry
   */
  name: string;
  /**
   * The URL path of the registry
   */
  path: string;
}

// XXX(epurkhiser): Right now the SDK and Apps registry have the same
// structure, so we can reuse the same helpers

/**
 * Constructs helper functions for a "generic" registry.
 */
export function makeRegistry({name, path}: Options) {
  const ensureData = makeFetchCache<Record<string, VersionData>>({
    name,
    dataUrl: `${BASE_REGISTRY_URL}/${path}`,
  });

  async function resolveRegistry() {
    const data = await ensureData();

    /**
     * Note that this will return `null` unless `ensureData` has been called.
     */
    function getItem(key: string) {
      return data?.[key] ?? null;
    }

    function version(key: string, defaultValue: string = '') {
      const item = getItem(key);
      return item?.version || defaultValue;
    }

    function checksum(key: string, fileName: string, checksumKey: string) {
      const item = getItem(key);
      return item?.files?.[fileName]?.checksums?.[checksumKey] || '';
    }

    /**
     * Provides a synchronous interface for accessing data from the registry.
     * `ensureData` must be called first otherwise these will return empty values
     */
    const accessors = {
      data,
      getItem,
      version,
      checksum,
    };

    return accessors;
  }

  return resolveRegistry;
}
