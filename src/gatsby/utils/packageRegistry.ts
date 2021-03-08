import axios from "axios";

import { BASE_REGISTRY_URL } from "./shared";

type FileData = {
  checksums: {
    [name: string]: string;
  };
};

type VersionData = {
  canonical: string;
  files?: {
    [name: string]: FileData;
  };
  main_docs_url: string;
  name: string;
  package_url?: string;
  repo_url: string;
  version: string;
};

export default class PackageRegistry {
  indexCache: { [name: string]: VersionData } | null;

  constructor() {
    this.indexCache = null;
  }

  getList = async () => {
    if (!this.indexCache) {
      try {
        const result = await axios({
          url: `${BASE_REGISTRY_URL}/sdks`,
        });
        this.indexCache = result.data;
      } catch (err) {
        console.error(
          `Unable to fetch index for package registry: ${err.message}`
        );
        this.indexCache = {};
      }
    }
    return this.indexCache;
  };

  getData = async (name: string) => {
    await this.getList();
    return this.indexCache[name];
  };

  version = async (name: string, defaultValue: string = "") => {
    const data = (await this.getData(name)) as VersionData;
    return (data && data.version) || defaultValue;
  };

  checksum = async (name: string, fileName: string, checksum: string) => {
    const data = (await this.getData(name)) as VersionData;
    if (!data.files) return "";
    return data.files[fileName].checksums[checksum] || "";
  };
}
