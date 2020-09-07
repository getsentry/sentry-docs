import { sourcePlatformNodes } from "./platformNodes";
import { sourcePackageRegistryNodes } from "./packageRegistryNodes";
import { relayMetricsNodes } from "./relayMetricsNodes";

export default params => {
  relayMetricsNodes(params);
  sourcePlatformNodes(params);
  sourcePackageRegistryNodes(params);
};
