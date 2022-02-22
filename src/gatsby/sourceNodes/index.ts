import { sourcePlatformNodes } from "./platformNodes";
import { sourcePackageRegistryNodes } from "./packageRegistryNodes";
import { sourceAppRegistryNodes } from "./appRegistryNodes";
import { sourceAwsLambdaLayerRegistryNodes } from "./awsLambdLayerRegistryNodes";
import { relayMetricsNodes } from "./relayMetricsNodes";

export default async params => {
  await Promise.all([
    relayMetricsNodes(params),
    sourcePlatformNodes(params),
    sourcePackageRegistryNodes(params),
    sourceAppRegistryNodes(params),
    sourceAwsLambdaLayerRegistryNodes(params),
  ]);
};
