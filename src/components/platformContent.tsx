import fs from 'fs';

import {useMemo} from 'react';
import {getMDXComponent} from 'mdx-bundler/client';

import {getCurrentGuide, getDocsRootNode, getPlatform} from 'sentry-docs/docTree';
import {getFileBySlug} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {serverContext} from 'sentry-docs/serverContext';
import {isVersioned, stripVersion} from 'sentry-docs/versioning';

import {Include} from './include';

type Props = {
  includePath: string;
  children?: React.ReactNode;
  fallbackPlatform?: string;
  noGuides?: boolean;
  platform?: string;
};

const udpatePathIfVersionedFileDoesNotExist = (path: string): string => {
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

  let doc: Awaited<ReturnType<typeof getFileBySlug>> | null = null;

  if (guide) {
    let guidePath = `platform-includes/${includePath}/${guide}`;
    guidePath = udpatePathIfVersionedFileDoesNotExist(guidePath);
    try {
      doc = await getFileBySlug(guidePath);
    } catch (e) {
      // It's fine - keep looking.
    }
  }

  if (!doc) {
    const rootNode = await getDocsRootNode();
    const guideObject = getCurrentGuide(rootNode, path);

    let fallbackGuidePath = `platform-includes/${includePath}/${guideObject?.fallbackGuide}`;
    fallbackGuidePath = udpatePathIfVersionedFileDoesNotExist(fallbackGuidePath);

    if (guideObject?.fallbackGuide) {
      try {
        doc = await getFileBySlug(fallbackGuidePath);
      } catch (e) {
        // It's fine - keep looking.
      }
    }
  }

  if (!doc) {
    try {
      let platformPath = `platform-includes/${includePath}/${platform}`;
      platformPath = udpatePathIfVersionedFileDoesNotExist(platformPath);

      doc = await getFileBySlug(platformPath);
    } catch (e) {
      // It's fine - keep looking.
    }
  }

  if (!doc) {
    const rootNode = await getDocsRootNode();
    const platformObject = getPlatform(rootNode, platform);

    let fallbackPlatformPath = `platform-includes/${includePath}/${platformObject?.fallbackPlatform}`;
    fallbackPlatformPath = udpatePathIfVersionedFileDoesNotExist(fallbackPlatformPath);

    if (platformObject?.fallbackPlatform) {
      try {
        doc = await getFileBySlug(fallbackPlatformPath);
      } catch (e) {
        // It's fine - keep looking.
      }
    }
  }

  if (!doc) {
    try {
      doc = await getFileBySlug(`platform-includes/${includePath}/_default`);
    } catch (e) {
      // Couldn't find anything.
      return null;
    }
  }

  const {mdxSource} = doc;
  function MDXLayoutRenderer({mdxSource: source, ...rest}) {
    const MDXLayout = useMemo(() => getMDXComponent(source), [source]);
    return <MDXLayout components={mdxComponentsWithWrapper} {...rest} />;
  }
  return <MDXLayoutRenderer mdxSource={mdxSource} />;
}

const mdxComponentsWithWrapper = mdxComponents({Include, PlatformContent});
