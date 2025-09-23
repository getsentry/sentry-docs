import {useMemo} from 'react';
import {getMDXComponent} from 'sentry-docs/mdxClient';

import {getFileBySlugWithCache} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';

import {PlatformContent} from './platformContent';

type Props = {
  name: string;
};

function MDXLayoutRenderer({mdxSource: source, ...rest}) {
  const MDXLayout = useMemo(() => getMDXComponent(source), [source]);
  return <MDXLayout components={mdxComponents({Include, PlatformContent})} {...rest} />;
}

export async function Include({name}: Props) {
  let doc: Awaited<ReturnType<typeof getFileBySlugWithCache>>;
  if (name.endsWith('.mdx')) {
    name = name.slice(0, name.length - '.mdx'.length);
  }
  try {
    doc = await getFileBySlugWithCache(`includes/${name}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return null;
    }
    throw e;
  }
  const {mdxSource} = doc;
  return <MDXLayoutRenderer mdxSource={mdxSource} />;
}
