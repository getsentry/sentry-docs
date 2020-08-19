const axios = require("axios");

module.exports = class PackageRegistry {
  constructor() {
    this.cache = {};
  }

  getData = async name => {
    if (!this.cache[name]) {
      console.info(`Fetching release registry for ${name}`);
      const result = await axios({
        url: `https://release-registry.services.sentry.io/sdks/${name}/latest`,
      });

      this.cache[name] = result.data;
    }

    return this.cache[name];
  };

  version = async name => {
    const data = await this.getData(name);
    return data.version || "";
  };

  checksum = async (name, fileName, checksum) => {
    const data = await this.getData(name);
    return data.files[fileName].checksums[checksum] || "";
  };
};
