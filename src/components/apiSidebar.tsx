import {Fragment} from 'react';

import {DocNode, getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';

import {DynamicNav, toTree} from './dynamicNav';
import {SidebarLink} from './sidebarLink';

export async function ApiSidebar() {
  const rootNode = await getDocsRootNode();
  const apiRootNode = rootNode && nodeForPath(rootNode, 'api');
  if (!apiRootNode) {
    return null;
  }

  const nodes: {
    context: {
      title: string;
    };
    path: string;
  }[] = [];
  const addNodes = (ns: DocNode[]) => {
    ns.forEach(n => {
      nodes.push({
        path: `/${n.path}/`,
        context: {
          title: n.frontmatter.title,
        },
      });
      addNodes(n.children);
    });
  };
  addNodes([apiRootNode]);

  const tree = toTree(nodes);
  const endpoints = tree[0].children.filter(
    curr => curr.children.length > 1 && !curr.name.includes('guides')
  );
  const guides = tree[0].children.filter(curr => curr.name.includes('guides'));

  const {path: pathParts} = serverContext();
  const currentPath = `/${pathParts.join('/')}/`;
  const isActive = (p: string) => currentPath.indexOf(p) === 0;

  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <DynamicNav
        root="api"
        title="API Reference"
        tree={tree}
        exclude={
          endpoints
            .map(elem => elem.node?.path)
            .concat(guides.map(elem => elem.node?.path))
            .filter(Boolean) as string[]
        }
      />
      <DynamicNav
        root="api/guides"
        title="Guides"
        tree={guides}
        exclude={endpoints.map(elem => elem.node?.path).filter(Boolean) as string[]}
      />
      <li className="mb-3" data-sidebar-branch>
        <div className="sidebar-title flex items-center mb-0" data-sidebar-link>
          <h6>Endpoints</h6>
        </div>
        <ul className="list-unstyled" data-sidebar-tree>
          {endpoints.map(({node, children}) => {
            const path = node?.path;
            const title = node?.context.title;
            return (
              path &&
              title && (
                <Fragment key={path}>
                  <SidebarLink to={path} title={title} path={currentPath} />
                  {isActive(path) && (
                    <div style={{paddingLeft: '0.5rem'}}>
                      {children
                        .filter(({node: n}) => !!n)
                        .map(({node: n}) => {
                          const childPath = n?.path;
                          const contextTitle = n?.context.title;
                          return (
                            childPath &&
                            contextTitle && (
                              <SidebarLink
                                key={path}
                                to={childPath}
                                title={contextTitle}
                                path={currentPath}
                              />
                            )
                          );
                        })}
                    </div>
                  )}
                </Fragment>
              )
            );
          })}
        </ul>
      </li>
    </ul>
  );
}
