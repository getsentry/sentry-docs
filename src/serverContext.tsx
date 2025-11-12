import 'server-only';

import {cache} from 'react';

import {DocNode} from 'sentry-docs/docTree';

interface ServerContext {
  locale: string;
  path: string[];
  rootNode: DocNode;
}

export const serverContext = cache(() => {
  const context: ServerContext = {
    path: [],
    locale: 'en',

    rootNode: {
      path: '/',
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
  serverContext().locale = data.locale;
};
