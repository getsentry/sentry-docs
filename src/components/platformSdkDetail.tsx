import getPackageRegistry from 'sentry-docs/build/packageRegistry';
import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {PlatformSdkDetailClient} from './platformSdkDetailClient';

export async function PlatformSdkDetail() {
  const {rootNode, path} = serverContext();
  const platformOrGuide = rootNode && getCurrentPlatformOrGuide(rootNode, path);
  if (!platformOrGuide) {
    return null;
  }

  const packageRegistry = await getPackageRegistry();
  const allSdks = packageRegistry.data;
  const entries = Object.entries(allSdks || {});
  const pair: any = entries.find(([sdkName]) => sdkName === platformOrGuide.sdk);
  if (!pair) {
    return null;
  }
  const [, sdkData] = pair;
  if (!sdkData) {
    return null;
  }

  return (
    <PlatformSdkDetailClient
      url={sdkData.package_url}
      canonical={sdkData.canonical}
      version={sdkData.version}
      repoUrl={sdkData.repo_url}
      apiDocsUrl={sdkData.api_docs_url}
    />
  );
}
