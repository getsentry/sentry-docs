import {sourceAppRegistryNodes} from './appRegistryNodes';
import {sourceAwsLambdaLayerRegistryNodes} from './awsLambdLayerRegistryNodes';
import {sourcePackageRegistryNodes} from './packageRegistryNodes';
import {sourcePlatformNodes} from './platformNodes';
import {relayMetricsNodes} from './relayMetricsNodes';

export default async params => {
  await Promise.all([
    relayMetricsNodes(params),
    sourcePlatformNodes(params),
    sourcePackageRegistryNodes(params),
    sourceAppRegistryNodes(params),
    sourceAwsLambdaLayerRegistryNodes(params),
  ]);
};
