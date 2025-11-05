import {Fragment} from 'react';

import {getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from './dynamicNav';
import {PlatformSidebar} from './platformSidebar';
import {ProductSidebar} from './productSidebar';
import {SidebarSeparator} from './sidebarLink';
import {NavNode} from './types';
import {docNodeToNavNode, getNavNodes} from './utils';

import { msg } from 'gt-next';
import { getGT } from 'gt-next/server';

/** a root of `"some-root"` maps to the `/some-root/` url */
// todo: we should probably get rid of this
const productSidebarItems = [
  {
    title: msg('Account Settings'),
    root: 'account',
  },
  {
    title: msg('Organization Settings'),
    root: 'organization',
  },
  {
    title: msg('Product Walkthroughs'),
    root: 'product',
  },
  {
    title: msg('Pricing & Billing'),
    root: 'pricing',
  },
  {
    title: msg('Sentry CLI'),
    root: 'cli',
  },
  {
    title: msg('Sentry API'),
    root: 'api',
  },
  {
    title: msg('Security, Legal, & PII'),
    root: 'security-legal-pii',
  },
  {
    title: msg('Concepts & Reference'),
    root: 'concepts',
  },
  {
    title: msg('Documentation Changelog'),
    root: 'changelog',
  },
];

export async function SidebarNavigation({path}: {path: string[]}) {
  const gt = await getGT();
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
            title={gt('Contributing to Docs')}
            tree={toTree(contribNodes)}
          />
        </ul>
      );
    }
  }

  // This should never happen, all cases need to be handled above
  throw new Error(`Unknown path: ${path.join('/')} - cannot render sidebar`);
}
