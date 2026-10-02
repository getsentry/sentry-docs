import {makeFetchCache} from './fetchCache';
import {BASE_REGISTRY_URL} from './shared';

export type LayerData = {
  account_number: string;
  canonical: string;
  compatible_runtimes: string[];
  layer_name: string;
  regions: Array<{layer_version: string; region: string}>;
  runtime: string;
  sdk_version: string;
};

type SdkVersionMetadata = {
  compatible_runtimes: string[];
};

export type SdkVersionIndex = {
  versions: string[];
  version_metadata: Record<string, SdkVersionMetadata>;
};

export const getLayerIndex = makeFetchCache<Record<string, LayerData>>({
  name: 'layer index',
  dataUrl: `${BASE_REGISTRY_URL}/aws-lambda-layers/index`,
});

const sdkVersionFetchers = new Map<
  string,
  ReturnType<typeof makeFetchCache<SdkVersionIndex>>
>();

export async function getSdkVersionIndex(runtime: string): Promise<SdkVersionIndex> {
  let fetchSdkVersions = sdkVersionFetchers.get(runtime);
  if (!fetchSdkVersions) {
    fetchSdkVersions = makeFetchCache<SdkVersionIndex>({
      name: `${runtime} layer SDK versions`,
      dataUrl: `${BASE_REGISTRY_URL}/aws-lambda-layers/${runtime}/versions`,
    });
    sdkVersionFetchers.set(runtime, fetchSdkVersions);
  }

  const versionIndex = await fetchSdkVersions();
  if (!versionIndex) {
    throw new Error(`Could not load layer SDK versions for ${runtime}`);
  }

  return versionIndex;
}
