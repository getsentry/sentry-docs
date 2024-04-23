import {Fragment, SVGAttributes} from 'react';
import {Cross1Icon} from '@radix-ui/react-icons';
import {IconButton} from '@radix-ui/themes';
import Link from 'next/link';

import {
  DocNode,
  extractPlatforms,
  getCurrentGuide,
  getCurrentPlatform,
  getGuide,
  getPlatform,
  nodeForPath,
} from 'sentry-docs/docTree';
import {serverContext} from 'sentry-docs/serverContext';
import {FrontMatter, Platform, PlatformGuide} from 'sentry-docs/types';

import styles from './style.module.scss';

import {DynamicNav, toTree} from '../dynamicNav';
import {ScrollActiveLink} from '../focus-active-link';
import {PlatformSelector} from '../platformSelector';
import {SidebarLink} from '../sidebarLink';

const activeLinkSelector = `.${styles.sidebar} .toc-item .active`;
const headerClassName = `${styles['sidebar-title']} flex items-center`;

export const sidebarToggleId = styles['navbar-menu-toggle'];

export function Sidebar() {
  const {rootNode, path} = serverContext();
  const currentPlatform = rootNode && getCurrentPlatform(rootNode, path);
  const currentGuide = rootNode && getCurrentGuide(rootNode, path);

  const platforms: Platform[] = !rootNode
    ? []
    : extractPlatforms(rootNode).map(platform => {
        const platformForPath =
          nodeForPath(rootNode, [
            'platforms',
            platform.name,
            ...path.slice(currentGuide ? 4 : 2),
          ]) ||
          // try to go one level higher
          nodeForPath(rootNode, [
            'platforms',
            platform.name,
            ...path.slice(currentGuide ? 4 : 2, path.length - 1),
          ]);

        // link to the section of this platform's docs that matches the current path when applicable
        return platformForPath
          ? {...platform, url: '/' + platformForPath.path + '/'}
          : platform;
      });

  return (
    <aside className={styles.sidebar}>
      <input
        type="checkbox"
        id={sidebarToggleId}
        className="hidden"
        defaultChecked={false}
      />
      <style>{':root { --sidebar-width: 300px; }'}</style>
      <div className="flex justify-end">
        <SidebarCloseButton />
      </div>
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
          <SidebarLinks />
        </div>
      </div>
    </aside>
  );
}

function SidebarCloseButton() {
  return (
    <IconButton variant="ghost" asChild>
      <label
        htmlFor={sidebarToggleId}
        className="lg:hidden mb-4 flex justify-end rounded-full p-3 cursor-pointer bg-[var(--white-a11)] shadow"
        aria-label="Close"
        aria-hidden="true"
      >
        <Cross1Icon
          className="text-[var(--gray-10)]"
          strokeWidth="2"
          width="24"
          height="24"
        />
      </label>
    </IconButton>
  );
}

export function SidebarLinks(): JSX.Element | null {
  const {path, rootNode} = serverContext();
  if (!rootNode) {
    return null;
  }

  if (
    [
      'product',
      'platform-redirect',
      'cli',
      'concepts',
      'account',
      'pricing',
      'organization',
      'security-legal-pii',
      'api',
    ].includes(path[0])
  ) {
    return <ProductSidebar rootNode={rootNode} />;
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
  rootNode: DocNode;
};

function ProductSidebar({rootNode}: ProductSidebarProps) {
  /**
   * URL: /account
   */
  const accountNode = nodeForPath(rootNode, 'account');
  if (!accountNode) {
    return null;
  }
  const accountNodes: NavNode[] = getNavNodes([accountNode], docNodeToNavNode);
  const accountTree = toTree(accountNodes.filter(n => !!n.context));

  /**
   * URL: /organization
   */
  const organizationNode = nodeForPath(rootNode, 'organization');
  if (!organizationNode) {
    return null;
  }
  const organizationNodes: NavNode[] = getNavNodes([organizationNode], docNodeToNavNode);
  const organizationTree = toTree(organizationNodes.filter(n => !!n.context));

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
   * URL: /concepts
   */
  const conceptsNode = nodeForPath(rootNode, 'concepts');
  if (!conceptsNode) {
    return null;
  }
  const conceptsNodes: NavNode[] = getNavNodes([conceptsNode], docNodeToNavNode);
  const conceptsTree = toTree(conceptsNodes.filter(n => !!n.context));

  /**
   * URL: /security-legal-pii
   */
  const securityLegalPiiNode = nodeForPath(rootNode, 'security-legal-pii');
  if (!securityLegalPiiNode) {
    return null;
  }
  const securityLegalPiiNodes: NavNode[] = getNavNodes(
    [securityLegalPiiNode],
    docNodeToNavNode
  );
  const securityLegalPiiTree = toTree(securityLegalPiiNodes.filter(n => !!n.context));

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

  /**
   * URL: /api
   */
  const apiNode = nodeForPath(rootNode, 'api');
  if (!apiNode) {
    return null;
  }
  const apiNodes: NavNode[] = getNavNodes([apiNode], docNodeToNavNode);
  const apiTree = toTree(apiNodes.filter(n => !!n.context));

  const {path} = serverContext();
  const fullPath = '/' + path.join('/') + '/';
  return (
    <div>
      <ul data-sidebar-tree>
        <DynamicNav
          root="account"
          title="Configure Your Account"
          tree={accountTree}
          headerClassName={headerClassName}
          collapse
        />
        <DynamicNav
          root="organization"
          title="Configure Your Organization"
          tree={organizationTree}
          headerClassName={headerClassName}
          collapse
        />
        <DynamicNav
          root="product"
          title="Product Walkthroughs"
          tree={productTree}
          headerClassName={headerClassName}
          collapse
        />
        <DynamicNav
          root="pricing"
          title="Pricing & Billing"
          tree={pricingTree}
          collapse
          headerClassName={headerClassName}
        />
        <DynamicNav
          root="cli"
          title="Sentry CLI"
          tree={cliTree}
          collapse
          headerClassName={headerClassName}
        />
        <DynamicNav
          root="concepts"
          title="Concepts & Reference"
          tree={conceptsTree}
          collapse
          headerClassName={headerClassName}
        />
        <DynamicNav
          root="security-legal-pii"
          title="Security, Legal, & PII"
          tree={securityLegalPiiTree}
          collapse
          headerClassName={headerClassName}
        />
        <DynamicNav
          root="api"
          title="Sentry API"
          tree={apiTree}
          collapse
          headerClassName={headerClassName}
        />
      </ul>
      <hr />
      <ul data-sidebar-tree>
        <li className="mb-3" data-sidebar-branch>
          <ul data-sidebar-tree>
            <SidebarLink to="https://about.codecov.io/" title="Codecov" path={fullPath} />
            <SidebarLink to="https://discord.gg/sentry" title="Discord" path={fullPath} />
            <SidebarLink
              to="https://sentry.zendesk.com/hc/en-us/"
              title="Support"
              path={fullPath}
            />
            <SidebarLink
              to="https://develop.sentry.dev/self-hosted/"
              title="Self-Hosting Sentry"
              path={fullPath}
            />
            <SidebarLink
              to="https://develop.sentry.dev"
              title="Developer Documentation"
              path={fullPath}
            />
          </ul>
        </li>
      </ul>
    </div>
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
    <ul data-sidebar-tree>
      <DynamicNav
        root={pathRoot}
        tree={tree}
        title={`Sentry for ${(guide || platform).title}`}
        prependLinks={[[`/${pathRoot}/`, 'Getting Started']]}
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
