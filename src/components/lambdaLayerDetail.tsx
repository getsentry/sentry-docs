import awsLambdaRegistry from 'sentry-docs/build/awsLambdaLayerRegistry';

import {LambdaLayerDetailClient} from './lambdaLayerDetailClient';

export async function LambdaLayerDetail({canonical}: {canonical: string}) {
  const layerMap = await awsLambdaRegistry.getLayerMap();
  if (!layerMap) {
    return null;
  }
  const layerList = Object.values(layerMap).map(layer => ({
    ...layer,
    accountNumber: layer.account_number,
    layerName: layer.layer_name,
    regions: [...layer.regions].sort((a, b) => a.region.localeCompare(b.region)),
  }));

  return <LambdaLayerDetailClient canonical={canonical} layerList={layerList} />;
}
