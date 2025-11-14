'use client';

import {useMemo} from 'react';
import {getMDXComponent} from 'mdx-bundler/client';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, any>;
};

export function MdxClient({code, components = {}, ...rest}: Props) {
  const MDX = useMemo(() => getMDXComponent(code), [code]);
  return <MDX components={components} {...rest} />;
}
