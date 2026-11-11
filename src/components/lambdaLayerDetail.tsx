import {
  getLayerIndex,
  getSdkVersionIndex,
} from 'sentry-docs/build/awsLambdaLayerRegistry';
import {getRuntimes} from 'sentry-docs/build/awsLambdaRuntimes';

import {LayerDetailClient} from './lambdaLayerDetailClient';
import {normalizeLayer} from './lambdaLayerUtils';

export async function LambdaLayerDetail({canonical}: {canonical: string}) {
  const layerIndex = await getLayerIndex();
  if (!layerIndex) {
    return null;
  }

  const layers = Object.values(layerIndex).map(normalizeLayer);
  const requestedLayer = layers.find(layer => layer.canonical === canonical);
  if (!requestedLayer) {
    throw new Error(`Could not find layer for: ${canonical}`);
  }
  const [sdkVersionIndex, runtimes] = await Promise.all([
    getSdkVersionIndex(requestedLayer.runtime),
    requestedLayer.runtime === 'python' ? getRuntimes() : undefined,
  ]);

  return (
    <LayerDetailClient
      runtimes={runtimes}
      defaultLayer={requestedLayer}
      sdkVersionIndex={sdkVersionIndex}
    />
  );
}
