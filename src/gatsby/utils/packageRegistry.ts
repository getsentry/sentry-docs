import axios from "axios";

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
  package_url: string;
  repo_url: string;
  version: string;
};

export default class PackageRegistry {
  indexCache: { [name: string]: VersionData } | null;
  cache: { [name: string]: VersionData | {} };

  constructor() {
    this.indexCache = null;
    this.cache = {};
  }

  getList = async () => {
    if (!this.indexCache) {
      try {
        const result = await axios({
          url: `https://release-registry.services.sentry.io/sdks`,
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
    if (!this.cache[name]) {
      console.info(`Fetching release registry for ${name}`);
      try {
        const result = await axios({
          url: `https://release-registry.services.sentry.io/sdks/${name}/latest`,
        });
        this.cache[name] = result.data;
      } catch (err) {
        console.error(`Unable to fetch registry for ${name}: ${err.message}`);
        this.cache[name] = {};
      }
    }

    return this.cache[name];
  };

  version = async (name, defaultValue: string = "") => {
    const data = (await this.getData(name)) as VersionData;
    return data.version || defaultValue;
  };

  checksum = async (name, fileName: string, checksum: string) => {
    const data = (await this.getData(name)) as VersionData;
    if (!data.files) return "";
    return data.files[fileName].checksums[checksum] || "";
  };
}
