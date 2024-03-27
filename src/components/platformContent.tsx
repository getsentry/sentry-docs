import {useMemo} from 'react';
import {getMDXComponent} from 'mdx-bundler/client';

import {getDocsRootNode, getPlatform} from 'sentry-docs/docTree';
import {getFileBySlug} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {serverContext} from 'sentry-docs/serverContext';

import {Include} from './include';

type Props = {
  includePath: string;
  children?: React.ReactNode;
  fallbackPlatform?: string;
  noGuides?: boolean;
  platform?: string;
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
    try {
      doc = await getFileBySlug(`platform-includes/${includePath}/${guide}`);
    } catch (e) {
      // It's fine - keep looking.
    }
  }

  if (!doc) {
    try {
      doc = await getFileBySlug(`platform-includes/${includePath}/${platform}`);
    } catch (e) {
      // It's fine - keep looking.
    }
  }

  if (!doc) {
    const rootNode = await getDocsRootNode();
    const platformObject = rootNode && getPlatform(rootNode, platform);
    if (platformObject?.fallbackPlatform) {
      try {
        doc = await getFileBySlug(
          `platform-includes/${includePath}/${platformObject.fallbackPlatform}`
        );
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
