import {BASE_REGISTRY_URL} from './shared';
import axios from 'axios';

type LayerData = {
  account_number: string;
  canonical: string;
  layer_name: string;
  main_docs_url: string;
  name: string;
  regions: Array<{region: string; version: string}>;
  repo_url: string;
  sdk_version: string;
};

export default class AwsLambdaLayerRegistry {
  indexCache: {[cannonical: string]: LayerData} | null;

  constructor() {
    this.indexCache = null;
  }

  getLayerMap = async () => {
    if (!this.indexCache) {
      try {
        const result = await axios(`${BASE_REGISTRY_URL}/aws-lambda-layers`);
        this.indexCache = result.data;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Unable to fetch index for aws lambda layers: ${err.message}`);
        this.indexCache = {};
      }
    }
    return this.indexCache;
  };
}
