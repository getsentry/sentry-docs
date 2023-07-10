import {GatsbyNode} from 'gatsby';

import {sourceAppRegistryNodes} from './appRegistryNodes';
import {sourceAwsLambdaLayerRegistryNodes} from './awsLambdLayerRegistryNodes';
import {sourcePackageRegistryNodes} from './packageRegistryNodes';
import {sourcePlatformNodes} from './platformNodes';
import {relayMetricsNodes} from './relayMetricsNodes';
import {piiFieldsNodes} from './relayPiiNodes';

const sourceNodes: GatsbyNode['sourceNodes'] = async params => {
  relayMetricsNodes(params);
  piiFieldsNodes(params);
  await sourcePlatformNodes(params);
  await sourcePackageRegistryNodes(params);
  await sourceAppRegistryNodes(params);
  await sourceAwsLambdaLayerRegistryNodes(params);
};

export default sourceNodes;
