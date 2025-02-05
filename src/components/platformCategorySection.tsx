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
