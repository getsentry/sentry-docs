import axios from 'axios';

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
   * The name of the regsistry
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
export function makeGenericRegistry({name, path}: Options) {
  const getList = makeFetchCache<Record<string, VersionData>>({
    name,
    dataFetch: () => axios({url: `${BASE_REGISTRY_URL}/${path}`}),
  });

  async function getData(key: string) {
    const list = await getList();
    return list[key];
  }

  async function version(key: string, defaultValue: string = '') {
    const data = await getData(key);
    return data?.version || defaultValue;
  }

  async function checksum(key: string, fileName: string, checksumKey: string) {
    const data = await getData(key);
    return data?.files?.[fileName]?.checksums?.[checksumKey] || '';
  }

  return {
    getList,
    getData,
    version,
    checksum,
  };
}
