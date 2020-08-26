const axios = require("axios");

module.exports = class PackageRegistry {
  constructor() {
    this.cache = {};
  }

  getData = async name => {
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

  version = async (name, defaultValue = "") => {
    const data = await this.getData(name);
    return data.version || defaultValue;
  };

  checksum = async (name, fileName, checksum) => {
    const data = await this.getData(name);
    return data.files[fileName].checksums[checksum] || "";
  };
};
