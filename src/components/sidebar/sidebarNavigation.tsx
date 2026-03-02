import {Fragment} from 'react';

import {getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';

import {DynamicNav, toTree} from './dynamicNav';
import {PlatformSidebar} from './platformSidebar';
import {ProductSidebar} from './productSidebar';
import {SidebarSeparator} from './sidebarLink';
import {NavNode} from './types';
import {docNodeToNavNode, getNavNodes} from './utils';

export async function SidebarNavigation({path}: {path: string[]}) {
  const rootNode = await getDocsRootNode();

  // Product section: just show the sidebar for /product/ and its children
  if (path[0] === 'product') {
    return (
      <ProductSidebar rootNode={rootNode} items={[{title: 'Product', root: 'product'}]} />
    );
  }

  // AI section
  if (path[0] === 'ai') {
    return (
      <ProductSidebar
        rootNode={rootNode}
        items={[{title: 'Sentry for AI', root: 'ai'}]}
      />
    );
  }

  // Guides section
  if (path[0] === 'guides') {
    return (
      <ProductSidebar rootNode={rootNode} items={[{title: 'Guides', root: 'guides'}]} />
    );
  }

  // SDKs/Platforms
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
      </Fragment>
    );
  }

  // Concepts & Reference (includes CLI which is part of Concepts)
  if (path[0] === 'concepts' || path[0] === 'cli') {
    return (
      <ProductSidebar
        rootNode={rootNode}
        items={[
          {title: 'Concepts & Reference', root: 'concepts'},
          {title: 'Sentry CLI', root: 'cli'},
        ]}
      />
    );
  }

  // "More" section - Admin Settings + Security, Legal, & PII
  if (
    path[0] === 'organization' ||
    path[0] === 'account' ||
    path[0] === 'pricing' ||
    path[0] === 'security-legal-pii'
  ) {
    const moreItems = [
      {title: 'Account Settings', root: 'account'},
      {title: 'Organization Settings', root: 'organization'},
      {title: 'Pricing & Billing', root: 'pricing'},
      {title: 'Security, Legal, & PII', root: 'security-legal-pii'},
    ];
    return <ProductSidebar rootNode={rootNode} items={moreItems} />;
  }

  // API Reference
  if (path[0] === 'api') {
    return (
      <ul data-sidebar-tree>
        <DynamicNav
          root="api"
          title="API Reference"
          tree={toTree(getNavNodes([nodeForPath(rootNode, 'api')!], docNodeToNavNode))}
          collapsible={false}
        />
      </ul>
    );
  }

  // Contributing pages
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

  // Documentation Changelog
  if (path[0] === 'changelog') {
    const changelogNode = nodeForPath(rootNode, 'changelog');
    if (changelogNode) {
      const changelogNodes: NavNode[] = getNavNodes([changelogNode], docNodeToNavNode);
      return (
        <ul data-sidebar-tree>
          <DynamicNav
            root="changelog"
            title="Documentation Changelog"
            tree={toTree(changelogNodes)}
          />
        </ul>
      );
    }
    // Return empty sidebar if no changelog node exists
    return <ul data-sidebar-tree />;
  }

  // Platform redirect page - no sidebar needed
  if (path[0] === 'platform-redirect') {
    return <ul data-sidebar-tree />;
  }

  // This should never happen, all cases need to be handled above
  throw new Error(`Unknown path: ${path.join('/')} - cannot render sidebar`);
}
