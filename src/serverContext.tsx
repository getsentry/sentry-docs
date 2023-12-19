import 'server-only';
import { cache } from 'react';
import { DocNode } from 'sentry-docs/docTree';

interface ServerContext {
    rootNode?: DocNode;
    frontmatter: {};
    path: string;
    toc: any[];
}

export const serverContext = cache(() => {
    const context: ServerContext = {
        frontmatter: {},
        path: '',
        toc: []
    }
    return context;
});

export const setServerContext = (data: ServerContext) => {
    serverContext().rootNode = data.rootNode;
    serverContext().frontmatter = data.frontmatter;
    serverContext().path = data.path;
    serverContext().toc = data.toc;
};
