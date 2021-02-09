import AwsLambdaLayerRegistry from "../utils/awsLambdaLayerRegistry";

export const sourceAwsLambdaLayerRegistryNodes = async ({
  actions,
  createContentDigest,
}) => {
  const { createNode } = actions;

  const registry = new AwsLambdaLayerRegistry();
  const layerMap = await registry.getLayerMap();

  Object.keys(layerMap).forEach(cannonicalName => {
    const layerData = layerMap[cannonicalName];

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

    createNode({
      ...data,
      ...nodeMeta,
    });
  });
};
