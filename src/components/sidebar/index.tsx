import {Fragment, SVGAttributes} from 'react';
import Link from 'next/link';

import {
  DocNode,
  extractPlatforms,
  getCurrentGuide,
  getCurrentPlatform,
  getDocsRootNode,
  getGuide,
  getPlatform,
  nodeForPath,
} from 'sentry-docs/docTree';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';
import {FrontMatter, Platform} from 'sentry-docs/types';

import styles from './style.module.scss';

import {DynamicNav, toTree} from '../dynamicNav';
import {ScrollActiveLink} from '../focus-active-link';
import {PlatformSelector} from '../platformSelector';
import {SidebarLink} from '../sidebarLink';

const activeLinkSelector = `.${styles.sidebar} .toc-item .active`;
const headerClassName = `${styles['sidebar-title']} flex items-center`;

export const sidebarToggleId = styles['navbar-menu-toggle'];

type SidebarProps = {
  path: string[];
};
export async function Sidebar({path}: SidebarProps) {
  const rootNode = await getDocsRootNode();

  if (isDeveloperDocs) {
    return <DevelopDocsSidebar path={'/' + path.join('/') + '/'} rootNode={rootNode} />;
  }

  const currentPlatform = getCurrentPlatform(rootNode, path);
  const currentGuide = getCurrentGuide(rootNode, path);

  const platforms: Platform[] = !rootNode
    ? []
    : extractPlatforms(rootNode).map(platform => {
        const platformPageForCurrentPath =
          nodeForPath(rootNode, [
            'platforms',
            platform.name,
            // take the :path in /platforms/:platformName/:path
            // or /platforms/:platformName/guides/:guideName/:path when we're in a guide
            ...path.slice(currentGuide ? 4 : 2),
          ]) ||
          // try to go one page higher, example: go to /usage/ from /usage/something
          nodeForPath(rootNode, [
            'platforms',
            platform.name,
            ...path.slice(currentGuide ? 4 : 2, path.length - 1),
          ]);

        return {
          ...platform,
          url: platformPageForCurrentPath
            ? '/' + platformPageForCurrentPath.path + '/'
            : platform.url,
          guides: platform.guides.map(guide => {
            const guidePageForCurrentPath = nodeForPath(rootNode, [
              'platforms',
              platform.name,
              'guides',
              guide.name,
              ...path.slice(currentGuide ? 4 : 2),
            ]);
            return guidePageForCurrentPath
              ? {
                  ...guide,
                  url: '/' + guidePageForCurrentPath.path + '/',
                }
              : guide;
          }),
        };
      });

  return (
    <aside className={styles.sidebar}>
      <input type="checkbox" id={sidebarToggleId} className="hidden" />
      <style>{':root { --sidebar-width: 300px; }'}</style>
      <div className="md:flex flex-col items-stretch">
        <div className="platform-selector">
          <div className="mb-3">
            <PlatformSelector
              platforms={platforms}
              currentPlatform={currentGuide || currentPlatform}
            />
          </div>
        </div>
        <div className={styles.toc}>
          <ScrollActiveLink activeLinkSelector={activeLinkSelector} />
          <SidebarLinks path={path} />
        </div>
      </div>
    </aside>
  );
}

/** a root of `"some-root"` maps to the `/some-root/` url */
const productSidebarItems = [
  {
    title: 'Account Settings',
    root: 'account',
  },
  {
    title: 'Organization Settings',
    root: 'organization',
  },
  {
    title: 'Product Walkthroughs',
    root: 'product',
  },
  {
    title: 'Pricing & Billing',
    root: 'pricing',
  },
  {
    title: 'Sentry CLI',
    root: 'cli',
  },
  {
    title: 'Sentry API',
    root: 'api',
  },
  {
    title: 'Security, Legal, & PII',
    root: 'security-legal-pii',
  },
  {
    title: 'Concepts & Reference',
    root: 'concepts',
  },
];

