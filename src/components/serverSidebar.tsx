import {Fragment} from 'react';

import {
  DocNode,
  getDocsRootNode,
  getGuide,
  getPlatform,
  nodeForPath,
} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {PlatformGuide} from 'sentry-docs/types';
import {isTruthy} from 'sentry-docs/utils';

import {DynamicNav, toTree} from './dynamicNav';
import {Node as PlatformSidebarNode, PlatformSidebar} from './platformSidebar';
import {Sidebar, SidebarNode} from './sidebar';
import {SidebarLink} from './sidebarLink';

export function ServerSidebar(): JSX.Element | null {
  const {path, rootNode} = serverContext();
  if (!rootNode) {
    return null;
  }

  let node = rootNode;
  if (path[0] === 'contributing') {
    const maybeNode = nodeForPath(rootNode, 'contributing');
    if (maybeNode) {
      node = maybeNode;
    } else {
      return null;
    }
  } else if (
    ['product', 'platform-redirect', 'cli', 'account', 'pricing'].includes(path[0])
  ) {
    return <ProductSidebar rootNode={rootNode} />;
  } else if (path[0] === 'api') {
    return (
      <Fragment>
        <ApiSidebar />
        <hr />
        <ProductSidebar rootNode={rootNode} />
      </Fragment>
    );
  } else if (path[0] === 'platforms') {
    if (path.length === 1) {
      return <ProductSidebar rootNode={rootNode} />;
    }

    const name = path[1];
    const platformNode = nodeForPath(rootNode, ['platforms', name]);
    if (!platformNode) {
      return null;
    }

    const platform = getPlatform(rootNode, name);
    let guide: PlatformGuide | undefined;
    if (path.length >= 4 && path[2] === 'guides') {
      guide = getGuide(platformNode, name, path[3]);
      guide = getGuide(rootNode, name, path[3]);
    }

    const docNodeToPlatformSidebarNode = (n: DocNode) => {
      if (n.frontmatter.draft) {
        return undefined;
      }
      return {
        context: {
          platform: {
            name,
          },
          title: n.frontmatter.title,
          sidebar_order: n.frontmatter.sidebar_order,
          sidebar_title: n.frontmatter.sidebar_title,
        },
        path: '/' + n.path + '/',
      };
    };

    const nodes: PlatformSidebarNode[] = getNavNodes(
      [platformNode],
      docNodeToPlatformSidebarNode
    );

    return (
      <Fragment>
        <PlatformSidebar
          platform={{
            name,
            title: platform?.title || '',
          }}
          guide={
            guide && {
              name: guide.name,
              title: guide.title || '',
            }
          }
          nodes={nodes}
        />
        <hr />
        <ProductSidebar rootNode={rootNode} />
      </Fragment>
    );
  }

  // Must not send full DocNodes to a client component, or the entire doc tree
  // will be serialized.
  const nodeToSidebarNode = (n: DocNode): SidebarNode => {
    return {
      path: n.path,
      frontmatter: n.frontmatter,
      children: n.children.map(nodeToSidebarNode),
    };
  };
  return <Sidebar node={nodeToSidebarNode(node)} path={path} />;
}

export function getNavNodes<NavNode_>(
  docNodes: DocNode[],
  docNodeToNavNode_: (doc: DocNode) => NavNode_ | undefined,
  nodes: NavNode_[] = []
) {
  docNodes.forEach(n => {
    const navNode = docNodeToNavNode_(n);
    if (!navNode) {
      return;
    }
    nodes.push(navNode);
    getNavNodes(n.children, docNodeToNavNode_, nodes);
  });
  return nodes;
}

type NavNode = {
  context: {
    draft: boolean;
    title: string;
    sidebar_order?: number;
    sidebar_title?: string;
  };
  path: string;
};

const docNodeToNavNode = (node: DocNode): NavNode => ({
  context: {
    draft: Boolean(node.frontmatter.draft),
    title: node.frontmatter.title,
    sidebar_order: node.frontmatter.sidebar_order,
    sidebar_title: node.frontmatter.sidebar_title,
  },
  path: '/' + node.path + '/',
});

function ProductSidebar({rootNode}: {rootNode: DocNode}) {
  /**
   * URL: /cli
   */
  const cliNode = nodeForPath(rootNode, 'cli');
  if (!cliNode) {
    return null;
  }
  const cliNodes: NavNode[] = getNavNodes([cliNode], docNodeToNavNode);
  const cliTree = toTree(cliNodes.filter(n => !!n.context));

  /**
   * URL: /pricing
   */
  const pricingNode = nodeForPath(rootNode, 'pricing');
  if (!pricingNode) {
    return null;
  }
  const pricingNodes: NavNode[] = getNavNodes([pricingNode], docNodeToNavNode);
  const pricingTree = toTree(pricingNodes.filter(n => !!n.context));

  /**
   * URL: /product
   */
  const productNode = nodeForPath(rootNode, 'product');
  if (!productNode) {
    return null;
  }
  const productNodes: NavNode[] = getNavNodes([productNode], docNodeToNavNode);
  const productTree = toTree(productNodes.filter(n => !!n.context));

  const {path} = serverContext();
  const fullPath = '/' + path.join('/') + '/';
  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <DynamicNav root="cli" title="sentry-cli" tree={cliTree} collapse />
      <DynamicNav root="pricing" title="Pricing & Billing" tree={pricingTree} collapse />
      <DynamicNav
        root="product"
        title="Product"
        tree={productTree}
        exclude={[
          '/product/integrations/',
          '/product/security/',
          '/product/accounts/',
          '/product/relay/',
          '/product/data-management-settings/',
        ]}
      />
      <DynamicNav
        root="product/data-management-settings"
        title="Data Management"
        tree={productTree}
      />
      <DynamicNav root="product/accounts" title="Account Management" tree={productTree} />
      <DynamicNav root="product/relay" title="Relay" tree={productTree} />
      <DynamicNav root="product/security" title="Security and Legal" tree={productTree} />
      <DynamicNav root="product/integrations" title="Integrations" tree={productTree} />

      <li className="mb-3" data-sidebar-branch>
        <div className="sidebar-title items-center mb-0" data-sidebar-link>
          <h6>Additional Resources</h6>
        </div>
        <ul className="list-unstyled" data-sidebar-tree>
          <SidebarLink to="https://help.sentry.io/" title="Support" path={fullPath} />
          <SidebarLink to="/platforms/" title="Platforms" path={fullPath} />
          <SidebarLink to="/api/" title="API Reference" path={fullPath} />
          <SidebarLink to="/contributing/" title="Contributing to Docs" path={fullPath} />
          <SidebarLink
            to="https://develop.sentry.dev"
            title="Developer Documentation"
            path={fullPath}
          />
          <SidebarLink
            to="https://develop.sentry.dev/self-hosted/"
            title="Self-Hosting Sentry"
            path={fullPath}
          />
        </ul>
      </li>
      {process.env.NODE_ENV !== 'production' && (
        <DynamicNav root="_debug" title="Debug (Dev Only)" tree={productTree} />
      )}
    </ul>
  );
}

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
        exclude={endpoints
          .map(elem => elem.node?.path)
          .concat(guides.map(elem => elem.node?.path))
          .filter(isTruthy)}
      />
      <DynamicNav
        root="api/guides"
        title="Guides"
        tree={guides}
        exclude={endpoints.map(elem => elem.node?.path).filter(isTruthy)}
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
