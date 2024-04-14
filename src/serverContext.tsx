import 'server-only';

import {cache} from 'react';

import {DocNode} from 'sentry-docs/docTree';

interface ServerContext {
  path: string[];
  isOriginalPathBroken?: boolean;
  rootNode?: DocNode;
}

export const serverContext = cache(() => {
  const context: ServerContext = {
    path: [],
    isOriginalPathBroken: false,
  };
  return context;
});

export const setServerContext = (data: ServerContext) => {
  serverContext().rootNode = data.rootNode;
  serverContext().path = data.path;
  serverContext().isOriginalPathBroken = data.isOriginalPathBroken;
};
