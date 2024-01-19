import getPackageRegistry from "sentry-docs/build/packageRegistry";
import { JsBundleListClient } from "./jsBundleListClient";

export async function JsBundleList() {
  const packageRegistry = await getPackageRegistry()
  const javascriptSdk = packageRegistry.data && packageRegistry.data['sentry.javascript.browser'];
  if (!javascriptSdk || !javascriptSdk.files) {
    return null;
  }
  const files = Object.entries(javascriptSdk.files).map(([name, file]) => (
    {
      name,
      checksums: Object.entries(file.checksums).map(([algo, value]) => (
        { name: algo, value }
      ))
    }
  ));
  
  return <JsBundleListClient files={files} />;
}
