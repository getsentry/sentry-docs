import { sourcePlatformNodes } from "./platformNodes";
import { sourcePackageRegistryNodes } from "./packageRegistryNodes";

export default params => {
  sourcePlatformNodes(params);
  sourcePackageRegistryNodes(params);
};
