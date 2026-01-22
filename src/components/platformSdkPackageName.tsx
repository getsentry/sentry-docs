import getPackageRegistry from 'sentry-docs/build/packageRegistry';
import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {Platform, PlatformGuide} from 'sentry-docs/types/platform';

type PlatformSdkPackageNameProps = {
  /**
   * The fallback value to display if the SDK package name is not found.
   * @default 'Sentry'
   */
  fallback?: string;
};

/**
 * Gets the SDK package name for a platform or guide.
 * Example: `@sentry/react`
 */
export async function getSdkPackageName(
  platformOrGuide: Platform | PlatformGuide | null | undefined
): Promise<string | null> {
  if (!platformOrGuide) {
    return null;
  }

  const packageRegistry = await getPackageRegistry();
  const allSdks = packageRegistry.data;
  const entries = Object.entries(allSdks || {});
  const pair = entries.find(([sdkName]) => sdkName === platformOrGuide.sdk);
  if (!pair) {
    return null;
  }
  const [, sdkData] = pair;
  if (!sdkData) {
    return null;
  }

  return sdkData.canonical.replace(/^npm:/, '') || null;
}

/**
 * Displays the SDK package name for the current platform or guide.
 * Example: `@sentry/react`
 */
export async function PlatformSdkPackageName({fallback}: PlatformSdkPackageNameProps) {
  const fallbackName = fallback || 'Sentry';
  const {rootNode, path} = serverContext();
  const platformOrGuide = getCurrentPlatformOrGuide(rootNode, path);

  const sdkPackage = await getSdkPackageName(platformOrGuide);

  return <code>{sdkPackage || fallbackName} </code>;
}
