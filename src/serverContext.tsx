import 'server-only';

import {cache} from 'react';
import {headers} from 'next/headers';

import {DocNode} from 'sentry-docs/docTree';

interface ServerContext {
  path: string[];
  rootNode: DocNode;
}

export const serverContext = cache(() => {
  const context: ServerContext = {
    path: [],

    rootNode: {
      path: '',
      slug: '',
      frontmatter: {
        title: 'Home',
        slug: 'home',
      },
      children: [],
      missing: false,
      sourcePath: 'src/components/home.tsx',
    },
  };
  return context;
});

export const setServerContext = (data: ServerContext) => {
  serverContext().rootNode = data.rootNode;
  serverContext().path = data.path;
};

/**
 * Gets the current pathname server side
 * **Note:** this is a workaround trying to mimic `usePathname()` on the server side
 * But it's not perfect as it relies on middleware to set the `x-pathname` header,
 * which means you can't rely on it at build time.
 */
export const useServerPathname = () => {
  const headersList = headers();
  const pathname = headersList.get('x-pathname');
  const path = pathname?.split('/').filter(Boolean) ?? [];
  return path;
};
