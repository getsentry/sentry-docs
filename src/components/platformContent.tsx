import fs from 'fs';

import {cache, useMemo} from 'react';
import {getMDXComponent} from 'mdx-bundler/client';

import {getCurrentGuide, getDocsRootNode, getPlatform} from 'sentry-docs/docTree';
import getLocale, {getDefaultLocaleSafe} from 'sentry-docs/getLocale';
import {getFileBySlugWithCache} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {serverContext} from 'sentry-docs/serverContext';
import {
  getVersion,
  isVersioned,
  stripVersion,
  VERSION_INDICATOR,
} from 'sentry-docs/versioning';

import {Include} from './include';

type Props = {
  includePath: string;
  children?: React.ReactNode;
  fallbackPlatform?: string;
  noGuides?: boolean;
  platform?: string;
};

const updatePathIfVersionedFileDoesNotExist = (path: string): string => {
  if (!isVersioned(path)) {
    return path;
  }
  // Add .mdx extension if not present
  const pathWithExtension =
    path.endsWith('.mdx') || path.endsWith('.md') ? path : `${path}.mdx`;

  if (isVersioned(pathWithExtension) && !fs.existsSync(pathWithExtension)) {
    return stripVersion(path);
  }

  return path;
};

/**
 * Cache the result of updatePathIfVersionedFileDoesNotExist
 * to avoid calling it multiple times for the same path.
 *
 * This is important because we want to skip the `fs.existsSync` call if possible.
 */
const updatePathIfVersionedFileDoesNotExistWithCache = cache(
  updatePathIfVersionedFileDoesNotExist
);

const withLocalePrefix = (path: string): string => {
  const locale = getLocale();
  const defaultLocale = getDefaultLocaleSafe();
  if (!locale || locale === defaultLocale) {
    return path;
  }
  return path.replace(/^platform-includes/, `platform-includes/${locale}`);
};

const localizedCandidates = (path: string): string[] => {
  const localized = withLocalePrefix(path);
  return localized === path ? [path] : [localized, path];
};

function MDXLayoutRenderer({mdxSource: source, ...rest}) {
  const MDXLayout = useMemo(() => getMDXComponent(source), [source]);
  return <MDXLayout components={mdxComponentsWithWrapper} {...rest} />;
}

export async function PlatformContent({includePath, platform, noGuides}: Props) {
  const {path} = serverContext();

  if (!platform) {
    if (path.length < 2 || path[0] !== 'platforms') {
      return null;
    }
    platform = path[1];
  }

  let guide: string | undefined;
  if (!noGuides && path.length >= 4 && path[2] === 'guides') {
    guide = `${platform}.${path[3]}`;
  }

  let doc: Awaited<ReturnType<typeof getFileBySlugWithCache>> | undefined;

  if (guide) {
    const baseGuidePath = `platform-includes/${includePath}/${guide}`;
    for (const candidate of localizedCandidates(baseGuidePath)) {
      const guidePath = updatePathIfVersionedFileDoesNotExistWithCache(candidate);
      try {
        doc = await getFileBySlugWithCache(guidePath);
        break;
      } catch (e) {
        // keep looking
      }
    }
  }

  if (!doc) {
    const rootNode = await getDocsRootNode();
    const guideObject = getCurrentGuide(rootNode, path);

    if (guideObject?.fallbackGuide) {
      const baseFallbackGuidePath = `platform-includes/${includePath}/${guideObject?.fallbackGuide}${VERSION_INDICATOR}${getVersion(guide || '')}`;
      for (const candidate of localizedCandidates(baseFallbackGuidePath)) {
        const fallbackGuidePath = updatePathIfVersionedFileDoesNotExistWithCache(
          candidate
        );
        try {
          doc = await getFileBySlugWithCache(fallbackGuidePath);
          break;
        } catch (e) {
          // keep looking
        }
      }
    }
  }

  if (!doc) {
    const basePlatformPath = `platform-includes/${includePath}/${platform}`;
    for (const candidate of localizedCandidates(basePlatformPath)) {
      const platformPath = updatePathIfVersionedFileDoesNotExistWithCache(candidate);
      try {
        doc = await getFileBySlugWithCache(platformPath);
        break;
      } catch (e) {
        // keep looking
      }
    }
  }

  if (!doc) {
    const rootNode = await getDocsRootNode();
    const platformObject = getPlatform(rootNode, platform);

    if (platformObject?.fallbackPlatform) {
      const baseFallbackPlatformPath = `platform-includes/${includePath}/${platformObject?.fallbackPlatform}`;
      for (const candidate of localizedCandidates(baseFallbackPlatformPath)) {
        const fallbackPlatformPath = updatePathIfVersionedFileDoesNotExistWithCache(
          candidate
        );
        try {
          doc = await getFileBySlugWithCache(fallbackPlatformPath);
          break;
        } catch (e) {
          // keep looking
        }
      }
    }
  }

  if (!doc) {
    const baseDefaultPath = `platform-includes/${includePath}/_default`;
    for (const candidate of localizedCandidates(baseDefaultPath)) {
      try {
        doc = await getFileBySlugWithCache(candidate);
        break;
      } catch (e) {
        // keep looking
      }
    }
    if (!doc) {
      return null;
    }
  }

  const {mdxSource} = doc;
  return <MDXLayoutRenderer mdxSource={mdxSource} />;
}

const mdxComponentsWithWrapper = mdxComponents({Include, PlatformContent});
