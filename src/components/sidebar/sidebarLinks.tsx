import {Fragment} from 'react';

import {getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from '../dynamicNav';

import {DefaultSidebar} from './defaultSidebar';
import {PlatformSidebar} from './platformSidebar';
import {ProductSidebar} from './productSidebar';
import {NavNode} from './types';
import {docNodeToNavNode, getNavNodes} from './utils';

/** a root of `"some-root"` maps to the `/some-root/` url */
// todo: we should probably get rid of this
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

export async function SidebarLinks({
  path,
  headerClassName,
}: {
  headerClassName: string;
  path: string[];
}) {
  const rootNode = await getDocsRootNode();
  if (
    productSidebarItems.some(el => el.root === path[0]) ||
    path[0] === 'platform-redirect'
  ) {
    return (
      <ProductSidebar
        rootNode={rootNode}
        items={productSidebarItems}
        headerClassName={headerClassName}
      />
    );
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
              headerClassName={headerClassName}
            />
            <hr />
          </Fragment>
        )}
        <ProductSidebar
          rootNode={rootNode}
          items={productSidebarItems}
          headerClassName={headerClassName}
        />
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
