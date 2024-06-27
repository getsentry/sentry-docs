import {getCurrentPlatformOrGuide} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {Platform, PlatformGuide} from 'sentry-docs/types';

type Props = {
  children?: React.ReactNode;
  noGuides?: boolean;
  notSupported?: string[];
  platform?: string;
  supported?: string[];
};

const isSupported = (
  platformOrGuide: Platform | PlatformGuide,
  supported: string[],
  notSupported: string[]
): boolean => {
  if (platformOrGuide.categories === null) {
    return false;
  }

  // @ts-ignore
  const categories = Object.values(platformOrGuide.categories) as string[];

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
