// Block accidental client-side usage while keeping this module safe for build-time scripts.
if (typeof window !== 'undefined') {
  throw new Error('serverContext can only be used on the server');
}

// The `server-only` package throws when imported outside Next's server component
// pipeline, so guard it to avoid crashing tooling like doctree generation.
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
try {
  require('server-only');
} catch {
  // ignore – we only need this hint when Next is evaluating server components
}

import {cache} from 'react';

import type {DocNode} from 'sentry-docs/docTree';

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

export const setServerContext = (data: Partial<ServerContext>) => {
  if (data.rootNode) serverContext().rootNode = data.rootNode;
  if (data.path) serverContext().path = data.path;
  if (data.locale) serverContext().locale = data.locale;
};
