import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { getFileBySlug } from "sentry-docs/mdx";
import { serverContext } from "sentry-docs/serverContext";
import { mdxComponents } from "sentry-docs/mdxComponents";

type Props = {
  includePath: string;
  children?: React.ReactNode;
  fallbackPlatform?: string;
  noGuides?: boolean;
  platform?: string;
};

export async function PlatformContent({includePath, platform, children, noGuides}: Props) {
  const { path } = serverContext();
  
  if (!platform) {
    if (path.length < 2 || path[0] !== 'platforms') {
      return null;
    }
    platform = path[1]
  }

  let doc: any = null;
  try {
    doc = await getFileBySlug(`platform-includes/${includePath}/${platform}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      try {
        doc = await getFileBySlug(`platform-includes/${includePath}/_default`);
      } catch (e2) {
        if (e2.code === 'ENOENT') {
          return null;
        } else {
          throw(e);
        }
      }
    } else {
      throw(e);
    }
  }
  const { mdxSource } = doc;
  const MDXLayoutRenderer = ({ mdxSource, ...rest }) => {
    const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
    return <MDXLayout components={mdxComponentsWithWrapper} {...rest} />;
  }
  return <MDXLayoutRenderer mdxSource={mdxSource} />;
}

const mdxComponentsWithWrapper = mdxComponents();
