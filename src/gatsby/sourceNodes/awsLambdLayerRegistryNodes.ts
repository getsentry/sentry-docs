import {SourceNodesArgs} from 'gatsby';

import awsLambdaRegistry from '../utils/awsLambdaLayerRegistry';

export const sourceAwsLambdaLayerRegistryNodes = async ({
  actions,
  createContentDigest,
}: SourceNodesArgs) => {
  const {createNode} = actions;

  const layerMap = await awsLambdaRegistry.getLayerMap();

  Object.entries(layerMap).forEach(([cannonicalName, layerData]) => {
    const data = {
      canonical: layerData.canonical,
      regions: layerData.regions,
      sdkVersion: layerData.sdk_version,
      layerName: layerData.layer_name,
      accountNumber: layerData.account_number,
    };

    const content = JSON.stringify(data);
    const nodeMeta = {
      id: cannonicalName,
      parent: null,
      children: [],
      internal: {
        type: `Layer`,
        content,
        contentDigest: createContentDigest(data),
      },
    };

    createNode({...data, ...nodeMeta});
  });
};
