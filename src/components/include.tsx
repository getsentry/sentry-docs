import {getMDXComponent} from 'mdx-bundler/client';
import {useMemo} from 'react';
import {getFileBySlug} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';
import {PlatformContent} from './platformContent';

type Props = {
  name: string;
};

export async function Include({name}: Props) {
  let doc: any = null;
  if (name.endsWith('.mdx')) {
    name = name.slice(0, name.length - '.mdx'.length);
  }
  try {
    doc = await getFileBySlug(`includes/${name}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return null;
    } else {
      throw e;
    }
  }
  const {mdxSource} = doc;
  const MDXLayoutRenderer = ({mdxSource, ...rest}) => {
    const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
    return <MDXLayout components={mdxComponents({Include, PlatformContent})} {...rest} />;
  };
  return <MDXLayoutRenderer mdxSource={mdxSource} />;
}
