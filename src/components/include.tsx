import {MDXRemote} from 'next-mdx-remote/rsc';

import {getFileBySlugWithCache, rehypePlugins, remarkPlugins} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';

import {PlatformContent} from './platformContent';

type Props = {name: string};

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
  return (
    <MDXRemote
      source={doc}
      components={mdxComponents({Include, PlatformContent})}
      options={{
        mdxOptions: {
          // @ts-ignore
          remarkPlugins,
          // @ts-ignore
          rehypePlugins,
        },
      }}
    />
  );
}
