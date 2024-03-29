import getPackageRegistry from 'sentry-docs/build/packageRegistry';
import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

type PlatformSdkPackageNameProps = {
  /**
   * The fallback value to display if the SDK package name is not found.
   * @default 'Sentry'
   */
  fallback?: string;
};

/**
 * Displays the SDK package name for the current platform or guide.
 * Example: `@sentry/react`
 */
export async function PlatformSdkPackageName({fallback}: PlatformSdkPackageNameProps) {
  const fallbackName = fallback || 'Sentry';
  const {rootNode, path} = serverContext();
  const platformOrGuide = rootNode && getCurrentPlatformOrGuide(rootNode, path);
  if (!platformOrGuide) {
    return <code>{fallbackName} </code>;
  }

  const packageRegistry = await getPackageRegistry();
  const allSdks = packageRegistry.data;
  const entries = Object.entries(allSdks || {});
  const pair = entries.find(([sdkName]) => sdkName === platformOrGuide.sdk);
  if (!pair) {
    return <code>{fallbackName} </code>;
  }
  const [, sdkData] = pair;
  if (!sdkData) {
    return <code>{fallbackName} </code>;
  }

  const prettifiedName = sdkData.canonical.replace(/^npm:/, '');

  return <code>{prettifiedName || fallbackName} </code>;
}
