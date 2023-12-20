import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { getFileBySlug } from "sentry-docs/mdx";
import { mdxComponents } from "sentry-docs/mdxComponents";

type Props = {
  name: string;
};

export async function Include({name}: Props) {
  return null;
  let doc: any = null;
  try {
    doc = await getFileBySlug(`includes/${name}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return null;
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
