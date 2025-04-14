import {Fragment} from 'react';

import {getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from './dynamicNav';
import {PlatformSidebar} from './platformSidebar';
import {ProductSidebar} from './productSidebar';
import {SidebarSeparator} from './sidebarLink';
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

export async function SidebarNavigation({path}: {path: string[]}) {
  const rootNode = await getDocsRootNode();
  // product docs and platform-redirect page
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
            <SidebarSeparator />
          </Fragment>
        )}
        <ProductSidebar rootNode={rootNode} items={productSidebarItems} />
      </Fragment>
    );
  }

  // contributing pages
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
          />
        </ul>
      );
    }
  }

  // This should never happen, all cases need to be handled above
  throw new Error(`Unknown path: ${path.join('/')} - cannot render sidebar`);
}
