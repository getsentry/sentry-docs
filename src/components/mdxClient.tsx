'use client';

import {getMDXComponent} from 'mdx-bundler/client';
import {useMemo} from 'react';

type Props = {
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components?: Record<string, any>;
};

export function MdxClient({code, components = {}, ...rest}: Props) {
  const MDX = useMemo(() => getMDXComponent(code), [code]);
  return <MDX components={components} {...rest} />;
}
