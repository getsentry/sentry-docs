import 'server-only';
import { cache } from 'react';

interface ServerContext {
    docTree: {};
    frontmatter: {};
    path: String;
    toc: any[];
}

export const serverContext = cache(() => {
    const context: ServerContext = {
        docTree: {},
        frontmatter: {},
        path: '',
        toc: []
    }
    return context;
});

export const setServerContext = (data: ServerContext) => {
    serverContext().docTree = data.docTree;
    serverContext().frontmatter = data.frontmatter;
    serverContext().path = data.path;
    serverContext().toc = data.toc;
};
