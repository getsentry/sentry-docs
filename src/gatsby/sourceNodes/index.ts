import { sourceAppRegistryNodes } from './appRegistryNodes';
import { sourceAwsLambdaLayerRegistryNodes } from './awsLambdLayerRegistryNodes';
import { sourcePackageRegistryNodes } from './packageRegistryNodes';
import { sourcePlatformNodes } from './platformNodes';
import { relayMetricsNodes } from './relayMetricsNodes';
import { piiFieldsNodes } from './relayPiiNodes';

async function main(params) {
  relayMetricsNodes(params);
  piiFieldsNodes(params);
  await sourcePlatformNodes(params);
  await sourcePackageRegistryNodes(params);
  await sourceAppRegistryNodes(params);
  await sourceAwsLambdaLayerRegistryNodes(params);
}

export default main;
