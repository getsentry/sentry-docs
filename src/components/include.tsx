import {useMemo} from 'react';
import {getMDXComponent} from 'mdx-bundler/client';

import {getFileBySlug} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';

import {PlatformContent} from './platformContent';

type Props = {
  name: string;
};

export async function Include({name}: Props) {
  let doc: Awaited<ReturnType<typeof getFileBySlug>> | null = null;
  if (name.endsWith('.mdx')) {
    name = name.slice(0, name.length - '.mdx'.length);
  }
  try {
    doc = await getFileBySlug(`includes/${name}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return null;
    }
    throw e;
  }
  const {mdxSource} = doc;
  function MDXLayoutRenderer({mdxSource: source, ...rest}) {
    const MDXLayout = useMemo(() => getMDXComponent(source), [source]);
    return <MDXLayout components={mdxComponents({Include, PlatformContent})} {...rest} />;
  }
  return <MDXLayoutRenderer mdxSource={mdxSource} />;
}
