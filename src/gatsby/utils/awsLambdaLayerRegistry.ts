import {makeFetchCache} from './fetchCache';
import {BASE_REGISTRY_URL} from './shared';

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

const getLayerMap = makeFetchCache<Record<string, LayerData>>({
  name: 'aws lambda layers',
  dataUrl: `${BASE_REGISTRY_URL}/aws-lambda-layers`,
});

const awsLambdaRegistry = {getLayerMap};

export default awsLambdaRegistry;
