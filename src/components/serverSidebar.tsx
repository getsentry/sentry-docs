import {Fragment, SVGAttributes} from 'react';
import Link from 'next/link';

import {
  DocNode,
  getDocsRootNode,
  getGuide,
  getPlatform,
  nodeForPath,
} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {FrontMatter, PlatformGuide} from 'sentry-docs/types';
import {isTruthy} from 'sentry-docs/utils';

import {DynamicNav, toTree} from './dynamicNav';
import {SidebarLink} from './sidebarLink';

export function ServerSidebar(): JSX.Element | null {
  const {path, rootNode} = serverContext();
  if (!rootNode) {
    return null;
  }

  if (['product', 'platform-redirect', 'cli', 'account', 'pricing'].includes(path[0])) {
    return <ProductSidebar rootNode={rootNode} />;
  }
  if (path[0] === 'api') {
    return (
      <Fragment>
        <ApiSidebar />
        <hr />
        <ProductSidebar rootNode={rootNode} />
      </Fragment>
    );
  }
  if (path[0] === 'platforms') {
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

    const nodes = getNavNodes([platformNode], docNodeToPlatformSidebarNode);

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
  if (path[0] === 'contributing') {
    const contribNode = nodeForPath(rootNode, 'contributing');
    if (contribNode) {
      const contribNodes: NavNode[] = getNavNodes([contribNode], docNodeToNavNode);
      return (
        <ul className="list-unstyled" data-sidebar-tree>
          <DynamicNav
            root="contributing"
            title="Contributing to Docs"
            tree={toTree(contribNodes)}
          />
        </ul>
      );
    }
  }
  // render the default sidebar if no special case is met
  return <DefaultSidebar node={rootNode} path={path} />;
}

function getNavNodes<NavNode_>(
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

type PlatformSidebarNode = {
  context: {
    platform: {
      name: string;
    };
    title: string;
    sidebar_order?: number;
    sidebar_title?: string;
  };
  path: string;
};

type PlatformSidebarProps = {
  nodes: PlatformSidebarNode[];
  platform: {
    name: string;
    title: string;
  };
  guide?: {
    name: string;
    title: string;
  };
};

function PlatformSidebar({platform, guide, nodes}: PlatformSidebarProps) {
  const platformName = platform.name;
  const guideName = guide ? guide.name : null;
  const tree = toTree(nodes.filter(n => !!n.context));
  const pathRoot = guideName
    ? `platforms/${platformName}/guides/${guideName}`
    : `platforms/${platformName}`;
  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <DynamicNav
        root={pathRoot}
        tree={tree}
        title={`Sentry for ${(guide || platform).title}`}
        prependLinks={[[`/${pathRoot}/`, 'Getting Started']]}
        exclude={[`/${pathRoot}/guides/`]}
      />
    </ul>
  );
}

type SidebarNode = {
  children: SidebarNode[];
  frontmatter: FrontMatter;
  path: string;
};

type DefaultSidebarProps = {
  node: SidebarNode;
  path: string[];
};

export function DefaultSidebar({node, path}: DefaultSidebarProps) {
  const activeClassName = (n: SidebarNode, baseClassName = '') => {
    const className = n.path === path.join('/') ? 'active' : '';
    return `${baseClassName} ${className}`;
  };

  const renderChildren = (children: SidebarNode[]) =>
    children && (
      <ul className="list-unstyled" data-sidebar-tree>
        {children
          .filter(n => n.frontmatter.sidebar_title || n.frontmatter.title)
          .map(n => (
            <li className="toc-item" key={n.path} data-sidebar-branch>
              <Link
                href={'/' + n.path}
                data-sidebar-link
                className={activeClassName(n, 'flex items-center justify-between gap-1')}
              >
                {n.frontmatter.sidebar_title || n.frontmatter.title}
                {n.children.length > 0 && <Chevron direction="down" />}
              </Link>
              {renderChildren(n.children)}
            </li>
          ))}
      </ul>
    );

  const rotation = {
    down: 0,
    right: 270,
  } as const;

  function Chevron({
    direction,
    ...props
  }: SVGAttributes<SVGElement> & {
    direction: 'down' | 'right';
  }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        {...props}
        style={{
          transition: 'transform 200ms',
          transform: `rotate(${rotation[direction]}deg)`,
        }}
      >
        <path
          fill="currentColor"
          d="M12.53 5.47a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06L8 8.94l3.47-3.47a.75.75 0 0 1 1.06 0Z"
        />
      </svg>
    );
  }

  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <li className="mb-3" data-sidebar-branch>
        <Fragment>
          <Link
            href={'/' + node.path}
            className={activeClassName(
              node,
              'sidebar-title flex items-center justify-between gap-1'
            )}
            data-sidebar-link
            key={node.path}
          >
            <h6>{node.frontmatter.sidebar_title || node.frontmatter.title}</h6>
          </Link>
          {renderChildren(node.children)}
        </Fragment>
      </li>
    </ul>
  );
}
