import fs from 'fs';

import {cache, useMemo} from 'react';
import {getMDXComponent} from 'sentry-docs/mdxClient';

import {getCurrentGuide, getDocsRootNode, getPlatform} from 'sentry-docs/docTree';
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
    const guidePath = updatePathIfVersionedFileDoesNotExistWithCache(
      `platform-includes/${includePath}/${guide}`
    );

    try {
      doc = await getFileBySlugWithCache(guidePath);
    } catch (e) {
      // It's fine - keep looking.
    }
  }

  if (!doc) {
    const rootNode = await getDocsRootNode();
    const guideObject = getCurrentGuide(rootNode, path);

    const fallbackGuidePath = updatePathIfVersionedFileDoesNotExistWithCache(
      `platform-includes/${includePath}/${guideObject?.fallbackGuide}${VERSION_INDICATOR}${getVersion(guide || '')}`
    );

    if (guideObject?.fallbackGuide) {
      try {
        doc = await getFileBySlugWithCache(fallbackGuidePath);
      } catch (e) {
        // It's fine - keep looking.
      }
    }
  }

  if (!doc) {
    try {
      const platformPath = updatePathIfVersionedFileDoesNotExistWithCache(
        `platform-includes/${includePath}/${platform}`
      );

      doc = await getFileBySlugWithCache(platformPath);
    } catch (e) {
      // It's fine - keep looking.
    }
  }

  if (!doc) {
    const rootNode = await getDocsRootNode();
    const platformObject = getPlatform(rootNode, platform);

    const fallbackPlatformPath = updatePathIfVersionedFileDoesNotExistWithCache(
      `platform-includes/${includePath}/${platformObject?.fallbackPlatform}`
    );

    if (platformObject?.fallbackPlatform) {
      try {
        doc = await getFileBySlugWithCache(fallbackPlatformPath);
      } catch (e) {
        // It's fine - keep looking.
      }
    }
  }

  if (!doc) {
    try {
      doc = await getFileBySlugWithCache(`platform-includes/${includePath}/_default`);
    } catch (e) {
      // Couldn't find anything.
      return null;
    }
  }

  const {mdxSource} = doc;
  return <MDXLayoutRenderer mdxSource={mdxSource} />;
}

const mdxComponentsWithWrapper = mdxComponents({Include, PlatformContent});
