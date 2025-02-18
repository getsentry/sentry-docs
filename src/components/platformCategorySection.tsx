import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {Platform, PlatformCategory, PlatformGuide} from 'sentry-docs/types';

type Props = {
  children?: React.ReactNode;
  noGuides?: boolean;
  notSupported?: PlatformCategory[];
  platform?: string;
  supported?: PlatformCategory[];
};

const isSupported = (
  platformOrGuide: Platform | PlatformGuide,
  supported: PlatformCategory[],
  notSupported: PlatformCategory[]
): boolean => {
  if (platformOrGuide.categories === null) {
    return false;
  }

  const categories = platformOrGuide.categories || [];

  if (supported.length && !supported.some(v => categories.includes(v))) {
    return false;
  }

  if (notSupported.length && notSupported.some(v => categories.includes(v))) {
    return false;
  }

  return true;
};

/**
 * Conditionally renders children based on platform categories.
 * It filters content by checking if the current platform
 * or guide matches the specified supported/not supported categories.
 *
 * @param supported - Array of platform categories that should show this content
 * @param notSupported - Array of platform categories that should not show this content
 * @param noGuides - If true, content will not be shown for platform guides
 * @param children - Content to be conditionally rendered
 *
 * For filtering by platform categories,
 * use PlatformCategorySection instead of PlatformSection.
 */
export function PlatformCategorySection({
  supported = [],
  notSupported = [],
  noGuides,
  children,
}: Props) {
  const {rootNode, path} = serverContext();
  const currentPlatformOrGuide = getCurrentPlatformOrGuide(rootNode, path);

  if (!currentPlatformOrGuide) {
    return null;
  }

  if (noGuides && currentPlatformOrGuide.type !== 'platform') {
    return null;
  }

  if (isSupported(currentPlatformOrGuide, supported, notSupported)) {
    return children;
  }

  return null;
}
