import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { Alert } from "./alert";
import { nodeForPath } from "sentry-docs/docTree";
import { getFileBySlug } from "sentry-docs/mdx";
import { serverContext } from "sentry-docs/serverContext";
import { Note } from "./note";
import { PageGrid } from "./pageGrid";
import { PlatformGrid } from "./platformGrid";
import { PlatformLink } from "./platformLink";
import { MDXComponents } from "mdx/types";

type Props = {
  includePath: string;
  children?: React.ReactNode;
  fallbackPlatform?: string;
  noGuides?: boolean;
  platform?: string;
};

export async function PlatformContent({includePath, platform, children, noGuides}: Props) {
  const { path, rootNode } = serverContext();
  if (!rootNode) {
    return null;
  }
  
  if (!platform) {
    if (!rootNode || path.length < 2 || path[0] !== 'platforms') {
      return null;
    }
    platform = path[1]
  }

  const includeNode = nodeForPath(rootNode, `platform-includes/${includePath}/${platform}`)
  if (!includeNode) {
    console.log('no include node:', `platform-includes/${includePath}/${platform}`)
    return null;
  }
  
  let doc: any = null;
  try {
    doc = await getFileBySlug(includeNode.path);
  } catch (e) {
    console.log('failed to get node for ', includeNode.path);
    if (e.code === 'ENOENT') {
      return null;
    } else {
      throw(e);
    }
  }
  const { mdxSource } = doc;
  const MDXLayoutRenderer = ({ mdxSource, ...rest }) => {
    const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
    return <MDXLayout components={MDXComponents} {...rest} />;
  }
  return <MDXLayoutRenderer mdxSource={mdxSource} />;
}

const MDXComponents: MDXComponents = {
  Alert,
  Note,
  PageGrid,
  PlatformContent,
  PlatformGrid,
  PlatformLink,
  // a: Link, // TODO: fails type check
  wrapper: ({ children }) => children
}
