import axios from "axios";

import { BASE_REGISTRY_URL } from "./shared";

type LayerData = {
  canonical: string;
  main_docs_url: string;
  name: string;
  repo_url: string;
  account_number: string;
  layer_name: string;
  sdk_version: string;
  regions: Array<{ region: string; version: string }>;
};

export default class AwsLambdaLayerRegistry {
  indexCache: { [cannonical: string]: LayerData } | null;

  constructor() {
    this.indexCache = null;
  }

  getLayerMap = async () => {
    if (!this.indexCache) {
      try {
        const result = await axios({
          url: `${BASE_REGISTRY_URL}/aws-lambda-layers`,
        });
        this.indexCache = result.data;
      } catch (err) {
        console.error(
          `Unable to fetch index for aws lambda layers: ${err.message}`
        );
        this.indexCache = {};
      }
    }
    return this.indexCache;
  };
}