export async function SidebarLinks({path}: {path: string[]}) {
  const rootNode = await getDocsRootNode();
  if (
    productSidebarItems.some(el => el.root === path[0]) ||
    path[0] === 'platform-redirect'
  ) {
    return <ProductSidebar rootNode={rootNode} items={productSidebarItems} />;
  }
  // /platforms/:platformName/guides/:guideName
  if (path[0] === 'platforms') {
    const platformName = path[1];
    const guideName = path[3];
    return (
      <Fragment>
        {platformName && (
          <Fragment>
            <PlatformSidebar
              platformName={platformName}
              guideName={guideName}
              rootNode={rootNode}
            />
            <hr />
          </Fragment>
        )}
        <ProductSidebar rootNode={rootNode} items={productSidebarItems} />
      </Fragment>
    );
  }
  if (path[0] === 'contributing') {
    const contribNode = nodeForPath(rootNode, 'contributing');
    if (contribNode) {
      const contribNodes: NavNode[] = getNavNodes([contribNode], docNodeToNavNode);
      return (
        <ul data-sidebar-tree>
          <DynamicNav
            root="contributing"
            title="Contributing to Docs"
            tree={toTree(contribNodes)}
            headerClassName={headerClassName}
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

type ProductSidebarProps = {
  items: {root: string; title: string}[];
  rootNode: DocNode;
};

function ProductSidebar({rootNode, items}: ProductSidebarProps) {
  const itemTree = (item: string) => {
    const node = nodeForPath(rootNode, item);
    if (!node) {
      return null;
    }
    const nodes: NavNode[] = getNavNodes([node], docNodeToNavNode);
    return toTree(nodes.filter(n => !!n.context));
  };
  return (
    <div>
      <ul data-sidebar-tree>
        {items.map(item => {
          const tree = itemTree(item.root);

          return (
            tree && (
              <DynamicNav
                key={item.root}
                root={item.root}
                title={item.title}
                tree={tree}
                headerClassName={headerClassName}
                collapse
              />
            )
          );
        })}
      </ul>
      <hr />
      <ul data-sidebar-tree>
        <li className="mb-3" data-sidebar-branch>
          <ul data-sidebar-tree>
            <SidebarLink to="https://about.codecov.io/" title="Codecov" path="" />
            <SidebarLink to="https://discord.gg/sentry" title="Discord" path="" />
            <SidebarLink
              to="https://sentry.zendesk.com/hc/en-us/"
              title="Support"
              path=""
            />
            <SidebarLink
              to="https://develop.sentry.dev/self-hosted/"
              title="Self-Hosting Sentry"
              path=""
            />
            <SidebarLink
              to="https://develop.sentry.dev"
              title="Developer Documentation"
              path=""
            />
          </ul>
        </li>
      </ul>
    </div>
  );
}

type PlatformSidebarProps = {
  platformName: string;
  rootNode: DocNode;
  guideName?: string;
};

function PlatformSidebar({rootNode, platformName, guideName}: PlatformSidebarProps) {
  const docNodeToPlatformSidebarNode = (n: DocNode) => {
    if (n.frontmatter.draft) {
      return undefined;
    }
    return {
      context: {
        platform: {
          platformName,
        },
        title: n.frontmatter.title,
        sidebar_order: n.frontmatter.sidebar_order,
        sidebar_title: n.frontmatter.sidebar_title,
      },
      path: '/' + n.path + '/',
    };
  };

  const platformNode = nodeForPath(rootNode, ['platforms', platformName]);
  if (!platformNode) {
    return null;
  }
  const platform = getPlatform(rootNode, platformName);
  if (!platform) {
    return null;
  }
  const nodes = getNavNodes([platformNode], docNodeToPlatformSidebarNode);
  const tree = toTree(nodes.filter(n => !!n.context));
  const guide = guideName && getGuide(rootNode, platformName, guideName);

  const pathRoot = guide
    ? `platforms/${platformName}/guides/${guideName}`
    : `platforms/${platformName}`;

  return (
    <ul data-sidebar-tree>
      <DynamicNav
        root={pathRoot}
        tree={tree}
        title={`Sentry for ${(guide || platform).title}`}
        exclude={[`/${pathRoot}/guides/`]}
        headerClassName={headerClassName}
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
      <ul data-sidebar-tree>
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
    <ul data-sidebar-tree>
      <li className="mb-3" data-sidebar-branch>
        <Fragment>
          <Link
            href={'/' + node.path}
            data-active={node.path === path.join('/')}
            className={activeClassName(
              node,
              [styles['sidebar-title'], 'flex items-center justify-between gap-1'].join(
                ' '
              )
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

function DevelopDocsSidebar({path, rootNode}: {path: string; rootNode: DocNode}) {
  const getNavTree = (root: string) => {
    const apiNodes: NavNode[] = getNavNodes(
      [nodeForPath(rootNode, root)!],
      docNodeToNavNode
    );
    return toTree(apiNodes);
  };
  return (
    <aside className={styles.sidebar}>
      <input type="checkbox" id={sidebarToggleId} className="hidden" />
      <style>{':root { --sidebar-width: 300px; }'}</style>
      <div className="md:flex flex-col items-stretch">
        <div className={styles.toc}>
          <ul data-sidebar-tree>
            <li className="mb-3" data-sidebar-branch>
              <div className={headerClassName} data-sidebar-link>
                <h6>General</h6>
              </div>
              <ul data-sidebar-tree>
                <SidebarLink to="/" title="Overview" path={path} />
                <SidebarLink
                  to="https://github.com/getsentry/.github/blob/master/CODE_OF_CONDUCT.md"
                  title="Code of Conduct"
                  path={path}
                />
                <SidebarLink to="/docs/" title="Documentation Guide" path={path} />
                <SidebarLink to="/inclusion/" title="Inclusive Language" path={path} />
                <SidebarLink to="/translations/" title="Translations" path={path} />
              </ul>
            </li>

            <DynamicNav
              root="api"
              title="API"
              tree={getNavTree('api')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="sdk"
              title="SDK Development"
              tree={getNavTree('sdk')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="self-hosted"
              title="Self-Hosted"
              tree={getNavTree('self-hosted')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="frontend"
              title="Frontend"
              tree={getNavTree('frontend')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="backend"
              title="Backend"
              tree={getNavTree('backend')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="services"
              title="Services"
              tree={getNavTree('services')}
              headerClassName={headerClassName}
              collapse
            />

            <DynamicNav
              root="integrations"
              title="Integrations"
              tree={getNavTree('integrations')}
              headerClassName={headerClassName}
              collapse
            />

            <li className="mb-3" data-sidebar-branch>
              <div className={headerClassName} data-sidebar-link>
                <h6>Development</h6>
              </div>
              <ul data-sidebar-tree>
                <SidebarLink to="/philosophy/" title="Philosophy" path={path} />
                <SidebarLink to="/commit-messages/" title="Commit Messages" path={path} />
                <SidebarLink to="/code-review/" title="Code Review" path={path} />
                <SidebarLink
                  to="/frontend/pull-request-previews/"
                  title="Pull Request Previews"
                  path={path}
                />
                <SidebarLink to="/workflow/" title="Workflow" path={path} />
                <SidebarLink
                  to="/continuous-integration/"
                  title="Continuous Integration"
                  path={path}
                />
                <SidebarLink
                  to="/python-dependencies/"
                  title="Python Dependencies"
                  path={path}
                />
                <SidebarLink
                  to="/database-migrations/"
                  title="Database Migrations"
                  path={path}
                />
                <SidebarLink to="/testing/" title="Testing Tips" path={path} />
                <SidebarLink to="/analytics/" title="Analytics" path={path} />
                <SidebarLink to="/rust/" title="Rust Development" path={path} />
              </ul>
            </li>
            <li className="mb-3" data-sidebar-branch>
              <div className={headerClassName} data-sidebar-link>
                <h6>Application</h6>
              </div>
              <ul data-sidebar-tree>
                <SidebarLink to="/architecture/" title="Architecture" path={path} />
                <SidebarLink
                  to="/sentry-vs-getsentry/"
                  title="sentry vs getsentry"
                  path={path}
                />
                <SidebarLink to="/config/" title="Configuration" path={path} />
                <SidebarLink to="/issue-platform/" title="Issue Platform" path={path} />
                <SidebarLink
                  to="/issue-platform-detectors/"
                  title="Issue Platform - Writing Detectors"
                  path={path}
                />
                <SidebarLink to="/feature-flags/" title="Feature Flags" path={path} />
                <SidebarLink to="/ab-testing/" title="A/B Testing" path={path} />
                <SidebarLink to="/options/" title="Options" path={path} />
                <SidebarLink to="/serializers/" title="Serializers" path={path} />
                <SidebarLink to="/grouping/" title="Grouping" path={path} />
                <SidebarLink to="/api/" title="API" path={path}>
                  {/* <Children tree={tree.find(n => n.name === 'api').children} /> */}
                </SidebarLink>
                <SidebarLink to="/pii/" title="PII and Data Scrubbing" path={path}>
                  <SidebarLink to="/pii/types/" title="Rule Types" path={path} />
                  <SidebarLink to="/pii/methods/" title="Redaction Methods" path={path} />
                  <SidebarLink to="/pii/selectors/" title="Selectors" path={path} />
                </SidebarLink>
                <SidebarLink
                  to="/transaction-clustering/"
                  title="Clustering URL Transactions"
                  path={path}
                />
                <SidebarLink to="/dynamic-sampling/" title="Dynamic Sampling" path={path}>
                  {/* <Children tree={tree.find(n => n.name === 'dynamic-sampling').children} /> */}
                </SidebarLink>
              </ul>
            </li>

            <li className="mb-3" data-sidebar-branch>
              <div className={headerClassName} data-sidebar-link>
                <h6>Resources</h6>
              </div>

              <ul data-sidebar-tree>
                <SidebarLink
                  to="https://docs.sentry.io"
                  title="User Documentation"
                  path={path}
                />
              </ul>
            </li>
            <li className="mb-3" data-sidebar-branch>
              <div className={headerClassName} data-sidebar-link>
                <h6>Meta Documentation</h6>
              </div>

              <ul data-sidebar-tree>
                <SidebarLink
                  to="/docs-components/"
                  title="Documentation Components"
                  path={path}
                />
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
